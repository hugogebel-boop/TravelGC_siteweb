// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Option simple : domaine custom => toujours base: '/'
export default defineConfig(({ command }) => ({
    plugins: [react()],
    base: '/', // IMPORTANT pour travelgc.ch et www.travelgc.ch
}))
