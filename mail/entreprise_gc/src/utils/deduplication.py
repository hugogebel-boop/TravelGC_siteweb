"""
Module de déduplication des entreprises.
"""
import pandas as pd
from typing import Optional
from .normalizers import normalize_company_name, extract_main_words
from .regex_patterns import extract_domain
from tldextract import extract as tld_extract


def deduplicate_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Déduplique un DataFrame d'entreprises.
    
    Stratégie:
    1. Normaliser noms
    2. Clés de dédup: domaine > nom+ville > nom
    3. Conserver fiche la plus riche
    
    Args:
        df: DataFrame avec colonnes: company_name, canton, ville, site_web, email, etc.
        
    Returns:
        DataFrame dédupliqué
    """
    if df.empty:
        return df
    
    df = df.copy()
    
    # Normaliser noms
    df['_name_normalized'] = df['company_name'].apply(normalize_company_name)
    df['_main_words'] = df['company_name'].apply(extract_main_words)
    
    # Extraire domaines
    def get_domain(row):
        if pd.notna(row.get('site_web')) and row['site_web']:
            try:
                result = tld_extract(row['site_web'])
                return result.registered_domain or result.domain
            except:
                pass
        return None
    
    df['_domain'] = df.apply(get_domain, axis=1)
    
    # Score de richesse
    def richness_score(row):
        score = 0
        
        # Champs remplis
        for col in ['email', 'telephone', 'site_web', 'specialites', 'ville', 'canton']:
            if pd.notna(row.get(col)) and row[col]:
                score += 1
        
        # Email non-webmail bonus
        if pd.notna(row.get('email')) and row['email']:
            from .regex_patterns import is_webmail
            if not is_webmail(row['email']):
                score += 2
            elif 'formulaire' not in row['email'].lower():
                score += 1
        
        # Email générique bonus
        if pd.notna(row.get('email')) and row['email']:
            generic = ['info@', 'contact@', 'office@', 'bureau@', 'info@']
            if any(row['email'].lower().startswith(g) for g in generic):
                score += 1
        
        return score
    
    df['_richness'] = df.apply(richness_score, axis=1)
    
    # Grouper par clé de dédup
    groups = []
    used_indices = set()
    
    # Prioritizer: domaine > nom+ville > nom
    for idx, row in df.iterrows():
        if idx in used_indices:
            continue
        
        # Trouver doublons potentiels
        duplicates = [idx]
        key = None
        
        # Essai 1: domaine
        if pd.notna(row['_domain']) and row['_domain']:
            for other_idx, other_row in df.iterrows():
                if other_idx != idx and other_idx not in used_indices:
                    if other_row['_domain'] == row['_domain']:
                        duplicates.append(other_idx)
                        key = f"domain:{row['_domain']}"
        
        # Essai 2: nom+ville
        if len(duplicates) == 1:
            for other_idx, other_row in df.iterrows():
                if other_idx != idx and other_idx not in used_indices:
                    if (other_row['_name_normalized'] == row['_name_normalized'] and
                        pd.notna(other_row['ville']) and pd.notna(row['ville']) and
                        other_row['ville'].strip().lower() == row['ville'].strip().lower()):
                        duplicates.append(other_idx)
                        key = f"name+ville:{row['_name_normalized']}+{row['ville']}"
        
        # Essai 3: nom seulement (si similaire)
        if len(duplicates) == 1:
            for other_idx, other_row in df.iterrows():
                if other_idx != idx and other_idx not in used_indices:
                    if (other_row['_name_normalized'] == row['_name_normalized'] or
                        (other_row['_main_words'] == row['_main_words'] and row['_main_words'])):
                        duplicates.append(other_idx)
                        key = f"name:{row['_name_normalized']}"
        
        # Si doublons, conserver le plus riche
        if len(duplicates) > 1:
            best_idx = max(duplicates, key=lambda i: df.loc[i, '_richness'])
        else:
            best_idx = idx
        
        groups.append({
            'keep_idx': best_idx,
            'duplicates': duplicates,
            'key': key or f"unique:{idx}"
        })
        
        used_indices.update(duplicates)
    
    # Garder les meilleurs
    keep_indices = [g['keep_idx'] for g in groups]
    result = df.loc[keep_indices].copy()
    
    # Retirer colonnes internes
    result = result.drop(columns=['_name_normalized', '_main_words', '_domain', '_richness'], errors='ignore')
    
    # Réindexer
    result = result.reset_index(drop=True)
    
    return result


def add_deduplication_notes(df: pd.DataFrame) -> pd.DataFrame:
    """
    Ajoute des notes sur la déduplication pour debug.
    
    Args:
        df: DataFrame
        
    Returns:
        DataFrame avec colonne notes enrichie
    """
    df = df.copy()
    
    # Initialiser notes si manquante
    if 'notes' not in df.columns:
        df['notes'] = ""
    
    # Marquer emails suspects
    def check_email(row):
        notes = str(row.get('notes', '')) if pd.notna(row.get('notes')) else ""
        
        if pd.notna(row.get('email')) and row['email']:
            from .regex_patterns import extract_domain, is_webmail
            email_domain = extract_domain(row['email'])
            site_domain = None
            
            if pd.notna(row.get('site_web')) and row['site_web']:
                result = tld_extract(row['site_web'])
                site_domain = result.registered_domain or result.domain
            
            # Incohérence domaine
            if email_domain and site_domain and email_domain != site_domain:
                if not is_webmail(row['email']):
                    notes += f"Domaine email ≠ site; "
            
            # Webmail
            if is_webmail(row['email']):
                notes += f"Email webmail; "
        
        return notes.rstrip('; ')
    
    df['notes'] = df.apply(check_email, axis=1)
    
    return df


def mark_potential_duplicates(df: pd.DataFrame, threshold: float = 0.85) -> pd.DataFrame:
    """
    Marque les doublons potentiels via fuzzy matching (optionnel, pour review manuelle).
    
    Args:
        df: DataFrame
        threshold: Score de similarité minimum
        
    Returns:
        DataFrame avec colonne _potential_duplicate
    """
    try:
        from rapidfuzz import fuzz, process
    except ImportError:
        # Rapidfuzz non dispo, passer
        df['_potential_duplicate'] = False
        return df
    
    df = df.copy()
    df['_potential_duplicate'] = False
    
    # Pour chaque ligne, chercher similaire
    names_normalized = df['company_name'].apply(normalize_company_name).tolist()
    
    for idx in df.index:
        name_norm = names_normalized[idx]
        matches = process.extract(name_norm, names_normalized, limit=5, scorer=fuzz.ratio)
        
        # Ignorer self et très courts
        if len(name_norm) < 5:
            continue
        
        for match_name, score, _ in matches:
            if score >= threshold * 100 and match_name != name_norm:
                df.loc[idx, '_potential_duplicate'] = True
                break
    
    return df

