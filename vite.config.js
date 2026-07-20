import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Em desenvolvimento: base='/' (localhost:5173)
  // Em produção (build): base='/ClickMaster/' (GitHub Pages)
  base: mode === 'production' ? '/ClickMaster/' : '/',
}))