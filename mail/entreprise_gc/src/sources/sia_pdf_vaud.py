"""
Parseur du PDF SIA Vaud (section Ingénieurs civils).
"""
import logging
import pdfplumber
import pandas as pd
from typing import Optional
from ..utils import normalize_company_name, normalize_url
from ..utils.regex_patterns import extract_emails, extract_phones

logger = logging.getLogger(__name__)


def parse_sia_pdf_vaud(pdf_path: str) -> pd.DataFrame:
    """
    Parse un PDF SIA Vaud et extrait les informations d'entreprises.
    
    Args:
        pdf_path: Chemin vers le PDF
        
    Returns:
        DataFrame avec colonnes: company_name, canton, ville, site_web, email, telephone, source_url
    """
    companies = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                text = page.extract_text()
                
                if not text:
                    continue
                
                # Chercher entrées entreprises
                # Format typique: Nom entreprise, Adresse, Ville, Tél, Email, Site
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                
                # Heuristique simple pour détecter entrées
                # TODO: Adapter selon format réel du PDF
                current_entry = {}
                
                for i, line in enumerate(lines):
                    # Détecter email
                    emails = extract_emails(line)
                    if emails:
                        current_entry['email'] = emails[0]
                    
                    # Détecter téléphone
                    phones = extract_phones(line)
                    if phones:
                        current_entry['telephone'] = phones[0]
                    
                    # Détecter URL
                    if 'http' in line.lower():
                        words = line.split()
                        for word in words:
                            if word.startswith('http'):
                                current_entry['site_web'] = normalize_url(word)
                                break
                    
                    # Si ligne contient Vaud, ce pourrait être une entreprise
                    if 'Vaud' in line or i % 5 == 0:
                        if current_entry:
                            current_entry['canton'] = 'VD'
                            current_entry['ville'] = current_entry.get('ville', 'Vaud')
                            current_entry['source_url'] = f"file://{pdf_path}#page={page_num+1}"
                            companies.append(current_entry)
                            current_entry = {}
        
        # Créer DataFrame
        if companies:
            df = pd.DataFrame(companies)
            # Remplir colonnes manquantes
            for col in ['company_name', 'canton', 'ville', 'site_web', 'email', 'telephone', 'source_url']:
                if col not in df.columns:
                    df[col] = None
            return df
        else:
            # Retourner DataFrame vide avec colonnes
            return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                        'email', 'telephone', 'source_url'])
    
    except Exception as e:
        logger.error(f"Erreur parsing PDF {pdf_path}: {e}")
        return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                    'email', 'telephone', 'source_url'])


def load_sia_pdf_vaud(pdf_path: Optional[str] = None) -> pd.DataFrame:
    """
    Charge les données SIA Vaud depuis un PDF.
    
    Si pdf_path est None, retourne un DataFrame vide (pas de source par défaut).
    
    Args:
        pdf_path: Chemin vers le PDF (optionnel)
        
    Returns:
        DataFrame avec entreprises
    """
    if not pdf_path:
        logger.info("Pas de PDF SIA Vaud fourni")
        return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                    'email', 'telephone', 'source_url'])
    
    return parse_sia_pdf_vaud(pdf_path)


__all__ = ['load_sia_pdf_vaud', 'parse_sia_pdf_vaud']

