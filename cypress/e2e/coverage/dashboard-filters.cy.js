describe('Dashboard filters and elements', () => {
  it('renders all required dashboard elements', () => {
    cy.visit('/dashboard')

    cy.get('[data-testid="dashboard-container"]').should('be.visible')
    cy.get('[data-testid="date-range-filter"]').should('be.visible')
    cy.get('[data-testid="metric-card-users"]').should('be.visible')
    cy.get('[data-testid="metric-card-revenue"]').should('be.visible')
    cy.get('[data-testid="metric-card-conversion"]').should('be.visible')
    cy.get('[data-testid="chart-revenue"]').should('be.visible')
    cy.get('[data-testid="chart-users"]').should('be.visible')
    cy.get('[data-testid="refresh-button"]').should('be.visible')
    cy.get('[data-testid="export-button"]').should('be.visible')
  })

  it('allows changing date range without UI errors', () => {
    cy.visit('/dashboard')

    cy.get('[data-testid="date-range-filter"]').select('7d')
    cy.get('[data-testid="date-range-filter"]').select('90d')

    cy.get('[data-testid="metric-card-users"]').should('be.visible')
    cy.get('[data-testid="metric-card-revenue"]').should('be.visible')
    cy.get('[data-testid="metric-card-conversion"]').should('be.visible')
  })
})
