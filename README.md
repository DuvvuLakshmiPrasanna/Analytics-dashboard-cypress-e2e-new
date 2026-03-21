# Analytics Dashboard with Cypress E2E

React + Vite analytics dashboard with Cypress end-to-end coverage tests and Docker-based execution.

This project is designed to be evaluation-friendly with deterministic selectors (`data-testid`) and a repeatable Docker run flow.

## Stack

- React 19 + Vite 8
- Cypress 14
- NYC + Istanbul reporting
- Docker + Docker Compose

## Features

- Multi-page analytics UI with routing:
	- Dashboard metrics and chart cards
	- Data table with pagination, sorting, and search
	- Settings form with save/reset behaviors
- Consistent `data-testid` attributes across all key UI elements
- Cypress E2E test suite for required user journeys and edge cases
- NYC report generation pipeline for coverage artifacts

## App Routes

- `/dashboard`
- `/data`
- `/settings`

## Project Structure

```text
src/
	components/         Shared layout components
	pages/              Route-level pages (dashboard, data, settings)
	data/               Mock data and default settings
cypress/
	e2e/coverage/       Required assignment spec files
	support/            Cypress support and code-coverage hooks
```

## NPM Scripts

- `npm run dev`: Run Vite dev server
- `npm run start`: Run app on `0.0.0.0:3005`
- `npm run build`: Production build
- `npm run lint`: ESLint checks
- `npm run cypress:open`: Interactive Cypress mode
- `npm run cypress:run`: Headless Cypress run
- `npm run coverage:report`: Generate NYC reports from collected coverage data
- `npm run test:e2e:coverage`: Run Cypress then NYC reporting in one command

## Cypress Coverage Specs

Required test specs are available under `cypress/e2e/coverage/`:

- `dashboard-filters.cy.js`
- `data-table-operations.cy.js`
- `edge-cases.cy.js`
- `settings-management.cy.js`
- `user-interactions.cy.js`

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start app:

```bash
npm run start
```

3. Validate code quality:

```bash
npm run lint
npm run build
```

4. Run Cypress locally:

```bash
npm run cypress:run
```

If Cypress binary is missing locally, install it:

```bash
npx cypress install
```

5. Optional one-command E2E + coverage report:

```bash
npm run test:e2e:coverage
```

## Docker Workflow

Use this exact flow:

```bash
docker-compose up -d --build
docker-compose exec cypress-coverage-tests npx cypress run
docker-compose exec cypress-coverage-tests npx nyc report --reporter=json-summary --reporter=html --reporter=clover
docker-compose cp cypress-coverage-tests:/app/coverage ./coverage
docker-compose cp cypress-coverage-tests:/app/cypress/reports ./cypress/reports
docker-compose down
```

Why Docker is recommended here:

- Avoids local Cypress binary/cache issues
- Uses the same browser/runtime stack for repeatable results
- Keeps host environment clean

## Generated Artifacts

After Docker execution:

- `coverage/coverage-summary.json`
- `coverage/index.html`
- `coverage/clover.xml`
- `cypress/reports/test-execution.json`

## Test Scope

The E2E suite validates:

- Dashboard rendering and filter interaction
- Data table rendering, sorting, search, and page-size behavior
- Settings control presence and save/reset flows
- Edge cases like empty search results and pagination boundaries
- Cross-page navigation and primary actions

## Environment

See `.env.example`:

- `PORT=3005`
- `CYPRESS_BASE_URL=http://app:3005`

## Troubleshooting

- Cypress executable missing on local machine:
	- Run `npx cypress install`
	- Or use Docker flow directly
- Docker test container not running for `docker-compose exec`:
	- Run `docker-compose up -d --build` again
	- Confirm services with `docker-compose ps`
- Coverage summary shows `Unknown` totals:
	- Ensure instrumentation and coverage hook are enabled in the runtime under test
	- Re-run Cypress before running `nyc report`

## Notes

- All E2E specs pass in Docker with the provided compose workflow.
- Dashboard, data, and settings pages include assignment-required `data-testid` selectors.
