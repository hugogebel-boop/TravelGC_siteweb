# Travel GC — Sponsor Deck (Vite + React + TS + Tailwind)

Preview de site pour présenter l’asso et les packs sponsoring (3 slides + formulaire).

## Démarrage local
```bash
npm ci
npm run dev
```
Ouvre l’URL affichée (souvent http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```

## Déploiement GitHub Pages
1. Crée un repo GitHub (ex: `TravelGC.Presentation`).
2. Ajoute un workflow `.github/workflows/pages.yml` comme ci-dessous.
3. Pousse sur `main`. GitHub Pages publiera automatiquement.

### pages.yml
```yaml
name: Deploy Vite to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install deps (clean)
        run: npm ci
      - name: Build with repo base
        env:
          GITHUB_PAGES: "true"
          REPO_NAME: "${{ github.event.repository.name }}"
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
> **Note** : `vite.config.ts` détecte `GITHUB_PAGES=true` et utilise `REPO_NAME` pour définir `base` automatiquement.

## Personnalisation
- Packs & prestations : `src/sponsor/SponsorDeck.tsx` (`features` et `packs`).
- Couleurs : Tailwind (classes `emerald`).

## Crédits
- React, Vite, TypeScript, Tailwind, framer-motion, lucide-react.
