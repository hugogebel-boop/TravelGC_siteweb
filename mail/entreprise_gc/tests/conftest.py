"""
Configuration pytest pour tests GC Romandie.
"""
import pytest
import pandas as pd


@pytest.fixture
def sample_companies_df():
    """Fixture: DataFrame d'exemple d'entreprises."""
    return pd.DataFrame([
        {
            'company_name': 'Bureau Génie Civil SA',
            'canton': 'VD',
            'ville': 'Lausanne',
            'site_web': 'https://example-gc.com',
            'email': 'info@example-gc.com',
            'telephone': '+41 21 123 45 67',
            'specialites': 'Ponts, structures, béton',
            'source_url': 'https://source.com',
            'notes': '',
            'tag_gc': 1
        },
        {
            'company_name': 'Architecture & GC Sàrl',
            'canton': 'GE',
            'ville': 'Genève',
            'site_web': 'https://example-arch.com',
            'email': 'contact@example-arch.com',
            'telephone': None,
            'specialites': 'Architecture et génie civil',
            'source_url': 'https://source.com',
            'notes': '',
            'tag_gc': 2
        },
        {
            'company_name': 'GC Durable AG',
            'canton': 'VD',
            'ville': 'Renens',
            'site_web': 'https://example-durable.com',
            'email': 'info@example-durable.com',
            'telephone': '+41 21 234 56 78',
            'specialites': 'Génie civil Minergie développement durable',
            'source_url': 'https://source.com',
            'notes': '',
            'tag_gc': 3
        }
    ])


@pytest.fixture
def empty_df():
    """Fixture: DataFrame vide avec colonnes."""
    return pd.DataFrame(columns=[
        'company_name', 'canton', 'ville', 'site_web', 
        'email', 'telephone', 'specialites', 'source_url', 'notes'
    ])

