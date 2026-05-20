import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      // In development, keep frontend on Vite and delegate API/docs to Docker.
      '/api': {
        target: 'http://localhost:4097',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://localhost:4097',
        changeOrigin: true,
      },
    },
  },
})
