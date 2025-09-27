import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change REPO_NAME below to your GitHub repo name if deploying to GitHub Pages
const REPO_NAME = process.env.REPO_NAME || ''

// If you deploy to GitHub Pages, set GITHUB_PAGES=true in your workflow
// and (optionally) REPO_NAME to override the repo folder if needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' && REPO_NAME ? `/${REPO_NAME}/` : '/',
})
