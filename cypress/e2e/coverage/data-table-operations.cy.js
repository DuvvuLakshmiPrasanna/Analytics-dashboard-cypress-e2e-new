describe('Data table operations', () => {
  it('renders required table elements and rows', () => {
    cy.visit('/data')

    cy.get('[data-testid="data-table"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="pagination-controls"]').should('be.visible')
    cy.get('[data-testid="page-size-select"]').should('be.visible')
    cy.get('[data-testid="page-number"]').should('contain', 'Page 1 of')
    cy.get('[data-testid="prev-page-button"]').should('be.disabled')
    cy.get('[data-testid="next-page-button"]').should('be.enabled')

    cy.get('[data-testid^="table-header-"]').its('length').should('be.gte', 1)
    cy.get('[data-testid^="table-row-"]').its('length').should('eq', 10)
  })

  it('supports sorting, searching, and changing page size', () => {
    cy.visit('/data')

    cy.get('[data-testid="sort-company"]').click()
    cy.get('[data-testid="table-row-0"]').should('contain', 'Client 01')

    cy.get('[data-testid="sort-company"]').click()
    cy.get('[data-testid="table-row-0"]').should('contain', 'Client 80')

    cy.get('[data-testid="search-input"]').type('Client 05')
    cy.get('[data-testid^="table-row-"]').its('length').should('eq', 1)
    cy.get('[data-testid="table-row-0"]').should('contain', 'Client 05')

    cy.get('[data-testid="search-input"]').clear()
    cy.get('[data-testid="page-size-select"]').select('20')
    cy.get('[data-testid^="table-row-"]').its('length').should('eq', 20)
  })

  it('handles boundary pagination and alternate sort columns', () => {
    cy.visit('/data')

    cy.get('[data-testid="page-size-select"]').select('5')
    cy.get('[data-testid="page-number"]').should('contain', 'Page 1 of 16')
    cy.get('[data-testid="prev-page-button"]').click({ force: true })
    cy.get('[data-testid="page-number"]').should('contain', 'Page 1 of 16')

    for (let i = 0; i < 20; i += 1) {
      cy.get('[data-testid="next-page-button"]').click({ force: true })
    }

    cy.get('[data-testid="page-number"]').should('contain', 'Page 16 of 16')
    cy.get('[data-testid="next-page-button"]').should('be.disabled')

    cy.get('[data-testid="sort-revenue"]').click()
    cy.get('[data-testid="sort-revenue"]').click()
    cy.get('[data-testid="sort-id"]').click()
    cy.get('[data-testid="table-row-0"] td')
      .first()
      .invoke('text')
      .should('match', /^\d+$/)
  })
})
