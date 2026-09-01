import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // dev-only media + text editor — studio/server.mjs, started by `npm run dev`
      '/api/media': 'http://localhost:5174',
      '/api/text': 'http://localhost:5174',
    },
  },
})
