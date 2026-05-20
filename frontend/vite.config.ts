import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:4098',
        changeOrigin: true,
      },
      '/docs': {
        target: 'http://localhost:4097',
        changeOrigin: true,
      },
    },
  },
})
