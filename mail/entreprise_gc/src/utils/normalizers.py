"""
Utilitaires de normalisation pour noms d'entreprises, URLs, etc.
"""
import re
from slugify import slugify
from typing import Optional


def normalize_company_name(name: str) -> str:
    """
    Normalise un nom d'entreprise pour la déduplication.
    
    Retire:
    - Formes sociales (SA, Sàrl, AG, Holding, etc.)
    - Accents
    - Doubles espaces
    - Espaces de début/fin
    
    Args:
        name: Nom brut
        
    Returns:
        Nom normalisé
    """
    if not name:
        return ""
    
    # Lowercase
    normalized = name.lower().strip()
    
    # Retirer formes sociales
    forms = [
        r'\b(s\.?a\.?|sàrl|sarl|ag|gmbh|llc|inc|corp|holding|group)\b',
        r'\b(société anonyme|société à responsabilité limitée)\b'
    ]
    for pattern in forms:
        normalized = re.sub(pattern, '', normalized)
    
    # Retirer accents (basique)
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ñ': 'n', 'ç': 'c'
    }
    for accented, unaccented in replacements.items():
        normalized = normalized.replace(accented, unaccented)
    
    # Retirer caractères spéciaux sauf espaces et tirets
    normalized = re.sub(r'[^a-z0-9\s\-]', '', normalized)
    
    # Retirer doubles espaces et tirets
    normalized = re.sub(r'\s+', ' ', normalized)
    normalized = re.sub(r'-+', '-', normalized)
    
    # Trim
    normalized = normalized.strip()
    
    return normalized


def normalize_url(url: str) -> Optional[str]:
    """
    Normalise une URL.
    
    - Force https://
    - Enlève trailing slash
    - Retire fragments
    
    Args:
        url: URL brute
        
    Returns:
        URL normalisée ou None
    """
    if not url or not isinstance(url, str):
        return None
    
    url = url.strip()
    
    # Ajouter https:// si manquant
    if not url.startswith(('http://', 'https://')):
        url = f'https://{url}'
    
    # Forcer https
    url = url.replace('http://', 'https://')
    
    # Retirer trailing slash
    url = url.rstrip('/')
    
    # Retirer fragments (#xxx)
    if '#' in url:
        url = url.split('#')[0]
    
    # Retirer paramètres de tracking communs
    url = re.sub(r'[?&](utm_source|utm_medium|utm_campaign|fbclid|gclid)=[^&]*', '', url)
    
    return url


def normalize_text(text: str) -> str:
    """
    Normalise un texte générique pour CSV (ASCII-only, retours de ligne).
    
    Args:
        text: Texte brut
        
    Returns:
        Texte normalisé
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Retirer retours de ligne
    text = text.replace('\n', ' ').replace('\r', ' ')
    
    # Retirer doubles espaces
    text = re.sub(r'\s+', ' ', text)
    
    # Trim
    text = text.strip()
    
    return text


def slugify_for_file(text: str) -> str:
    """
    Crée un slug à partir d'un texte pour nommer des fichiers.
    
    Args:
        text: Texte à slugifier
        
    Returns:
        Slug
    """
    if not text:
        return "unknown"
    
    return slugify(text, lowercase=True, separator='_')


def extract_main_words(name: str, max_words: int = 3) -> str:
    """
    Extrait les mots principaux d'un nom d'entreprise pour comparaison rapide.
    
    Args:
        name: Nom d'entreprise
        max_words: Nombre maximum de mots
        
    Returns:
        Mots principaux
    """
    normalized = normalize_company_name(name)
    words = normalized.split()
    
    # Filtrer mots courts/commun
    stop_words = {'et', 'and', 'ltd', 'the', 'le', 'la', 'les', 'de', 'du'}
    filtered = [w for w in words if len(w) > 2 and w not in stop_words]
    
    return ' '.join(filtered[:max_words])

