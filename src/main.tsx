import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SponsorDeck from './sponsor/SponsorDeck'
import faviconUrl from './assets/favicon.svg' // ⬅️ import du favicon (src/assets)

// Ajoute/MAJ la balise <link rel="icon"> avec l'URL packagée par Vite
function applyFavicon() {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
    }
    link.type = 'image/svg+xml'
    link.href = faviconUrl
}
applyFavicon()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SponsorDeck />
    </React.StrictMode>
)
