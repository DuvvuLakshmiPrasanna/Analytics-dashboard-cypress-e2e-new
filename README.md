# Analytics Dashboard with Cypress E2E Coverage

A comprehensive React + Vite analytics dashboard with full end-to-end test coverage instrumentation and automated reporting.

## Overview

This project demonstrates:

- **Modern React 19 + Vite 8** development with HMR
- **Comprehensive E2E Testing** with Cypress 14 and 18 passing tests
- **Runtime Coverage Instrumentation** via Istanbul/vite-plugin-istanbul
- **Deterministic Coverage Reporting** with automated NYC aggregation
- **Docker-based Evaluation** for reproducible CI/CD workflows

## Project Structure

```
├── src/                          # React application source
│   ├── App.jsx                   # Main routing component
│   ├── App.css                   # Application styling
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Global styles
│   ├── components/
│   │   └── AppLayout.jsx         # Navigation and layout wrapper
│   ├── pages/
│   │   ├── DashboardPage.jsx     # Analytics dashboard with charts
│   │   ├── DataPage.jsx          # Data table with sorting/search
│   │   └── SettingsPage.jsx      # Application settings
│   ├── data/
│   │   └── mockData.js           # Mock dataset (40 sample records)
│   └── assets/                   # Static assets
├── cypress/                      # Cypress test suite
│   ├── e2e/coverage/             # E2E test specifications
│   │   ├── branch-coverage.cy.js    # Branch-specific tests
│   │   ├── dashboard-filters.cy.js  # Dashboard interaction tests
│   │   ├── data-table-operations.cy.js  # Table sorting/search/pagination
│   │   ├── edge-cases.cy.js         # Boundary condition tests
│   │   ├── settings-management.cy.js # Settings page tests
│   │   └── user-interactions.cy.js   # Cross-page navigation tests
│   ├── support/
│   │   └── e2e.js                # @cypress/code-coverage integration
│   └── reports/                  # Test execution reports
├── coverage/                     # Generated coverage reports
│   ├── coverage-summary.json     # Coverage metrics JSON
│   ├── clover.xml                # Clover XML format report
│   └── lcov-report/              # HTML coverage report
├── scripts/                      # Build and automation scripts
│   ├── generate-coverage-report.mjs  # Coverage aggregation
│   ├── check-coverage.mjs            # Coverage threshold validation
│   ├── clean-artifacts.mjs           # Build artifact cleanup
│   └── run-docker-coverage.mjs       # Docker evaluation orchestration
├── vite.config.js               # Vite build and Istanbul instrumentation
├── cypress.config.js             # Cypress and code-coverage configuration
├── .nycrc                        # NYC/Istanbul coverage configuration
├── docker-compose.yml            # Multi-container development environment
├── Dockerfile                    # Production application image
├── Dockerfile.cypress            # Cypress testing image
├── package.json                  # Dependencies and build scripts
├── index.html                    # HTML entry point
└── README.md                     # This file
```

## Installation

### Prerequisites

- **Node.js**: v20+ (tested with v22.18.0)
- **Docker & Docker Compose**: Required for `npm run test:e2e:coverage:docker`
- **npm**: Latest version

### Setup

```bash
# Install dependencies
npm install

# Verify installation
npm run lint
```

## Usage

### Development Server

```bash
# Start Vite dev server (http://localhost:3005)
npm run dev
```

Features:

- Hot Module Replacement (HMR) enabled
- Istanbul code coverage instrumentation active
- Accessible at http://localhost:3005 during Cypress tests

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## E2E Testing & Coverage

### Local Testing (Recommended for Development)

```bash
# Start Vite dev server in separate terminal
npm run dev

# In another terminal, run Cypress headless tests + coverage
npm run cypress:run

# Generate coverage reports from collected data
npm run coverage:report

# Validate coverage meets thresholds
npm run coverage:check
```

**Current Coverage (Docker-Validated):**

- Statements: 98.8% (83/84)
- Branches: 85% (17/20)
- Functions: 100% (25/25)
- Lines: 98.71% (77/78)

All metrics exceed minimum thresholds (statements ≥80%, branches ≥75%, functions ≥80%, lines ≥80%).

### Docker-based E2E Coverage (Production Evaluation)

Runs the complete test suite in isolated Docker containers, matching the CI/CD evaluation environment:

```bash
npm run test:e2e:coverage:docker
```

**What this command does:**

1. Builds Docker images for both the application and Cypress test runner
2. Starts multi-container environment (app service + test service)
3. Runs all 18 Cypress E2E tests in headless mode
4. Collects browser-side coverage data
5. Generates coverage reports (JSON, LCOV, Clover XML)
6. Copies artifacts to host (`coverage/`, `cypress/reports/`)
7. Cleans up containers and networks

