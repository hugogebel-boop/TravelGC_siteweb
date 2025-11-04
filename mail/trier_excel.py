#!/usr/bin/env python3
"""
Script pour trier le fichier Excel sponsoring.xlsx
Déplace toutes les lignes avec des cellules vides dans la colonne B en bas du fichier.
"""

import pandas as pd
from pathlib import Path

def trier_lignes_excel():
    """
    Lit le fichier Excel, sépare les lignes avec/sans cellule vide dans la colonne B,
    et réécrit le fichier avec les lignes vides en bas.
    """
    # Chemin du fichier Excel
    fichier_excel = Path(__file__).parent / "sponsoring.xlsx"
    
    if not fichier_excel.exists():
        print(f"❌ Erreur : Le fichier {fichier_excel} n'existe pas.")
        return
    
    print(f"📖 Lecture du fichier {fichier_excel}...")
    
    # Lire le fichier Excel (toutes les feuilles ou la première)
    try:
        # Lire toutes les feuilles ou juste la première
        df_dict = pd.read_excel(fichier_excel, sheet_name=None, engine='openpyxl')
        
        # Si une seule feuille, on la traite directement
        if len(df_dict) == 1:
            df = list(df_dict.values())[0]
            nom_feuille = list(df_dict.keys())[0]
            
            print(f"✓ Feuille trouvée : '{nom_feuille}'")
            print(f"✓ Nombre de lignes initial : {len(df)}")
            
            # Séparer les lignes avec et sans cellule vide dans la colonne B
            # La colonne B est l'index 1 (colonne 0 = A, colonne 1 = B)
            colonne_b = df.iloc[:, 1]  # Colonne B (index 1)
            
            # Identifier les lignes avec cellule vide dans la colonne B
            lignes_vides = colonne_b.isna() | (colonne_b == '') | (colonne_b.astype(str).str.strip() == '')
            
            # Séparer les données
            df_avec_contenu = df[~lignes_vides].copy()
            df_vides = df[lignes_vides].copy()
            
            nb_lignes_vides = len(df_vides)
            nb_lignes_avec_contenu = len(df_avec_contenu)
            
            print(f"✓ Lignes avec contenu dans la colonne B : {nb_lignes_avec_contenu}")
            print(f"✓ Lignes vides dans la colonne B : {nb_lignes_vides}")
            
            # Réorganiser : lignes avec contenu en haut, lignes vides en bas
            df_trie = pd.concat([df_avec_contenu, df_vides], ignore_index=True)
            
            # Sauvegarder dans le fichier
            print(f"💾 Sauvegarde du fichier trié...")
            with pd.ExcelWriter(fichier_excel, engine='openpyxl') as writer:
                df_trie.to_excel(writer, sheet_name=nom_feuille, index=False)
            
            print(f"✅ Fichier trié avec succès !")
            print(f"   → {nb_lignes_avec_contenu} lignes avec contenu en haut")
            print(f"   → {nb_lignes_vides} lignes vides en bas")
            
        else:
            # Plusieurs feuilles : traiter chaque feuille
            print(f"✓ {len(df_dict)} feuilles trouvées")
            
            with pd.ExcelWriter(fichier_excel, engine='openpyxl') as writer:
                for nom_feuille, df in df_dict.items():
                    print(f"\n📄 Traitement de la feuille '{nom_feuille}'...")
                    
                    colonne_b = df.iloc[:, 1]
                    lignes_vides = colonne_b.isna() | (colonne_b == '') | (colonne_b.astype(str).str.strip() == '')
                    
                    df_avec_contenu = df[~lignes_vides].copy()
                    df_vides = df[lignes_vides].copy()
                    
                    df_trie = pd.concat([df_avec_contenu, df_vides], ignore_index=True)
                    df_trie.to_excel(writer, sheet_name=nom_feuille, index=False)
                    
                    print(f"   ✓ {len(df_avec_contenu)} lignes avec contenu, {len(df_vides)} lignes vides")
            
            print(f"\n✅ Toutes les feuilles ont été triées avec succès !")
            
    except Exception as e:
        print(f"❌ Erreur lors du traitement : {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    trier_lignes_excel()

