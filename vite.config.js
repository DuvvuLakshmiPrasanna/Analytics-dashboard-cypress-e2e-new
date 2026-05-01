import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  base: '/Analytics-dashboard-cypress-e2e-new/',
  build: {
    sourcemap: true,
  },
  plugins: [
    istanbul({
      cypress: true,
      include: 'src/**/*.{js,jsx}',
      exclude: ['cypress/**', '**/*.cy.js', '**/*.config.js'],
      requireEnv: false,
    }),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3005,
    strictPort: true,
    allowedHosts: ['app', 'localhost'],
  },
})
