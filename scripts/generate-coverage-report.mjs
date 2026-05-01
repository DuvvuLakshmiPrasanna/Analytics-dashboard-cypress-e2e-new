import fs from 'node:fs'
import path from 'node:path'
import coverageLib from 'istanbul-lib-coverage'
import { createContext } from 'istanbul-lib-report'
import reports from 'istanbul-reports'

const tempDir = '.nyc_output'
const coverageDir = 'coverage'
const htmlDir = path.join(coverageDir, 'lcov-report')
const { createCoverageMap } = coverageLib

function loadCoverageMap() {
  if (!fs.existsSync(tempDir)) {
    throw new Error(`Coverage temp directory not found: ${tempDir}`)
  }

  const files = fs
    .readdirSync(tempDir)
    .filter((fileName) => fileName.endsWith('.json'))

  if (files.length === 0) {
    throw new Error(`No coverage payloads found in ${tempDir}`)
  }

  const coverageMap = createCoverageMap({})

  for (const fileName of files) {
    const filePath = path.join(tempDir, fileName)
    const coveragePayload = JSON.parse(
      fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '')
    )
    coverageMap.merge(coveragePayload)
  }

  return coverageMap
}

const coverageMap = loadCoverageMap()

fs.mkdirSync(coverageDir, { recursive: true })
fs.mkdirSync(htmlDir, { recursive: true })

const summaryContext = createContext({
  dir: coverageDir,
  coverageMap,
})

reports.create('json-summary').execute(summaryContext)
reports.create('clover').execute(summaryContext)
reports.create('lcovonly').execute(summaryContext)

const htmlContext = createContext({
  dir: htmlDir,
  coverageMap,
})

reports.create('html').execute(htmlContext)

console.log(`Coverage reports written to ${coverageDir}`)
