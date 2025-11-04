@echo off
REM Script de démarrage rapide pour Windows

echo ===============================================
echo Pipeline Entreprises GC Romandie
echo ===============================================
echo.

REM Vérifier si venv existe
if exist venv\Scripts\activate.bat (
    echo Activation de l'environnement virtuel...
    call venv\Scripts\activate.bat
) else (
    echo Creation de l'environnement virtuel...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo Installation des dependances...
    pip install -r requirements.txt
)

echo.
echo Lancement du pipeline...
echo.

REM Lancer le pipeline avec les arguments par défaut
python -m src.pipeline --cantons "GE,VD,VS,FR,NE,JU"

echo.
echo ===============================================
echo Execution terminee
echo ===============================================
pause

