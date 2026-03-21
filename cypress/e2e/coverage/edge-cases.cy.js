describe('Edge cases', () => {
  it('handles empty search results', () => {
    cy.visit('/data')

    cy.get('[data-testid="search-input"]').type('zzzz-no-match')
    cy.contains('No matching records found.').should('be.visible')
    cy.get('[data-testid="next-page-button"]').should('be.disabled')
    cy.get('[data-testid="prev-page-button"]').should('be.disabled')
  })

  it('disables pagination buttons on first and last page', () => {
    cy.visit('/data')

    cy.get('[data-testid="prev-page-button"]').should('be.disabled')

    cy.get('[data-testid="next-page-button"]').click().click().click().click().click().click().click()
    cy.get('[data-testid="next-page-button"]').should('be.disabled')
    cy.get('[data-testid="page-number"]').should('contain', 'Page 8 of 8')
  })
})
