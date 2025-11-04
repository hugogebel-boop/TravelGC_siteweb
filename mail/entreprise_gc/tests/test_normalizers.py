"""
Tests pour normalizers.
"""
import pytest
from src.utils.normalizers import (
    normalize_company_name,
    normalize_url,
    normalize_text
)


def test_normalize_company_name():
    """Test normalisation nom entreprise."""
    assert normalize_company_name("Entreprise SA") in ["entreprise", "entreprise sa"]
    assert normalize_company_name("ABC Sàrl") in ["abc sarl", "abc"]
    assert normalize_company_name("Test  Holding  AG") in ["test holding ag", "test holding"]


def test_normalize_company_name_accents():
    """Test retrait accents."""
    assert "é" not in normalize_company_name("Café & Co")
    assert "à" not in normalize_company_name("Société à responsabilité limitée")


def test_normalize_url():
    """Test normalisation URL."""
    assert normalize_url("http://example.com/") == "https://example.com"
    assert normalize_url("example.com") == "https://example.com"
    assert normalize_url("https://test.ch") == "https://test.ch"


def test_normalize_url_remove_fragment():
    """Test retrait fragment."""
    url = normalize_url("https://example.com/page#anchor")
    assert url == "https://example.com/page"


def test_normalize_url_invalid():
    """Test URL invalide."""
    assert normalize_url("") is None
    assert normalize_url(None) is None


def test_normalize_text():
    """Test normalisation texte."""
    assert normalize_text("Test\navec\nlignes") == "Test avec lignes"
    assert normalize_text("  Espaces  multiples  ") == "Espaces multiples"


def test_normalize_text_empty():
    """Test normalisation texte vide."""
    assert normalize_text("") == ""
    assert normalize_text(None) == ""

