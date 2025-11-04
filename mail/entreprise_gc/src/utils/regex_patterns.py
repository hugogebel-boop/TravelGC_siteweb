"""
Patterns regex pour extraction d'emails, téléphones et autres données structurées.
"""
import re


# Email regex - inclut obfuscations simples
EMAIL_PATTERN = re.compile(
    r'([A-Z0-9._%+\-]+(\s*\[at\]\s*|\s*\(at\)\s*|@)[A-Z0-9.\-]+\.[A-Z]{2,})',
    re.IGNORECASE
)

# Téléphone suisse - formats variés
PHONE_CH_PATTERN = re.compile(
    r'(?:\+41|0041|0?41)\s*(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{2})',
    re.IGNORECASE
)

# URL simple
URL_PATTERN = re.compile(
    r'https?://[^\s<>"{}|\\^`\[\]]+',
    re.IGNORECASE
)

# Domaine email
DOMAIN_PATTERN = re.compile(
    r'@([A-Z0-9.\-]+\.[A-Z]{2,})',
    re.IGNORECASE
)


def clean_email(email: str) -> str:
    """
    Nettoie et normalise un email, retire les obfuscations.
    
    Args:
        email: Email potentiellement obfusqué
        
    Returns:
        Email nettoyé ou chaîne vide
    """
    if not email:
        return ""
    
    # Retirer espaces
    email = email.strip()
    
    # Remplacer obfuscations
    email = email.replace('[at]', '@')
    email = email.replace('(at)', '@')
    email = email.replace(' AT ', '@')
    email = email.replace(' at ', '@')
    email = email.replace(' [at] ', '@')
    email = email.replace(' (at) ', '@')
    
    # Retirer espaces autour du @
    email = re.sub(r'\s*@\s*', '@', email)
    
    # Lowercase domaine uniquement
    if '@' in email:
        local, domain = email.rsplit('@', 1)
        email = f"{local}@{domain.lower()}"
    
    return email


def extract_emails(text: str) -> list[str]:
    """
    Extrait tous les emails d'un texte, y compris avec obfuscations.
    
    Args:
        text: Texte à analyser
        
    Returns:
        Liste d'emails nettoyés
    """
    if not text:
        return []
    
    matches = EMAIL_PATTERN.findall(text)
    emails = []
    
    for match in matches:
        email = match[0]  # Premier groupe
        cleaned = clean_email(email)
        
        if cleaned and cleaned not in emails:
            emails.append(cleaned)
    
    return emails


def normalize_phone(phone: str) -> str:
    """
    Normalise un numéro de téléphone suisse.
    
    Args:
        phone: Numéro brut
        
    Returns:
        Numéro au format +41 XX XXX XX XX
    """
    if not phone:
        return ""
    
    # Nettoyer
    phone = re.sub(r'[^\d+]', '', phone)
    
    # Remplacer 0041 par +41
    phone = phone.replace('0041', '+41')
    
    # Ajouter +41 si commence par 041 ou 41
    if phone.startswith('041'):
        phone = '+41' + phone[3:]
    elif phone.startswith('41') and not phone.startswith('+41'):
        phone = '+41' + phone[2:]
    
    match = PHONE_CH_PATTERN.search(phone)
    if match:
        return f"+41 {match.group(1)} {match.group(2)} {match.group(3)} {match.group(4)}"
    
    return phone


def extract_phones(text: str) -> list[str]:
    """
    Extrait tous les téléphones suisses d'un texte.
    
    Args:
        text: Texte à analyser
        
    Returns:
        Liste de téléphones normalisés
    """
    if not text:
        return []
    
    matches = PHONE_CH_PATTERN.findall(text)
    phones = []
    
    for phone in matches:
        normalized = normalize_phone(phone if isinstance(phone, str) else '')
        if normalized and normalized not in phones:
            phones.append(normalized)
    
    return phones


def extract_domain(email: str) -> str:
    """
    Extrait le domaine d'un email.
    
    Args:
        email: Email complet
        
    Returns:
        Domaine ou chaîne vide
    """
    if not email or '@' not in email:
        return ""
    
    match = DOMAIN_PATTERN.search(email)
    if match:
        return match.group(1).lower()
    
    return ""


def is_webmail(email: str) -> bool:
    """
    Détermine si un email est un webmail générique.
    
    Args:
        email: Email à vérifier
        
    Returns:
        True si webmail, False sinon
    """
    webmail_domains = {
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'bluewin.ch', 'hispeed.ch', 'swissonline.ch', 'sunrise.ch',
        'protonmail.com', 'proton.me', 'mail.com', 'aol.com'
    }
    
    domain = extract_domain(email)
    return domain in webmail_domains