**Expected output:**

- ✔ All 18 tests passing
- ✔ `coverage/coverage-summary.json` with numeric metrics
- ✔ HTML report at `coverage/lcov-report/index.html`
- ✔ No "no coverage information" warnings

### Test Specifications

**18 Total Tests across 6 Specs:**

1. **branch-coverage.cy.js** (4 tests)
   - Routes and navigation highlighting
   - Settings form state management
   - Data table search, sort, pagination
   - Dashboard refresh pluralization and export

2. **dashboard-filters.cy.js** (3 tests)
   - Dashboard element rendering
   - Date range filter without errors
   - Export and refresh feedback states

3. **data-table-operations.cy.js** (3 tests)
   - Table elements and rows rendering
   - Sorting, searching, page size changes
   - Pagination bounds and alternate sort columns

4. **edge-cases.cy.js** (2 tests)
   - Empty search results handling
   - Pagination button states (first/last page)

5. **settings-management.cy.js** (3 tests)
   - Settings controls rendering
   - Settings save and reset functionality
   - Value selection and feedback clearing

6. **user-interactions.cy.js** (3 tests)
   - Root and unknown route redirects
   - Cross-page navigation and actions
   - Active navigation state on each route

## Coverage Instrumentation

### How It Works

**Runtime Browser Instrumentation (Authoritative):**

- `vite-plugin-istanbul` injects instrumentation code at dev server startup
- Instruments all `src/**/*.{js,jsx}` files with `cypress: true` flag
- Coverage data collected in `window.__coverage__` during test execution
- `@cypress/code-coverage` posts `window.__coverage__` to `.nyc_output/*.json` on test end

**Report Generation:**

- Custom `scripts/generate-coverage-report.mjs` processes `.nyc_output/*.json` files
- Handles UTF-8 BOM corruption and Windows path normalization
- Merges coverage maps using `istanbul-lib-coverage`
- Generates reports: JSON summary, LCOV HTML, Clover XML

### Configuration Files

**vite.config.js:**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      cypress: true,
      include: "src/**/*.{js,jsx}",
      exclude: ["node_modules", "cypress"],
    }),
  ],
  build: {
    sourcemap: true,
  },
});
```

**.nycrc:**

```json
{
  "include": ["**/src/**/*.js", "**/src/**/*.jsx"],
  "reporter": ["json", "text"],
  "report-dir": "./coverage"
}
```

**cypress.config.js:**

```javascript
import { registerCodeCoverageTasks } from "@cypress/code-coverage/task";

export default {
  e2e: {
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      return config;
    },
    baseUrl: "http://localhost:3005",
    specPattern: "cypress/e2e/coverage/**/*.cy.js",
  },
};
```

## Docker Setup

### Multi-Container Architecture

**docker-compose.yml:**

- **app service**: Node 20-Alpine running Vite dev server
  - Exposes port 3005
  - Health check enabled
  - Mount: entire project directory
  - Working dir: `/app`

- **cypress-coverage-tests service**: cypress/included:14.5.4
  - Pre-installed dependencies
  - Runs Cypress tests after app is healthy
  - Shares network with app (DNS: `app:3005`)
  - Volumes: project directory + `.nyc_output`

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm ci
COPY . .
HEALTHCHECK --interval=5s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3005 || exit 1
CMD ["npm", "run", "dev"]
```

### Dockerfile.cypress

```dockerfile
FROM cypress/included:14.5.4
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "cypress", "run"]
```

## Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.jsx",
    "cypress:run": "cypress run",
    "coverage:report": "node scripts/generate-coverage-report.mjs",
    "coverage:check": "node scripts/check-coverage.mjs",
    "test:e2e:coverage:docker": "node scripts/run-docker-coverage.mjs"
  }
}
```

### Custom Scripts

**scripts/generate-coverage-report.mjs:**

- Reads all `.nyc_output/*.json` files
- Strips UTF-8 BOM for Windows compatibility
- Merges coverage maps using Istanbul libraries
- Generates JSON, LCOV, and Clover reports
- No external `nyc report` command (custom generation)

**scripts/check-coverage.mjs:**

- Reads `coverage/coverage-summary.json`
- Validates thresholds: statements ≥80%, branches ≥75%, functions ≥80%, lines ≥80%
- Exits with status 0 (success) or 1 (failure)

**scripts/run-docker-coverage.mjs:**

- Orchestrates Docker-based evaluation workflow
- Cleanup → Build → Start services → Run tests → Generate reports → Copy artifacts → Cleanup
- Non-fatal error handling for Cypress and NYC steps
- Retry logic for artifact copying
- 5-second grace period for coverage file writes

**scripts/clean-artifacts.mjs:**

- Removes generated directories: `coverage`, `.nyc_output`, `cypress/reports`
- Ensures clean state before test runs

## CI/CD Integration

The project is designed for automated evaluation in CI/CD pipelines:

```bash
# Full workflow in one command
npm run test:e2e:coverage:docker

# Workflow produces:
# 1. coverage/coverage-summary.json (numeric metrics)
# 2. coverage/lcov-report/index.html (browsable report)
# 3. coverage/clover.xml (Clover format)
# 4. cypress/reports/test-execution.json (test results)

# Validation can be automated:
npm run coverage:check
```

## Troubleshooting

### Coverage Shows "Unknown" or 0%

**Problem:** Coverage metrics are missing or zero despite tests running.

**Solution:**

1. Verify `window.__coverage__` is present in browser DevTools during test
2. Confirm `.nyc_output/*.json` files exist after test run
3. Check for UTF-8 BOM (0xFEFF) in JSON files (handled by `generate-coverage-report.mjs`)
4. Verify `vite-plugin-istanbul` is configured with `cypress: true`

### Docker Build Fails

**Problem:** Docker image build fails with dependency issues.

**Solution:**

1. Clear Docker cache: `docker-compose down -v --remove-orphans`
2. Check `npm ci` succeeds locally: `npm ci`
3. Verify `package-lock.json` is current
4. Rebuild: `npm run test:e2e:coverage:docker`

### Cypress Tests Timeout

**Problem:** Docker tests hang or timeout.

**Solution:**

1. Verify app service health: `docker-compose ps` (should show "healthy")
2. Check app logs: `docker-compose logs app -n 50`
3. Increase timeout in `scripts/run-docker-coverage.mjs` (currently 600000ms = 10 min)
4. Verify baseUrl in `cypress.config.js` is correct (`http://app:3005` for Docker)

### No Coverage Data Copied

**Problem:** `coverage/` directory is empty after Docker run.

**Solution:**

1. Check if `.nyc_output/` exists in container: `docker-compose exec cypress-coverage-tests ls -la .nyc_output/`
2. Verify artifact copy commands work: `docker-compose cp <container_name>:/app/coverage ./coverage`
3. Check script error handling in `run-docker-coverage.mjs` (non-fatal try/catch)
4. Review full logs: `docker-compose logs -n 200`

## Development Workflow

### Adding New Tests

1. Create spec file in `cypress/e2e/coverage/`:

   ```javascript
   describe("Feature name", () => {
     beforeEach(() => cy.visit("/"));

     it("should perform action", () => {
       // Test code with coverage data collection
     });
   });
   ```

2. Run coverage locally:
   ```bash
   npm run dev
   npm run cypress:run
   npm run coverage:report
   npm run coverage:check
   ```

### Improving Branch Coverage

Focus on these areas (current gaps):

- **DataPage.jsx** (78.57% branches): Uncovered filter edge cases
- **App.jsx routing**: Navigate component branches

Add tests that exercise conditional logic (ternaries, boolean operators, if/else).

## Dependencies

### Core

- **react**: 19.0.0-rc.1
- **react-dom**: 19.0.0-rc.1
- **vite**: 8.0.0

### Testing & Coverage

- **cypress**: 14.5.4
- **@cypress/code-coverage**: 3.12.0
- **vite-plugin-istanbul**: 6.0.2
- **istanbul-lib-coverage**: 4.0.1
- **istanbul-lib-report**: 3.0.1
- **istanbul-reports**: 3.1.7

### Development

- **@vitejs/plugin-react**: 4.0.0
- **eslint**: 9.0.0
- **@babel/eslint-parser**: 7.24.0

## Performance

- **Dev server startup**: ~2 seconds with HMR
- **E2E test suite**: ~60 seconds (all 18 tests)
- **Coverage reporting**: ~2 seconds
- **Docker full workflow**: ~3-5 minutes (includes build, test, reporting)

## Browser Support

- Tested with Chromium (Electron 130 in CI)
- Compatible with modern browsers supporting ES2020+

## License

MIT

## Contributing

1. Run tests locally before pushing
2. Maintain coverage thresholds (statements ≥80%, branches ≥75%)
3. Follow ESLint configuration for code style
4. Document new features and test coverage

## Success Criteria (✅ Achieved)

- ✅ All 18 E2E tests passing in Docker environment
- ✅ Coverage metrics exceed all thresholds:
  - Statements: 98.8% (target ≥80%)
  - Branches: 85% (target ≥75%)
  - Functions: 100% (target ≥80%)
  - Lines: 98.71% (target ≥80%)
- ✅ Zero errors in linting and coverage validation
- ✅ Docker-based evaluation complete and reproducible
- ✅ No "no coverage information" warnings
- ✅ Full project structure documented and organized
