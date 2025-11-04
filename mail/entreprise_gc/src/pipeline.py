"""
Pipeline principal d'orchestration pour Entreprises GC Romandie.
"""
import argparse
import logging
import sys
from pathlib import Path
from typing import List, Optional

import pandas as pd
from tqdm import tqdm

logger = logging.getLogger(__name__)


def load_sources(cantons: List[str], max_per_canton: Optional[int] = None) -> pd.DataFrame:
    """
    Charge toutes les sources de données.
    
    Args:
        cantons: Liste de codes cantons à charger
        max_per_canton: Limite d'entreprises par canton (None = illimité)
        
    Returns:
        DataFrame agrégé de toutes les sources
    """
    from .sources import sia_pdf_vaud, suisse_ing, local_annuaire
    
    logger.info(f"Chargement sources pour cantons: {', '.join(cantons)}")
    
    all_dfs = []
    
    # Source 1: Suisse.ing
    try:
        df_suisse = suisse_ing.load_suisse_ing(cantons=cantons)
        if not df_suisse.empty:
            logger.info(f"Suisse.ing: {len(df_suisse)} entreprises")
            all_dfs.append(df_suisse)
    except Exception as e:
        logger.error(f"Erreur chargement Suisse.ing: {e}")
    
    # Source 2: SIA PDF Vaud (si canton VD)
    if 'VD' in cantons:
        sia_path = Path(__file__).parent.parent.parent / 'data' / 'raw' / 'sia_vaud.pdf'
        if sia_path.exists():
            try:
                df_sia = sia_pdf_vaud.load_sia_pdf_vaud(str(sia_path))
                if not df_sia.empty:
                    logger.info(f"SIA Vaud: {len(df_sia)} entreprises")
                    all_dfs.append(df_sia)
            except Exception as e:
                logger.error(f"Erreur chargement SIA Vaud: {e}")
    
    # TODO: Ajouter autres sources (annuaires locaux, etc.)
    
    # Concaténer tous les DataFrames
    if all_dfs:
        df_raw = pd.concat(all_dfs, ignore_index=True)
        logger.info(f"Total brut: {len(df_raw)} entreprises")
        
        # Limiter si max_per_canton
        if max_per_canton:
            df_raw = df_raw.groupby('canton').head(max_per_canton).reset_index(drop=True)
            logger.info(f"Après limite: {len(df_raw)} entreprises")
    else:
        df_raw = pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                       'email', 'telephone', 'source_url', 'notes'])
        logger.warning("Aucune source n'a retourné de données")
    
    return df_raw


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalise un DataFrame d'entreprises.
    
    Args:
        df: DataFrame brut
        
    Returns:
        DataFrame normalisé
    """
    from .utils import normalize_company_name, normalize_url, normalize_text
    
    logger.info("Normalisation des données...")
    
    df = df.copy()
    
    # Normaliser noms
    if 'company_name' in df.columns:
        df['company_name'] = df['company_name'].apply(
            lambda x: normalize_text(str(x)) if pd.notna(x) else None
        )
    
    # Normaliser URLs
    if 'site_web' in df.columns:
        df['site_web'] = df['site_web'].apply(normalize_url)
    
    # Normaliser colonnes texte
    text_cols = ['ville', 'specialites', 'notes', 'telephone']
    for col in text_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: normalize_text(str(x)) if pd.notna(x) else None)
    
    return df


def crawl_and_enrich(df: pd.DataFrame, no_crawl: bool = False) -> pd.DataFrame:
    """
    Enrichit les entreprises en crawlant leurs sites web.
    
    Args:
        df: DataFrame d'entreprises
        no_crawl: Si True, ne pas crawler
        
    Returns:
        DataFrame enrichi
    """
    if no_crawl:
        logger.info("Mode --no-crawl activé, skip enrichissement")
        return df
    
    from .crawler import SiteEnricher
    
    logger.info("Enrichissement via crawl...")
    
    enricher = SiteEnricher()
    
    # Filtrer lignes avec site web et sans email valide
    to_enrich = df[
        df['site_web'].notna() & 
        (df['email'].isna() | (df['email'] == 'formulaire'))
    ].copy()
    
    if to_enrich.empty:
        logger.info("Aucune entreprise à enrichir")
        return df
    
    logger.info(f"Enrichissement de {len(to_enrich)} entreprises...")
    
    all_errors = []
    for idx, row in tqdm(to_enrich.iterrows(), total=len(to_enrich), desc="Crawl"):
        try:
            existing_email = row.get('email')
            enriched = enricher.enrich_site(row['site_web'], existing_email)
            
            # Mettre à jour
            if 'email' in enriched:
                df.at[idx, 'email'] = enriched['email']
            if enriched.get('phones'):
                df.at[idx, 'telephone'] = enriched['phones'][0]
            if enriched.get('specialites'):
                df.at[idx, 'specialites'] = enriched['specialites']
            if enriched.get('errors'):
                all_errors.append({
                    'url': row['site_web'],
                    'errors': enriched['errors']
                })
        except Exception as e:
            logger.error(f"Erreur enrichissement: {e}")
            all_errors.append({
                'url': row.get('site_web', 'unknown'),
                'errors': [str(e)]
            })
    
    if all_errors:
        logger.warning(f"{len(all_errors)} erreurs d'enrichissement enregistrées")
    
    return df


def add_classifications(df: pd.DataFrame) -> pd.DataFrame:
    """
    Ajoute les classifications tag_gc.
    
    Args:
        df: DataFrame
        
    Returns:
        DataFrame avec tag_gc
    """
    from .utils import classify_tag_gc
    
    logger.info("Classification tag_gc...")
    
    def classify_row(row):
        specialites = str(row.get('specialites', '')) if pd.notna(row.get('specialites')) else ''
        company_name = str(row.get('company_name', '')) if pd.notna(row.get('company_name')) else ''
        return classify_tag_gc(specialites, company_name)
    
    df['tag_gc'] = df.apply(classify_row, axis=1)
    
    # Stats
    tag_counts = df['tag_gc'].value_counts()
    logger.info(f"Répartition tag_gc: {dict(tag_counts)}")
    
    return df


def export_csv(df: pd.DataFrame, output_path: Path) -> None:
    """
    Exporte un DataFrame en CSV.
    
    Args:
        df: DataFrame
        output_path: Chemin de sortie
    """
    logger.info(f"Export CSV vers {output_path}")
    
    # Colonnes finales
    final_cols = ['company_name', 'canton', 'ville', 'site_web', 'email', 'telephone', 
                  'specialites', 'source_url', 'notes', 'tag_gc']
    
    # Garder seulement colonnes présentes
    df_export = df[[col for col in final_cols if col in df.columns]].copy()
    
    # Réorganiser colonnes
    present_cols = [col for col in final_cols if col in df_export.columns]
    df_export = df_export[present_cols]
    
    # Export
    df_export.to_csv(output_path, index=False, encoding='utf-8')
    logger.info(f"Export terminé: {len(df_export)} lignes")


def push_to_google_sheets(df: pd.DataFrame, spreadsheet_id: str, worksheet_name: str = 'Companies') -> None:
    """
    Push vers Google Sheets via gspread.
    
    Args:
        df: DataFrame
        spreadsheet_id: ID de la feuille Google
        worksheet_name: Nom de l'onglet
    """
    try:
        import gspread
        from google.oauth2.service_account import Credentials
    except ImportError:
        logger.error("gspread ou google-auth non installés, skip Google Sheets")
        return
    
    logger.info("Push vers Google Sheets...")
    
    # Credentials
    creds_path = Path(__file__).parent / 'config' / 'service_account.json'
    if not creds_path.exists():
        logger.error(f"Credentials introuvables: {creds_path}")
        return
    
    try:
        scope = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(str(creds_path), scopes=scope)
        gc = gspread.authorize(creds)
        
        # Ouvrir feuille
        sheet = gc.open_by_key(spreadsheet_id)
        worksheet = sheet.worksheet(worksheet_name)
        
        # Clear et push
        worksheet.clear()
        worksheet.append_row(df.columns.tolist())
        worksheet.append_rows(df.values.tolist())
        
        logger.info(f"Push réussi: {len(df)} lignes")
    except Exception as e:
        logger.error(f"Erreur push Google Sheets: {e}")


def main():
    """
    Fonction principale du pipeline.
    """
    parser = argparse.ArgumentParser(
        description="Pipeline Entreprises GC Romandie",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  python -m src.pipeline --cantons "GE,VD"
  python -m src.pipeline --cantons "VD" --max-per-canton 50 --no-crawl
  python -m src.pipeline --sheets
        """
    )
    
    parser.add_argument('--cantons', type=str, default="GE,VD,VS,FR,NE,JU",
                       help="Codes cantons séparés par virgule (default: GE,VD,VS,FR,NE,JU)")
    parser.add_argument('--max-per-canton', type=int, default=None,
                       help="Limite d'entreprises par canton (default: None)")
    parser.add_argument('--no-crawl', action='store_true',
                       help="Ne pas crawler les sites web")
    parser.add_argument('--sheets', action='store_true',
                       help="Push vers Google Sheets (nécessite credentials)")
    parser.add_argument('--output', type=str, default=None,
                       help="Chemin de sortie CSV (default: data/final/companies_gc_romandie.csv)")
    
    args = parser.parse_args()
    
    # Parse cantons
    cantons = [c.strip().upper() for c in args.cantons.split(',')]
    
    # Créer dossiers
    data_dir = Path(__file__).parent.parent.parent / 'data'
    (data_dir / 'raw').mkdir(parents=True, exist_ok=True)
    (data_dir / 'intermediate').mkdir(parents=True, exist_ok=True)
    (data_dir / 'final').mkdir(parents=True, exist_ok=True)
    
    # Config logging APRÈS création des dossiers
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(data_dir / 'intermediate' / 'errors.log'),
            logging.StreamHandler(sys.stdout)
        ],
        force=True  # Override si déjà configuré
    )
    
    try:
        # 1. Charger sources
        df = load_sources(cantons, args.max_per_canton)
        
        if df.empty:
            logger.error("Aucune donnée à traiter")
            return 1
        
        logger.info(f"Total: {len(df)} entreprises")
        
        # 2. Normaliser
        df = normalize_dataframe(df)
        
        # 3. Crawler et enrichir
        df = crawl_and_enrich(df, args.no_crawl)
        
        # 4. Dédupliquer
        logger.info("Déduplication...")
        from .utils import deduplicate_dataframe
        df = deduplicate_dataframe(df)
        logger.info(f"Après dédup: {len(df)} entreprises")
        
        # 5. Classifier
        df = add_classifications(df)
        
        # 6. Exporter
        if args.output:
            output_path = Path(args.output)
        else:
            output_path = data_dir / 'final' / 'companies_gc_romandie.csv'
        
        export_csv(df, output_path)
        
        # 7. Optionnel: Google Sheets
        if args.sheets:
            spreadsheet_id = "YOUR_SPREADSHEET_ID"  # TODO: config
            push_to_google_sheets(df, spreadsheet_id)
        
        logger.info("Pipeline terminé avec succès")
        return 0
        
    except Exception as e:
        logger.error(f"Erreur pipeline: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())

