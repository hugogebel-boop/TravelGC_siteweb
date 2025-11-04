"""
Connecteur pour suisse.ing (ex-USIC).
"""
import logging
import time
import pandas as pd
from typing import List, Optional
import httpx
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

from ..utils import normalize_url
from ..utils.regex_patterns import extract_emails

logger = logging.getLogger(__name__)

# Cantons romands
ROMAND_CANTONS = {
    'GE': 'Genève',
    'VD': 'Vaud',
    'VS': 'Valais',
    'FR': 'Fribourg',
    'NE': 'Neuchâtel',
    'JU': 'Jura'
}


class SuisseIngScraper:
    """
    Scraper pour suisse.ing.
    """
    
    BASE_URL = "https://suisse.ing"
    
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def _fetch_url(self, url: str) -> Optional[httpx.Response]:
        """
        Récupère une URL avec retry.
        """
        try:
            with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                response = client.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; GC-Romandie-Bot/1.0)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
                })
                response.raise_for_status()
                return response
        except Exception as e:
            logger.warning(f"Erreur fetch {url}: {e}")
            raise
    
    def scrape_canton(self, canton_code: str) -> List[dict]:
        """
        Scrape les entreprises d'un canton.
        
        Args:
            canton_code: Code canton (GE, VD, etc.)
            
        Returns:
            Liste de dicts entreprises
        """
        if canton_code not in ROMAND_CANTONS:
            logger.warning(f"Canton {canton_code} non supporté")
            return []
        
        companies = []
        
        # TODO: Adapter URL selon structure réelle de suisse.ing
        # URL hypothétique
        search_url = f"{self.BASE_URL}/search?canton={canton_code}&specialite=ingenieur-civil"
        
        try:
            response = self._fetch_url(search_url)
            if not response:
                return []
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            # Adapter sélecteurs selon structure HTML réelle
            # Exemple générique:
            company_divs = soup.find_all('div', class_=lambda x: x and 'company' in str(x).lower())
            
            for div in company_divs:
                company = {}
                
                # Nom entreprise
                name_elem = div.find('h3') or div.find('h2') or div.find('a', class_=lambda x: x and 'name' in str(x).lower())
                if name_elem:
                    company['company_name'] = name_elem.get_text(strip=True)
                
                # Ville
                ville_elem = div.find('span', class_=lambda x: x and 'ville' in str(x).lower())
                if not ville_elem:
                    ville_elem = div.find(string=lambda x: x and ROMAND_CANTONS.get(canton_code, '').lower() in x.lower() if isinstance(x, str) else False)
                if ville_elem:
                    if isinstance(ville_elem, str):
                        company['ville'] = ville_elem.strip()
                    else:
                        company['ville'] = ville_elem.get_text(strip=True)
                
                # Site web
                link = div.find('a', href=lambda x: x and x.startswith('http'))
                if link:
                    company['site_web'] = normalize_url(link['href'])
                
                # Email (souvent pas sur page liste, nécessite crawl individual)
                
                company['canton'] = canton_code
                company['source_url'] = search_url
                
                if company.get('company_name'):
                    companies.append(company)
            
            # Rate limit
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Erreur scrape canton {canton_code}: {e}")
        
        return companies
    
    def scrape_all_romand(self) -> pd.DataFrame:
        """
        Scrape tous les cantons romands.
        
        Returns:
            DataFrame avec entreprises
        """
        all_companies = []
        
        for canton_code in ROMAND_CANTONS.keys():
            logger.info(f"Scraping canton {canton_code}...")
            companies = self.scrape_canton(canton_code)
            all_companies.extend(companies)
        
        if all_companies:
            df = pd.DataFrame(all_companies)
            # Remplir colonnes manquantes
            for col in ['company_name', 'canton', 'ville', 'site_web', 'email', 'telephone', 'source_url']:
                if col not in df.columns:
                    df[col] = None
            return df
        else:
            return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                        'email', 'telephone', 'source_url'])


def load_suisse_ing(cantons: Optional[List[str]] = None) -> pd.DataFrame:
    """
    Charge les données depuis suisse.ing.
    
    Args:
        cantons: Liste de codes cantons (None = tous les romands)
        
    Returns:
        DataFrame avec entreprises
    """
    scraper = SuisseIngScraper()
    
    if not cantons:
        cantons = list(ROMAND_CANTONS.keys())
    
    all_companies = []
    
    for canton in cantons:
        logger.info(f"Scraping suisse.ing pour {canton}...")
        companies = scraper.scrape_canton(canton)
        all_companies.extend(companies)
    
    if all_companies:
        df = pd.DataFrame(all_companies)
        # Remplir colonnes manquantes
        for col in ['company_name', 'canton', 'ville', 'site_web', 'email', 'telephone', 'source_url']:
            if col not in df.columns:
                df[col] = None
        return df
    else:
        return pd.DataFrame(columns=['company_name', 'canton', 'ville', 'site_web', 
                                    'email', 'telephone', 'source_url'])


__all__ = ['load_suisse_ing', 'SuisseIngScraper']

