import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // GitHub Pages nao envia headers CORS -> crossorigin quebra modulos ES
    {
      name: 'remove-crossorigin',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html) {
        return html.replace(/\s*crossorigin(?:=["\']?\w*["\']?)?/gi, '');
      },
    },
  ],
  base: mode === 'production' ? '/ClickMaster/' : '/',
}))