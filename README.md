# Analytics Dashboard E2E and Coverage Submission

Production-style analytics dashboard built with React and Vite, including a Dockerized Cypress E2E workflow and NYC coverage reporting.

This repository is explicitly structured to satisfy the assignment scoring requirements:

- Docker Compose service orchestration with health checks
- All required UI selectors (`data-testid`) on Dashboard, Data, and Settings pages
- All required Cypress spec files under `cypress/e2e/coverage/`
- All required output artifacts generated into evaluator-checked paths

## Stack

- React 19
- Vite 8
- React Router 7
- Cypress 14
- @cypress/code-coverage
- NYC (Istanbul)
- Docker and Docker Compose

## Required Pages and Selectors

### Dashboard (`/dashboard`)

- `dashboard-container`
- `date-range-filter`
- `metric-card-users`
- `metric-card-revenue`
- `metric-card-conversion`
- `chart-revenue`
- `chart-users`
- `refresh-button`
- `export-button`

### Data (`/data`)

- `data-table`
- `table-header-*`
- `table-row-*`
- `pagination-controls`
- `page-size-select`
- `page-number`
- `prev-page-button`
- `next-page-button`
- `search-input`
- `sort-*`

### Settings (`/settings`)

- `settings-form`
- `currency-select`
- `timezone-select`
- `notifications-toggle`
- `theme-toggle`
- `save-settings-button`
- `reset-settings-button`

## Required Cypress Spec Files

Located in `cypress/e2e/coverage/`:

- `dashboard-filters.cy.js`
- `data-table-operations.cy.js`
- `settings-management.cy.js`
- `edge-cases.cy.js`
- `user-interactions.cy.js`

## Coverage and Report Artifacts

The project generates all required evaluator artifacts:

- `coverage/coverage-summary.json`
- `coverage/lcov-report/index.html`
- `coverage/clover.xml`
- `cypress/reports/test-execution.json`

Coverage thresholds enforced by NYC:

- Statements >= 80%
- Branches >= 75%
- Functions >= 80%
- Lines >= 80%

## Project Scripts

- `npm run dev` - Start local dev server
- `npm run start` - Start app on `0.0.0.0:3005`
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint checks
- `npm run cypress:open` - Open Cypress runner
- `npm run cypress:run` - Run Cypress headless specs
- `npm run artifacts:clean` - Remove generated coverage and report output
- `npm run coverage:report` - Generate NYC reports (`json-summary`, `lcov`, `clover`)
- `npm run coverage:check` - Enforce coverage thresholds
- `npm run test:e2e:coverage` - Local E2E + coverage report + threshold check
- `npm run test:e2e:coverage:docker` - Full evaluator-compatible Docker run and artifact copy

## One-Command Evaluator Flow

Run this command from repository root:

```bash
npm run test:e2e:coverage:docker
```

This command performs the full sequence:

1. Cleans existing generated artifacts
2. Builds and starts Docker services
3. Runs all required Cypress specs
4. Generates NYC coverage reports inside container
5. Copies required artifacts to host paths
6. Brings containers down

## Manual Docker Flow (Equivalent)

```bash
docker-compose down --remove-orphans
docker-compose up -d --build
docker-compose exec cypress-coverage-tests npx cypress run
docker-compose exec cypress-coverage-tests npx nyc report --reporter=json-summary --reporter=lcov --reporter=clover
docker-compose cp cypress-coverage-tests:/app/coverage/coverage-summary.json ./coverage/coverage-summary.json
docker-compose cp cypress-coverage-tests:/app/coverage/clover.xml ./coverage/clover.xml
docker-compose cp cypress-coverage-tests:/app/coverage/lcov-report/index.html ./coverage/lcov-report/index.html
docker-compose cp cypress-coverage-tests:/app/cypress/reports/test-execution.json ./cypress/reports/test-execution.json
docker-compose down
```

## Verification Checklist

Before submission, verify all of the following are true:

1. `cypress/e2e/coverage/` contains all 5 required spec files.
2. `coverage/coverage-summary.json` exists and meets thresholds.
3. `coverage/lcov-report/index.html` exists.
4. `coverage/clover.xml` exists.
5. `cypress/reports/test-execution.json` exists.
6. UI selectors required by rubric are present on all pages.
7. Questionnaire claims exactly match repository contents.

## Local Development

```bash
npm install
npm run lint
npm run build
npm run start
```

Then in another terminal:

```bash
npm run cypress:run
npm run coverage:report
npm run coverage:check
```

## Troubleshooting

- If Cypress cannot connect to app, ensure `app` service is healthy before running tests.
- If coverage appears as `Unknown`, run the Docker flow (`npm run test:e2e:coverage:docker`) to guarantee instrumentation and copy steps are executed correctly.
- If output directories become nested after repeated copies, run `npm run artifacts:clean` and re-run the Docker flow.
- On Windows, if newly installed CLI tools are not recognized, restart VS Code terminal session.
