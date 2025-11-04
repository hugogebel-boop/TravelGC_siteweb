"""
Module de crawling et enrichissement de sites web.
"""
import logging
import re
import time
import pandas as pd
from typing import Optional, Tuple
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

from ..utils import extract_emails, extract_phones, normalize_url

logger = logging.getLogger(__name__)


# User agent personnalisé
USER_AGENT = "Mozilla/5.0 (compatible; GC-Romandie-Bot/1.0; +https://github.com/example/gc-romandie)"


class SiteEnricher:
    """
    Classe pour enrichir des fiches d'entreprises en crawlant leurs sites web.
    """
    
    def __init__(self, timeout: int = 12, max_retries: int = 3, rate_limit: float = 1.0):
        """
        Args:
            timeout: Timeout par requête (secondes)
            max_retries: Nombre max de tentatives
            rate_limit: Délai entre requêtes (secondes)
        """
        self.timeout = timeout
        self.max_retries = max_retries
        self.rate_limit = rate_limit
        self.last_request_time = {}
        
        # Pages à scanner pour infos de contact
        self.contact_paths = [
            '/contact',
            '/fr/contact',
            '/de/contact',
            '/en/contact',
            '/nous-contacter',
            '/impressum',
            '/mentions-legales',
            '/legal',
            '/imprint',
            '/about',
            '/a-propos',
            '/equipe',
            '/team',
            '/prestations',
            '/services',
            '/projets',
            '/projects'
        ]
    
    def _wait_rate_limit(self, domain: str):
        """
        Attend pour respecter le rate limit par domaine.
        """
        if domain in self.last_request_time:
            elapsed = time.time() - self.last_request_time[domain]
            if elapsed < self.rate_limit:
                time.sleep(self.rate_limit - elapsed)
        
        self.last_request_time[domain] = time.time()
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def _fetch_url(self, url: str) -> Optional[httpx.Response]:
        """
        Récupère une URL avec retry.
        """
        try:
            with httpx.Client(timeout=self.timeout, follow_redirects=True, verify=True) as client:
                response = client.get(url, headers={
                    'User-Agent': USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br'
                })
                response.raise_for_status()
                return response
        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError) as e:
            logger.warning(f"Erreur fetch {url}: {e}")
            raise
    
    def _parse_html(self, html: str, base_url: str) -> dict:
        """
        Parse le HTML et extrait emails, téléphones, spécialités.
        
        Args:
            html: Contenu HTML
            base_url: URL de base pour liens relatifs
            
        Returns:
            Dict avec emails, phones, specialites
        """
        soup = BeautifulSoup(html, 'lxml')
        
        # Extraire tout le texte
        text = soup.get_text(separator=' ', strip=True)
        
        # Emails
        emails = extract_emails(text)
        emails.extend(extract_emails(html))  # Aussi dans HTML brut (obfuscation)
        
        # Téléphones
        phones = extract_phones(text)
        
        # Spécialités: chercher sur certaines pages
        specialites = ""
        try:
            # Choisir sections pertinentes
            selectors = ['#services', '#prestations', '.services', '.prestations',
                        'section[class*="service"]', '[class*="speciality"]']
            
            for selector in selectors:
                elements = soup.select(selector)
                for elem in elements:
                    specialites += " " + elem.get_text(separator=' ', strip=True)
            
            # Limiter longueur
            specialites = specialites[:2000].strip()
        except:
            pass
        
        return {
            'emails': list(set(emails)),  # Dédupliquer
            'phones': list(set(phones)),
            'specialites': specialites
        }
    
    def enrich_site(self, site_web: str, existing_email: Optional[str] = None) -> dict:
        """
        Enrichit une fiche avec les infos du site web.
        
        Args:
            site_web: URL du site
            existing_email: Email existant (pour ne pas crawler si présent)
            
        Returns:
            Dict avec emails, phones, specialites, source_url
        """
        if not site_web:
            return {}
        
        # Normaliser URL
        url = normalize_url(site_web)
        if not url:
            return {}
        
        # Si déjà un email valide, skip crawl si court
        if existing_email and existing_email != "formulaire":
            return {'source_url': url}
        
        # Déterminer domaine pour rate limit
        try:
            from tldextract import extract as tld_extract
            result = tld_extract(url)
            domain = result.registered_domain or result.domain
        except:
            domain = urlparse(url).netloc
        
        # Rate limit
        self._wait_rate_limit(domain)
        
        result = {
            'emails': [],
            'phones': [],
            'specialites': '',
            'source_url': url,
            'errors': []
        }
        
        # Essayer page d'accueil
        try:
            response = self._fetch_url(url)
            if response:
                parsed = self._parse_html(response.text, url)
                result['emails'].extend(parsed['emails'])
                result['phones'].extend(parsed['phones'])
                result['specialites'] = parsed['specialites']
        except Exception as e:
            result['errors'].append(f"Homepage: {str(e)}")
        
        # Essayer pages de contact si pas d'email trouvé
        if not result['emails'] and not existing_email:
            for path in self.contact_paths[:8]:  # Limiter à 8 essais
                try:
                    contact_url = urljoin(url, path)
                    self._wait_rate_limit(domain)
                    response = self._fetch_url(contact_url)
                    
                    if response and response.url != url:  # Vérifier redirect
                        parsed = self._parse_html(response.text, contact_url)
                        result['emails'].extend(parsed['emails'])
                        result['phones'].extend(parsed['phones'])
                        if not result['specialites']:
                            result['specialites'] = parsed['specialites']
                        
                        # Arrêter si email trouvé
                        if result['emails']:
                            result['source_url'] = contact_url
                            break
                except Exception as e:
                    result['errors'].append(f"{path}: {str(e)}")
                    continue
        
        # Nettoyer et dédupliquer emails
        if result['emails']:
            # Prioriser emails génériques
            generic_emails = []
            other_emails = []
            
            for email in result['emails']:
                if any(email.lower().startswith(prefix) for prefix in 
                       ['info@', 'contact@', 'office@', 'bureau@']):
                    generic_emails.append(email)
                else:
                    other_emails.append(email)
            
            result['emails'] = generic_emails + other_emails
        
        # Retirer le premier email comme représentatif
        if result['emails']:
            result['email'] = result['emails'][0]
        else:
            result['email'] = "formulaire"
        
        return result
    
    def enrich_dataframe(self, df, max_items: Optional[int] = None) -> list:
        """
        Enrichit un DataFrame d'entreprises.
        
        Args:
            df: DataFrame pandas
            max_items: Nombre max d'items à traiter (None = tous)
            
        Returns:
            Liste d'erreurs pour logging
        """
        from tqdm import tqdm
        
        all_errors = []
        items_to_process = df.head(max_items) if max_items else df
        
        for idx, row in tqdm(items_to_process.iterrows(), 
                           total=len(items_to_process), 
                           desc="Enrichissement sites"):
            site_web = row.get('site_web')
            
            if not site_web or pd.isna(site_web):
                continue
            
            try:
                existing_email = row.get('email')
                enriched = self.enrich_site(site_web, existing_email)
                
                # Mettre à jour le DataFrame
                if 'email' in enriched:
                    df.at[idx, 'email'] = enriched['email']
                if enriched.get('phones'):
                    df.at[idx, 'telephone'] = enriched['phones'][0]
                if enriched.get('specialites'):
                    df.at[idx, 'specialites'] = enriched['specialites']
                if enriched.get('source_url'):
                    df.at[idx, 'source_url'] = enriched['source_url']
                if enriched.get('errors'):
                    all_errors.append({
                        'url': site_web,
                        'errors': enriched['errors']
                    })
                    
            except Exception as e:
                logger.error(f"Erreur enrichissement {site_web}: {e}")
                all_errors.append({
                    'url': site_web,
                    'errors': [str(e)]
                })
        
        return all_errors


def enrich_single_site(site_web: str, existing_email: Optional[str] = None) -> dict:
    """
    Fonction helper pour enrichir un seul site.
    
    Args:
        site_web: URL du site
        existing_email: Email existant
        
    Returns:
        Dict avec données enrichies
    """
    enricher = SiteEnricher()
    return enricher.enrich_site(site_web, existing_email)

