import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    istanbul({
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['node_modules', 'cypress', '**/*.test.js', '**/*.cy.js'],
      extension: ['.js', '.jsx'],
      requireEnv: false,
      rollup: {
        include: ['src/**/*.js', 'src/**/*.jsx'],
        exclude: ['node_modules', 'cypress', '**/*.test.js', '**/*.cy.js'],
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
