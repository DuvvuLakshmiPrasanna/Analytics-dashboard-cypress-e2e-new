describe('Settings management', () => {
  it('shows all required settings controls', () => {
    cy.visit('/settings')

    cy.get('[data-testid="settings-form"]').should('be.visible')
    cy.get('[data-testid="currency-select"]').should('be.visible')
    cy.get('[data-testid="timezone-select"]').should('be.visible')
    cy.get('[data-testid="notifications-toggle"]').should('be.visible')
    cy.get('[data-testid="theme-toggle"]').should('be.visible')
    cy.get('[data-testid="save-settings-button"]').should('be.visible')
    cy.get('[data-testid="reset-settings-button"]').should('be.visible')
  })

  it('saves and resets settings', () => {
    cy.visit('/settings')

    cy.get('[data-testid="currency-select"]').select('INR')
    cy.get('[data-testid="timezone-select"]').select('IST')
    cy.get('[data-testid="notifications-toggle"]').uncheck({ force: true })
    cy.get('[data-testid="theme-toggle"]').select('High Contrast')

    cy.get('[data-testid="save-settings-button"]').click()
    cy.get('[data-testid="settings-feedback"]').should('contain', 'saved successfully')

    cy.get('[data-testid="currency-select"]').select('EUR')
    cy.get('[data-testid="settings-feedback"]').should('have.text', '')

    cy.get('[data-testid="reset-settings-button"]').click()
    cy.get('[data-testid="settings-feedback"]').should('contain', 'reset to defaults')
    cy.get('[data-testid="currency-select"]').should('have.value', 'USD')
    cy.get('[data-testid="timezone-select"]').should('have.value', 'UTC')
    cy.get('[data-testid="notifications-toggle"]').should('be.checked')
    cy.get('[data-testid="theme-toggle"]').should('have.value', 'light')
  })
})
