#!/bin/bash
# Script de démarrage rapide pour Linux/Mac

echo "==============================================="
echo "Pipeline Entreprises GC Romandie"
echo "==============================================="
echo ""

# Vérifier si venv existe
if [ -d "venv" ]; then
    echo "Activation de l'environnement virtuel..."
    source venv/bin/activate
else
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installation des dépendances..."
    pip install -r requirements.txt
fi

echo ""
echo "Lancement du pipeline..."
echo ""

# Lancer le pipeline avec les arguments par défaut
python -m src.pipeline --cantons "GE,VD,VS,FR,NE,JU"

echo ""
echo "==============================================="
echo "Exécution terminée"
echo "==============================================="

