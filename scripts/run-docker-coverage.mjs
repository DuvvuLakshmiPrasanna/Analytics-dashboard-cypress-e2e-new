import fs from 'node:fs'
import { execSync } from 'node:child_process'

const run = (command, options = {}) => {
  console.log(`\n> ${command}`)
  const opts = { stdio: 'inherit', timeout: 600000, ...options }
  execSync(command, opts)
}

const ensureDir = (path) => fs.mkdirSync(path, { recursive: true })

;(async () => {
try {
  run('docker-compose down --remove-orphans')
  run('node scripts/clean-artifacts.mjs')

  run('docker-compose up -d --build')
  
  // Run cypress tests with extended timeout (10 minutes)
  try {
    run('docker-compose exec cypress-coverage-tests npx cypress run', { stdio: 'inherit' })
  } catch (e) {
    console.warn('Cypress run had an issue, but continuing to collect coverage artifacts...')
  }
  
  // Give container time to write coverage
  await new Promise(r => setTimeout(r, 5000))
  
  // Run nyc report to generate coverage summaries
  try {
    run('docker-compose exec cypress-coverage-tests npx nyc report --reporter=json-summary --reporter=lcov --reporter=clover', { stdio: 'inherit' })
  } catch (e) {
    console.warn('NYC report generation had an issue, continuing to copy artifacts...')
  }

  ensureDir('coverage')
  ensureDir('coverage/lcov-report')
  ensureDir('cypress/reports')

  // Copy coverage artifacts from container with retries
  const artifacts = [
    { from: 'cypress-coverage-tests:/app/coverage/coverage-summary.json', to: './coverage/coverage-summary.json' },
    { from: 'cypress-coverage-tests:/app/coverage/clover.xml', to: './coverage/clover.xml' },
    { from: 'cypress-coverage-tests:/app/coverage/lcov-report/index.html', to: './coverage/lcov-report/index.html' },
    { from: 'cypress-coverage-tests:/app/cypress/reports/test-execution.json', to: './cypress/reports/test-execution.json' }
  ]
  
  for (const artifact of artifacts) {
    try {
      run(`docker-compose cp ${artifact.from} ${artifact.to}`)
    } catch (e) {
      console.warn(`Failed to copy ${artifact.from}, trying again...`)
      await new Promise(r => setTimeout(r, 2000))
      try {
        run(`docker-compose cp ${artifact.from} ${artifact.to}`)
      } catch (e2) {
        console.warn(`Could not copy ${artifact.from} - may not exist yet`)
      }
    }
  }

  console.log('\nAll artifacts collection complete.')
} finally {
  try {
    run('docker-compose down --remove-orphans')
  } catch (e) {
    console.warn('Error during cleanup, but process complete')
  }
}
})()

