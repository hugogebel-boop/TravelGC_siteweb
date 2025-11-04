"""
Module utilitaires pour le pipeline GC Romandie.
"""
from .regex_patterns import (
    extract_emails,
    extract_phones,
    clean_email,
    normalize_phone,
    is_webmail
)
from .normalizers import (
    normalize_company_name,
    normalize_url,
    normalize_text
)
from .deduplication import deduplicate_dataframe
from .classification import classify_tag_gc, get_tag_gc_label

__all__ = [
    'extract_emails',
    'extract_phones',
    'clean_email',
    'normalize_phone',
    'is_webmail',
    'normalize_company_name',
    'normalize_url',
    'normalize_text',
    'deduplicate_dataframe',
    'classify_tag_gc',
    'get_tag_gc_label'
]

