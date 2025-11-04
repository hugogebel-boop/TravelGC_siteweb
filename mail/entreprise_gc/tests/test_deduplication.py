"""
Tests pour déduplication.
"""
import pytest
import pandas as pd
from src.utils.deduplication import deduplicate_dataframe


def test_deduplicate_simple():
    """Test déduplication simple."""
    df = pd.DataFrame([
        {'company_name': 'Test SA', 'site_web': 'https://test.com', 'ville': 'Genève'},
        {'company_name': 'Test Sàrl', 'site_web': 'https://test.com', 'ville': 'Genève'}
    ])
    
    result = deduplicate_dataframe(df)
    assert len(result) == 1


def test_deduplicate_different():
    """Test pas de dédup si différents."""
    df = pd.DataFrame([
        {'company_name': 'ABC SA', 'site_web': 'https://abc.com', 'ville': 'Lausanne'},
        {'company_name': 'XYZ AG', 'site_web': 'https://xyz.com', 'ville': 'Genève'}
    ])
    
    result = deduplicate_dataframe(df)
    assert len(result) == 2


def test_deduplicate_empty():
    """Test déduplication DataFrame vide."""
    df = pd.DataFrame()
    result = deduplicate_dataframe(df)
    assert len(result) == 0


def test_deduplicate_keep_richest():
    """Test conservation fiche la plus riche."""
    df = pd.DataFrame([
        {
            'company_name': 'Test',
            'email': 'info@test.com',
            'telephone': '+41 21 123 45 67',
            'site_web': 'https://test.com',
            'ville': 'Lausanne'
        },
        {
            'company_name': 'Test SA',
            'email': None,
            'telephone': None,
            'site_web': 'https://test.com',
            'ville': 'Lausanne'
        }
    ])
    
    result = deduplicate_dataframe(df)
    assert len(result) == 1
    assert pd.notna(result.iloc[0]['email'])

