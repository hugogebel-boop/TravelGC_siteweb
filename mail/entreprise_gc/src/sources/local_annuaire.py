"""
Connecteurs génériques pour annuaires locaux.
"""
import logging
import pandas as pd
from typing import List, Optional
import httpx
from bs4 import BeautifulSoup
from ..utils import normalize_url

logger = logging.getLogger(__name__)


class GenericAnnuaireScraper:
    """
    Scraper générique pour pages annuaires HTML simples.
    """
    
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
    
    def scrape_page(self, url: str, name_selector: str = "h2, h3", 
                   info_selector: str = "p, div") -> List[dict]:
        """
        Scrape une page HTML générique d'annuaire.
        
        Args:
            url: URL de la page
            name_selector: Selector CSS pour nom entreprise
            info_selector: Selector CSS pour infos complémentaires
            
        Returns:
            Liste de dicts entreprises
        """
        companies = []
        
        try:
            with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                response = client.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; GC-Romandie-Bot/1.0)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
                })
                response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Trouver éléments de nom
            name_elems = soup.select(name_selector)
            
            for elem in name_elems:
                company = {
                    'company_name': elem.get_text(strip=True),
                    'source_url': url
                }
                
                # Chercher infos dans éléments suivants
                next_siblings = elem.find_next_siblings(limit=5)
                for sibling in next_siblings:
                    text = sibling.get_text()
                    
                    # URLs
                    links = sibling.find_all('a', href=True)
                    for link in links:
                        href = link['href']
                        if href.startswith('http'):
                            company['site_web'] = normalize_url(href)
                    
                    # Emails
                    from ..utils.regex_patterns import extract_emails
                    emails = extract_emails(text)
                    if emails:
                        company['email'] = emails[0]
                
                if company.get('company_name'):
                    companies.append(company)
        
        except Exception as e:
            logger.error(f"Erreur scrape page {url}: {e}")
        
        return companies


def load_generic_annuaire(url: str, canton: str) -> pd.DataFrame:
    """
    Charge depuis un annuaire générique.
    
    Args:
        url: URL de l'annuaire
        canton: Code canton
        
    Returns:
        DataFrame avec entreprises
    """
    scraper = GenericAnnuaireScraper()
    companies = scraper.scrape_page(url)
    
    # Ajouter canton si manquant
    for company in companies:
        if 'canton' not in company:
            company['canton'] = canton
    
    if companies:
        df = pd.DataFrame(companies)
        # Remplir colonnes manquantes
        for col in ['company_name', 'canton', 'ville', 'site_web', 'email', 'telephone', 'source_url']:
            if col not in df.columns:
                df[col] = None
        return df
    else:
        return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                    'email', 'telephone', 'source_url'])


__all__ = ['load_generic_annuaire', 'GenericAnnuaireScraper']

