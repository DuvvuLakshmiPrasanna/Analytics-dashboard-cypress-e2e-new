describe('Cross-page user interactions', () => {
  it('redirects root and unknown routes to dashboard', () => {
    cy.visit('/')
    cy.url().should('include', '/dashboard')

    cy.visit('/non-existent-route', { failOnStatusCode: false })
    cy.url().should('include', '/dashboard')
  })

  it('navigates across all pages and performs primary actions', () => {
    cy.visit('/dashboard')

    cy.get('[data-testid="export-button"]').click()
    cy.get('[data-testid="dashboard-feedback"]').should('contain', 'Export started successfully')
    cy.get('[data-testid="refresh-button"]').click()
    cy.get('[data-testid="dashboard-feedback"]').should('contain', 'Dashboard refreshed 1 time')

    cy.contains('Data').click()
    cy.url().should('include', '/data')
    cy.get('[data-testid="next-page-button"]').click()
    cy.get('[data-testid="page-number"]').should('contain', 'Page 2 of')
    cy.get('[data-testid="prev-page-button"]').click()
    cy.get('[data-testid="page-number"]').should('contain', 'Page 1 of')

    cy.contains('Settings').click()
    cy.url().should('include', '/settings')
    cy.get('[data-testid="save-settings-button"]').click()
    cy.get('[data-testid="settings-feedback"]').should('contain', 'saved successfully')
  })
})
