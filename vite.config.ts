// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ces variables sont injectées par ton workflow GitHub Actions
const repo = process.env.REPO_NAME ?? ''                 // ex: "TravelGCSponso" ou "username.github.io"
const isPages = process.env.GITHUB_PAGES === 'true'
const isUserOrgPage = repo.endsWith('.github.io')        // cas des User/Org Pages (racine du domaine)

// Base:
// - en local/dev: '/'
// - sur GitHub Pages:
//    - User/Org Pages: '/'
//    - Project Pages: '/<repo>/'
export default defineConfig({
    plugins: [react()],
    base: isPages ? (isUserOrgPage || !repo ? '/' : `/${repo}/`) : '/',
})
