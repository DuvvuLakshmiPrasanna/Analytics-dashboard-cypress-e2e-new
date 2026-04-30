# Analytics Dashboard with Comprehensive Cypress Coverage

This repository contains a multi-page analytics dashboard built with React and Vite, plus a Cypress end-to-end suite instrumented for Istanbul/NYC coverage reporting.

The project is aligned to the evaluation rubric:

- Docker Compose setup with `app` and `cypress-coverage-tests` services
- Required routes and `data-testid` selectors
- Required Cypress spec files under `cypress/e2e/coverage/`
- Coverage reports produced in evaluator-expected locations

## Tech Stack

- React 19
- Vite 8
- React Router
- Cypress 14
- `@cypress/code-coverage`
- NYC (Istanbul)
- Docker + Docker Compose

## Routes and Required UI

- `/dashboard`
- `/data`
- `/settings`

Each page implements all assignment-required selectors, including:

- Dashboard: `dashboard-container`, `date-range-filter`, `metric-card-*`, `chart-*`, `refresh-button`, `export-button`
- Data: `data-table`, `table-header-*`, `table-row-*`, `pagination-controls`, `page-size-select`, `page-number`, `prev-page-button`, `next-page-button`, `search-input`, `sort-*`
- Settings: `settings-form`, `currency-select`, `timezone-select`, `notifications-toggle`, `theme-toggle`, `save-settings-button`, `reset-settings-button`

## Repository Structure

```text
src/
  components/
  data/
  pages/
cypress/
  e2e/coverage/
    dashboard-filters.cy.js
    data-table-operations.cy.js
    edge-cases.cy.js
    settings-management.cy.js
    user-interactions.cy.js
  support/e2e.js
Dockerfile
Dockerfile.cypress
docker-compose.yml
```

## Environment Variables

The project includes `.env.example`:

- `PORT=3005`
- `CYPRESS_BASE_URL=http://app:3005`

## How Coverage Works

1. Source code is instrumented using `babel-plugin-istanbul` via Vite React plugin configuration.
2. Cypress loads `@cypress/code-coverage/support` in `cypress/support/e2e.js`.
3. Cypress plugin task is registered in `cypress.config.js`.
4. After test execution, NYC generates reports from collected coverage.

## NPM Scripts

- `npm run dev`: start local dev server
- `npm run start`: start app on `0.0.0.0:3005`
- `npm run build`: build production bundle
- `npm run lint`: run ESLint
- `npm run cypress:open`: open Cypress UI
- `npm run cypress:run`: run Cypress in headless mode
- `npm run coverage:report`: generate `json-summary`, `lcov`, and `clover` reports
- `npm run coverage:check`: enforce coverage thresholds (`80/75/80/80`)
- `npm run test:e2e:coverage`: run Cypress + report generation + threshold check

## Docker Execution (Evaluator-Compatible)

Run the same flow used by evaluation:

```bash
docker-compose up -d --build
docker-compose exec cypress-coverage-tests npx cypress run
docker-compose exec cypress-coverage-tests npx nyc report --reporter=json-summary --reporter=lcov --reporter=clover
docker-compose cp cypress-coverage-tests:/app/coverage ./coverage
docker-compose cp cypress-coverage-tests:/app/cypress/reports ./cypress/reports
docker-compose down
```

## Expected Output Files

After the above commands, these files must exist:

- `coverage/coverage-summary.json`
- `coverage/lcov-report/index.html`
- `coverage/clover.xml`
- `cypress/reports/test-execution.json`

## Local Development

```bash
npm install
npm run lint
npm run build
npm run start
```

In another terminal:

```bash
npm run cypress:run
npm run coverage:report
```

## Submission Notes

- Do not commit generated artifacts:
  - `coverage/`
  - `cypress/reports/`
- These are intentionally ignored in `.gitignore` and should be generated during evaluation.

## Troubleshooting

- If `docker-compose exec` fails because services are not running, execute `docker-compose up -d --build` again.
- If coverage totals are `Unknown`, run Cypress first and then run the NYC report command.
- If Cypress is unavailable locally on Windows, prefer Docker flow to avoid host binary issues.
