# Travel GC — Sponsor Deck

> Mini-site **Vite + React + TypeScript + Tailwind** pour présenter l’asso, les **packs sponsoring** (Bronze, Argent, Or, Platine) et un **formulaire de contact**.
> Design moderne, fluide, et compatible **GitHub Pages**.

![status](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite\&logoColor=white)
![status](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=061a23)
![status](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![status](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss\&logoColor=white)
![status](https://img.shields.io/badge/Deploy-GitHub%20Pages-222)

---

## ✨ Aperçu

* **Slide 1 · Introduction** : présentation courte, **qui sommes-nous / notre but**, visuel importé depuis `src/assets/`.
* **Slide 2 · Packs sponsoring** : tableau clair des **prestations** par pack **(ordre en diagonale)**, bloc **“Pourquoi nous sponsoriser ?”**, et **détail** des contreparties sous le tableau.
* **Slide 3 · Contact** : coordonnées + **formulaire** (soumission locale simulée).

**Tarifs packs** : CHF **1’000** · **2’500** · **5’000** · **7’500**.

---

## 🚀 Démarrage

```bash
# 1) Cloner
git clone https://github.com/<user>/<repo>.git
cd <repo>

# 2) Installer
npm ci

# 3) Lancer en dev
npm run dev
```

Build de prod :

```bash
npm run build
npm run preview
```

**Pré-requis** : Node 18+ (recommandé 20).

---

## 🧩 Structure

```
src/
  assets/              # images (ex: image.jpg, favicon.svg)
  sponsor/SponsorDeck.tsx
  main.tsx             # import du favicon + montage React
  index.css
vite.config.ts
```

* Les **images** se font via **import** depuis `src/assets/` : Vite réécrit les URLs pour GitHub Pages.
* Le **favicon** est importé dans `main.tsx` (voir plus bas).

---

## 🎛️ Personnalisation rapide

### Packs & prestations

Dans `src/sponsor/SponsorDeck.tsx` :

* Modifie les prestations dans `baseFeatures`.
* Ajuste l’inclusion par pack dans `packs` (true/false).
* Les descriptions (bloc “Détail des contreparties”) sont dans `featureDescriptions`.

### Visuel de la slide 1

Place ton image sous `src/assets/image.jpg` puis dans `SponsorDeck.tsx` :

```tsx
import hero from '../assets/image.jpg'
<img src={hero} alt="Travel GC" className="w-full h-full object-cover" />
```

### Favicon (onglet)

`src/main.tsx` :

```ts
import faviconUrl from './assets/favicon.svg'

function applyFavicon() {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link) }
  link.type = 'image/svg+xml'
  link.href = faviconUrl
}
applyFavicon()
```

> Ajoute `src/vite-env.d.ts` si besoin :
>
> ```ts
> /// <reference types="vite/client" />
> ```

---

## 🌐 Déploiement GitHub Pages (recommandé)

### `vite.config.ts`

Base **automatique** pour Project Pages (`/<repo>/`) et User/Org Pages (`/`) :

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repo = process.env.REPO_NAME ?? ''
const isPages = process.env.GITHUB_PAGES === 'true'
const isUserOrgPage = repo.endsWith('.github.io')

export default defineConfig({
  plugins: [react()],
  base: isPages ? (isUserOrgPage || !repo ? '/' : `/${repo}/`) : '/',
})
```

### Workflow `/.github/workflows/pages.yml`

```yaml
name: Deploy Vite to GitHub Pages
on:
  push: { branches: [ main ] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install deps (clean)
        run: npm ci
      - name: Build with repo base
        env:
          GITHUB_PAGES: "true"
          REPO_NAME: "${{ github.event.repository.name }}"
        run: npm run build
      - name: Upload artifact (dist)
        uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
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

**Settings → Pages** : Source = **GitHub Actions**.

> Laisse **un seul** workflow de déploiement (évite de mélanger avec un “static path: '.' ”).

---

## 🩺 Dépannage (FAQ)

* **Page blanche / 404 sur `index-*.js`**
  → `base` mal configurée. Le `view-source:` de la page doit montrer
  `<script ... src="/<NomRepo>/assets/index-xxxx.js">`.
  Vérifie `vite.config.ts` + la step “Build with repo base”.

* **L’image ne s’affiche pas sur Pages**
  → Importe depuis `src/assets/` (pas de chemin absolu `/assets/...`).
  Exemple : `import hero from '../assets/image.jpg'`.

* **Favicon absent**
  → Vérifie l’import dans `main.tsx` et la présence de `src/assets/favicon.svg`.

---

## 📄 Licence

À définir par l’association (par ex. MIT).

---

## 🙌 Remerciements

Projet conçu pour faciliter la prise de contact avec des **sponsors** et clarifier les **contreparties**.
Merci aux partenaires qui rendent l’aventure **Travel GC** possible.
