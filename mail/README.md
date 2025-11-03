# Templates Email - Travel GC Sponsoring

Ce dossier contient les templates HTML pour l'envoi automatique d'emails aux sponsors.

## Structure

- `template_code_0.html` : Template sans bloc personnalisé
- `template_code_1.html` : Template avec bloc "Génie civil classique"
- `template_code_2.html` : Template avec bloc "Génie civil généraliste / multi-domaines"
- `template_code_3.html` : Template avec bloc "Génie civil & durabilité"
- `template_code_4.html` : Template avec bloc "Génie civil & éducation / transmission"

## Variables

Chaque template contient deux variables à remplacer :

1. **`{{NomEntreprise}}`** : Le nom de l'entreprise sponsor
2. **`{{BlocPersonnalisé}}`** : Déjà intégré dans les templates code 1-4 (pas besoin de remplacer pour code 0)

## Design

Les templates utilisent un design **Fluent Design** moderne inspiré du site Travel GC :

- **Couleurs** : Palette emerald/teal (vert émeraude/sarcelle)
- **Style** : Glassmorphism avec backdrop-blur
- **Typographie** : Système de polices modernes
- **Layout** : Responsive et compatible avec les principaux clients email

## Utilisation

### Exemple d'intégration en JavaScript

```javascript
const fs = require('fs');
const path = require('path');

function loadTemplate(code) {
    const templatePath = path.join(__dirname, `template_code_${code}.html`);
    return fs.readFileSync(templatePath, 'utf-8');
}

function generateEmail(nomEntreprise, codeCategorie) {
    let template = loadTemplate(codeCategorie);
    
    // Remplacer les variables
    template = template.replace(/\{\{NomEntreprise\}\}/g, nomEntreprise);
    
    return template;
}

// Exemple d'utilisation
const email = generateEmail('Entreprise XYZ', 1);
```

### Exemple d'intégration en Python

```python
from pathlib import Path

def load_template(code):
    template_path = Path(__file__).parent / f'template_code_{code}.html'
    return template_path.read_text(encoding='utf-8')

def generate_email(nom_entreprise, code_categorie):
    template = load_template(code_categorie)
    return template.replace('{{NomEntreprise}}', nom_entreprise)

# Exemple d'utilisation
email = generate_email('Entreprise XYZ', 1)
```

## Codes de catégorie

- **0** : Aucune personnalisation (pas de bloc personnalisé)
- **1** : Génie civil "classique"
- **2** : Génie civil généraliste / multi-domaines
- **3** : Génie civil & durabilité
- **4** : Génie civil & éducation / transmission

## Notes techniques

- Compatible avec les principaux clients email (Gmail, Outlook, Apple Mail, etc.)
- Utilise des tables HTML pour une meilleure compatibilité
- CSS inline pour éviter les problèmes de rendu
- Support MSO (Microsoft Outlook) via commentaires conditionnels
- Responsive grâce à des largeurs max-width et padding adaptatifs

