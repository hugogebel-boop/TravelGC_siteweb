"""
Tests pour regex_patterns.
"""
import pytest
from src.utils.regex_patterns import (
    extract_emails,
    extract_phones,
    clean_email,
    normalize_phone,
    is_webmail
)


def test_extract_emails_simple():
    """Test extraction emails simples."""
    text = "Contactez nous à info@example.com ou support@test.ch"
    emails = extract_emails(text)
    assert len(emails) == 2
    assert "info@example.com" in emails
    assert "support@test.ch" in emails


def test_extract_emails_obfuscated():
    """Test extraction emails obfusqués."""
    text = "Email: contact [at] example.com ou test(at)domain.ch"
    emails = extract_emails(text)
    assert len(emails) >= 1
    assert any("contact@example.com" in e or "test@domain.ch" in e for e in emails)


def test_clean_email():
    """Test nettoyage email."""
    assert clean_email("Info@Example.Com") == "Info@example.com"
    assert clean_email("test [at] domain.com") == "test@domain.com"
    assert clean_email("contact(at)example.ch") == "contact@example.ch"


def test_extract_phones_ch():
    """Test extraction téléphones suisses."""
    text = "Appelez nous au +41 21 123 45 67 ou 021 123 45 67"
    phones = extract_phones(text)
    assert len(phones) >= 1


def test_normalize_phone():
    """Test normalisation téléphone."""
    phone = normalize_phone("+41 21 123 45 67")
    assert phone.startswith("+41")
    assert "21" in phone


def test_is_webmail():
    """Test détection webmail."""
    assert is_webmail("test@gmail.com") is True
    assert is_webmail("info@bluewin.ch") is True
    assert is_webmail("contact@example.com") is False
    assert is_webmail("user@entreprise.ch") is False


def test_extract_phones_empty():
    """Test extraction téléphones vide."""
    phones = extract_phones("")
    assert phones == []


def test_extract_emails_empty():
    """Test extraction emails vide."""
    emails = extract_emails("")
    assert emails == []

