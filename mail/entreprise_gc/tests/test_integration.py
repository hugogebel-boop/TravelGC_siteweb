"""
Tests d'intégration du pipeline.
"""
import pytest
import pandas as pd
from src.utils import (
    deduplicate_dataframe,
    classify_tag_gc
)
from src.utils.normalizers import normalize_company_name


def test_pipeline_full_flow(sample_companies_df):
    """Test flow complet: normalisation, classification, dédup."""
    df = sample_companies_df.copy()
    
    # Normaliser noms
    df['company_name_normalized'] = df['company_name'].apply(normalize_company_name)
    
    # Classifier
    df['tag_gc_computed'] = df.apply(
        lambda row: classify_tag_gc(row.get('specialites', ''), row.get('company_name', '')),
        axis=1
    )
    
    # Vérifier tags
    assert all(df['tag_gc'] == df['tag_gc_computed'])
    
    # Dédupliquer (ne devrait pas réduire ici)
    df_dedup = deduplicate_dataframe(df)
    assert len(df_dedup) == len(df)


def test_crawl_mock(monkeypatch):
    """Test crawler avec mock."""
    from src.crawler import enrich_single_site
    
    def mock_enrich(site_web, existing_email=None):
        return {
            'email': 'info@example.com',
            'phones': ['+41 21 123 45 67'],
            'specialites': 'Génie civil',
            'source_url': site_web
        }
    
    monkeypatch.setattr('src.crawler.site_enricher.enrich_single_site', mock_enrich)
    
    result = enrich_single_site('https://example.com')
    assert result['email'] == 'info@example.com'


def test_classification_consistency():
    """Test cohérence classifications."""
    cases = [
        ("", 0),
        ("Génie civil", 1),
        ("Génie civil et architecture", 2),
        ("GC et Minergie", 3),
        ("GC et EPFL", 4),
    ]
    
    for text, expected_tag in cases:
        computed = classify_tag_gc(text)
        assert computed == expected_tag, f"Text: {text}, Expected: {expected_tag}, Got: {computed}"

