"""
Module de classification des entreprises selon tag_gc.
"""
import re
from typing import List


# Mots-clés génie civil (core GC)
GC_CORE_KEYWORDS = {
    # Français
    "génie civil", "ingenieur civil", "ingénieur civil", "ing civil",
    "structures", "structure", "génie structure",
    "béton", "beton", "béton armé", "béton précontraint",
    "acier", "acier inoxydable", "charpente métallique",
    "pont", "ponts", "ouvrages d'art", "viaduc",
    "route", "routes", "chaussée", "chaussee", "infrastructure routière",
    "géotechnique", "geotechnique", "fondations", "fondation",
    "talus", "stabilisation", "terrassement",
    "tunnel", "tunnels", "tunnellisation",
    "hydraulique", "hydraulique fluviale", "aménagement hydraulique",
    "assainissement", "eau", "eaux", "traitement des eaux",
    "drainage", "irrigation", "barrage",
    # Allemand
    "tragwerk", "bauingenieur", "tiefbau", "infrastruktur",
    "brücke", "brücken", "stahlbau", "betonbau",
    "geotechnik", "grundbau", "erdbau",
    "wasserbau", "wasserwirtschaft", "kanalisation"
}

# Mots-clés généralistes (non-GC)
GENERAL_KEYWORDS = {
    "architecture", "architecte", "architect", "architectural design",
    "aménagement intérieur", "design d'intérieur",
    "graphisme", "graphic design", "communication visuelle",
    "it", "information technology", "développement web", "web development",
    "agence web", "digital", "marketing digital",
    "courtier", "broker", "immobilier", "real estate",
    "conseil", "consulting", "advisory",
    "juridique", "legal", "droit",
    "comptabilité", "accounting", "fiscalité"
}

# Mots-clés durabilité
DUrable_KEYWORDS = {
    "minergie", "minergie-p", "minergie-eco",
    "sméo", "smeo", "smeo-cert",
    "esg", "environmental social governance",
    "bilan carbone", "carbon neutral", "neutralité carbone",
    "efficacité énergétique", "energy efficiency",
    "développement durable", "sustainable development", "sustainability",
    "environnement", "environment", "environnemental",
    "leed", "leadership in energy and environmental design",
    "breeam", "building research establishment environmental assessment",
    "passive house", "maison passive",
    "énergie renouvelable", "renewable energy", "solaire", "photovoltaïque",
    "circular economy", "économie circulaire",
    "life cycle assessment", "analyse du cycle de vie", "lca"
}

# Mots-clés éducation
EDUCATION_KEYWORDS = {
    "epfl", "ecole polytechnique", "polytechnique fédérale",
    "hepia", "haute école du paysage d'ingénierie et d'architecture",
    "heig-vd", "haute école d'ingénierie",
    "hes", "haute école spécialisée", "hautes écoles spécialisées",
    "université", "university", "universitäre", "universitäre",
    "chaire", "chair", "endowed chair",
    "laboratoire", "laboratory", "lab",
    "stage", "internship", "practicum", "praktikum",
    "apprentissage", "apprenticeship", "lehre",
    "partenaire académique", "academic partner",
    "partenariat école", "partenariat universitaire",
    "collaboration universitaire",
    "teaching", "enseignement", "formation"
}


def classify_tag_gc(specialites_text: str, company_name: str = "") -> int:
    """
    Classifie une entreprise selon le tag_gc (0-4).
    
    Règles:
    0 = non-GC (général/architecte/autre)
    1 = GC pur
    2 = GC + général
    3 = GC + durable
    4 = GC + éducation
    
    Priorités: 4 > 3 > 2 > 1 > 0
    
    Args:
        specialites_text: Texte des spécialités/services
        company_name: Nom de l'entreprise (optionnel, pour contexte)
        
    Returns:
        Tag GC (0-4)
    """
    if not specialites_text:
        specialites_text = ""
    if not company_name:
        company_name = ""
    
    # Combiner textes
    combined = f"{specialites_text} {company_name}".lower()
    
    # Chercher mots-clés
    gc_core_found = any(keyword in combined for keyword in GC_CORE_KEYWORDS)
    general_found = any(keyword in combined for keyword in GENERAL_KEYWORDS)
    durable_found = any(keyword in combined for keyword in DUrable_KEYWORDS)
    education_found = any(keyword in combined for keyword in EDUCATION_KEYWORDS)
    
    # Règles de classification
    if not gc_core_found:
        # Pas de GC -> 0 ou 2 selon si général trouvé
        return 0 if general_found else 0
    
    # GC trouvé
    if general_found:
        # GC + général -> 2
        return 2
    
    # GC seul -> 1, mais vérifier durable/éducation
    if education_found:
        # GC + éducation -> 4 (priorité max)
        return 4
    
    if durable_found:
        # GC + durable -> 3
        return 3
    
    # GC pur
    return 1


def get_tag_gc_label(tag: int) -> str:
    """
    Retourne un label lisible pour un tag_gc.
    
    Args:
        tag: Tag GC (0-4)
        
    Returns:
        Label
    """
    labels = {
        0: "Non-GC",
        1: "GC pur",
        2: "GC + général",
        3: "GC + durable",
        4: "GC + éducation"
    }
    return labels.get(tag, "Inconnu")


def explain_classification(specialites_text: str, company_name: str = "") -> dict:
    """
    Explique la classification (pour debug).
    
    Args:
        specialites_text: Texte des spécialités
        company_name: Nom de l'entreprise
        
    Returns:
        Dict avec tag, label, et mots-clés trouvés
    """
    if not specialites_text:
        specialites_text = ""
    if not company_name:
        company_name = ""
    
    combined = f"{specialites_text} {company_name}".lower()
    
    gc_core_matches = [kw for kw in GC_CORE_KEYWORDS if kw in combined]
    general_matches = [kw for kw in GENERAL_KEYWORDS if kw in combined]
    durable_matches = [kw for kw in DUrable_KEYWORDS if kw in combined]
    education_matches = [kw for kw in EDUCATION_KEYWORDS if kw in combined]
    
    tag = classify_tag_gc(specialites_text, company_name)
    
    return {
        'tag': tag,
        'label': get_tag_gc_label(tag),
        'gc_core_found': len(gc_core_matches) > 0,
        'gc_core_matches': gc_core_matches[:5],  # Limiter à 5
        'general_matches': general_matches[:5],
        'durable_matches': durable_matches[:5],
        'education_matches': education_matches[:5]
    }


def get_specialties_keywords(tag: int) -> List[str]:
    """
    Retourne les mots-clés attendus pour un tag donné.
    
    Args:
        tag: Tag GC
        
    Returns:
        Liste de mots-clés
    """
    if tag == 0:
        return list(GENERAL_KEYWORDS)[:10]
    elif tag == 1:
        return list(GC_CORE_KEYWORDS)[:10]
    elif tag == 2:
        return list(GC_CORE_KEYWORDS | GENERAL_KEYWORDS)[:10]
    elif tag == 3:
        return list(GC_CORE_KEYWORDS | DUrable_KEYWORDS)[:10]
    elif tag == 4:
        return list(GC_CORE_KEYWORDS | EDUCATION_KEYWORDS)[:10]
    else:
        return []

