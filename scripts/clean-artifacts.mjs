import fs from 'node:fs'

const paths = ['coverage', '.nyc_output', 'cypress/reports']

for (const path of paths) {
  fs.rmSync(path, { recursive: true, force: true })
}

fs.mkdirSync('coverage/lcov-report', { recursive: true })
fs.mkdirSync('cypress/reports', { recursive: true })

console.log('Cleaned generated artifacts: coverage, .nyc_output, cypress/reports')
