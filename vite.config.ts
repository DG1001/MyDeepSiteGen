// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Der Name Ihres GitHub-Repositories (MyDeepSiteGen)
const repositoryName = 'MyDeepSiteGen'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Die Base-URL für GitHub Pages
  base: process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '/',
})