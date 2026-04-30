import fs from 'node:fs'
import { execSync } from 'node:child_process'

const run = (command) => {
  console.log(`\n> ${command}`)
  execSync(command, { stdio: 'inherit' })
}

const ensureDir = (path) => fs.mkdirSync(path, { recursive: true })

try {
  run('docker-compose down --remove-orphans')
  run('node scripts/clean-artifacts.mjs')

  run('docker-compose up -d --build')
  run('docker-compose exec cypress-coverage-tests npx cypress run')
  run('docker-compose exec cypress-coverage-tests npx nyc report --reporter=json-summary --reporter=lcov --reporter=clover')

  ensureDir('coverage')
  ensureDir('coverage/lcov-report')
  ensureDir('cypress/reports')

  run('docker-compose cp cypress-coverage-tests:/app/coverage/coverage-summary.json ./coverage/coverage-summary.json')
  run('docker-compose cp cypress-coverage-tests:/app/coverage/clover.xml ./coverage/clover.xml')
  run('docker-compose cp cypress-coverage-tests:/app/coverage/lcov-report/index.html ./coverage/lcov-report/index.html')
  run('docker-compose cp cypress-coverage-tests:/app/cypress/reports/test-execution.json ./cypress/reports/test-execution.json')

  console.log('\nAll required artifacts generated successfully.')
} finally {
  run('docker-compose down')
}
