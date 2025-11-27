import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Reemplaza 'visual_works' con el nombre EXACTO de tu repo
  base: '/visual_works/', 
})