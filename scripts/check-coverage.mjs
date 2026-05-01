import fs from 'node:fs'

const summaryPath = 'coverage/coverage-summary.json'
const thresholds = {
  statements: 65,
  branches: 55,
  functions: 57,
  lines: 70,
}

if (!fs.existsSync(summaryPath)) {
  throw new Error(`Coverage summary not found: ${summaryPath}`)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const failures = []

for (const [metric, minimum] of Object.entries(thresholds)) {
  const total = summary.total?.[metric]?.total ?? 0
  const covered = summary.total?.[metric]?.covered ?? 0
  const percentage = summary.total?.[metric]?.pct

  if (total === 0) {
    failures.push(`${metric} total is 0`)
    continue
  }

  if (typeof percentage !== 'number' || percentage < minimum) {
    failures.push(`${metric} coverage ${covered}/${total} (${percentage}%) is below ${minimum}%`)
  }
}

if (failures.length > 0) {
  throw new Error(`Coverage thresholds not met:\n- ${failures.join('\n- ')}`)
}

console.log('Coverage thresholds met')
