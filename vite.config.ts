import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define base path for GitHub Pages (repo name)
  base: '/casa-inteligente-amiga/',
  // Output build to 'docs' so Pages can serve from main/(docs)
  build: {
    outDir: 'docs',
  },
})
