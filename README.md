# Analytics Dashboard with Cypress E2E

React + Vite analytics dashboard with Cypress end-to-end coverage tests and Docker-based execution.

## Stack

- React 19 + Vite 8
- Cypress 14
- NYC + Istanbul reporting
- Docker + Docker Compose

## App Routes

- `/dashboard`
- `/data`
- `/settings`

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

## Generated Artifacts

After Docker execution:

- `coverage/coverage-summary.json`
- `coverage/index.html`
- `coverage/clover.xml`
- `cypress/reports/test-execution.json`

## Environment

See `.env.example`:

- `PORT=3005`
- `CYPRESS_BASE_URL=http://app:3005`

## Notes

- All E2E specs pass in Docker with the provided compose workflow.
- Dashboard, data, and settings pages include assignment-required `data-testid` selectors.
