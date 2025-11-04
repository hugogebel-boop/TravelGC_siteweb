.PHONY: help run test export clean install

help:
	@echo "Commandes disponibles:"
	@echo "  make install  - Installer les dépendances"
	@echo "  make run      - Exécuter le pipeline complet (tous cantons)"
	@echo "  make export   - Exécuter sur VD avec limite de 50 entrées"
	@echo "  make test     - Exécuter les tests pytest"
	@echo "  make clean    - Nettoyer les fichiers temporaires"

install:
	pip install -r requirements.txt

run:
	python -m src.pipeline --cantons "GE,VD,VS,FR,NE,JU"

export:
	python -m src.pipeline --cantons "VD" --max-per-canton 50

test:
	pytest -v tests/

clean:
	@echo "Nettoyage des fichiers temporaires..."
	@if [ -d "__pycache__" ]; then find . -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true; fi
	@if [ -d "__pycache__" ]; then find . -type f -name "*.pyc" -delete 2>/dev/null || true; fi
	@if [ -d "__pycache__" ]; then find . -type f -name "*.pyo" -delete 2>/dev/null || true; fi
	@if [ -d "data/intermediate" ]; then rm -f data/intermediate/*.csv 2>/dev/null || true; fi
	@if [ -d "data/raw" ]; then rm -f data/raw/*.csv 2>/dev/null || true; fi
	@echo "Nettoyage terminé"

