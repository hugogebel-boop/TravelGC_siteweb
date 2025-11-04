"""
Tests pour classification.
"""
import pytest
from src.utils.classification import (
    classify_tag_gc,
    get_tag_gc_label,
    explain_classification
)


def test_classify_tag_gc_non_gc():
    """Test classification non-GC."""
    assert classify_tag_gc("Architecture et design") == 0


def test_classify_tag_gc_pur():
    """Test classification GC pur."""
    assert classify_tag_gc("Génie civil et structures") == 1


def test_classify_tag_gc_general():
    """Test classification GC + général."""
    assert classify_tag_gc("Génie civil et architecture") == 2


def test_classify_tag_gc_durable():
    """Test classification GC + durable."""
    assert classify_tag_gc("Génie civil et développement durable") == 3


def test_classify_tag_gc_education():
    """Test classification GC + éducation."""
    assert classify_tag_gc("Génie civil et partenariat avec EPFL") == 4


def test_classify_tag_gc_priority():
    """Test priorités (éducation > durable)."""
    assert classify_tag_gc("Génie civil, Minergie et stages EPFL") == 4


def test_get_tag_gc_label():
    """Test labels."""
    assert get_tag_gc_label(0) == "Non-GC"
    assert get_tag_gc_label(1) == "GC pur"
    assert get_tag_gc_label(2) == "GC + général"
    assert get_tag_gc_label(3) == "GC + durable"
    assert get_tag_gc_label(4) == "GC + éducation"


def test_explain_classification():
    """Test explication classification."""
    explanation = explain_classification("Ponts et structures", "Bureau d'ingénieurs")
    assert explanation['tag'] in [1, 2]
    assert 'gc_core_found' in explanation
    assert 'gc_core_matches' in explanation


def test_classify_empty():
    """Test classification texte vide."""
    assert classify_tag_gc("") == 0
    assert classify_tag_gc("", "") == 0

