import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task.js'

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3005',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportFilename: 'test-execution',
    quiet: true,
    overwrite: true,
    html: false,
    json: true,
  },
  video: false,
})
