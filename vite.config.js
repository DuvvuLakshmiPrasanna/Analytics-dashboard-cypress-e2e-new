import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Analytics-dashboard-cypress-e2e/',
  plugins: [
    react({
      babel: {
        plugins: ['istanbul'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3005,
    strictPort: true,
    allowedHosts: ['app', 'localhost'],
  },
})
