describe('Branch coverage: routes, settings, data table', () => {
  it('redirects / to /dashboard and highlights nav links', () => {
    cy.visit('/');
    cy.location('pathname').should('include', '/dashboard');

    cy.visit('/dashboard');
    cy.get('.nav-links').contains('Dashboard').should('have.class', 'active');

    cy.visit('/data');
    cy.get('.nav-links').contains('Data').should('have.class', 'active');

    cy.visit('/settings');
    cy.get('.nav-links').contains('Settings').should('have.class', 'active');
  });

  it('updates settings and shows feedback messages', () => {
    cy.visit('/settings');

    cy.get('[data-testid="currency-select"]').select('EUR');
    cy.get('[data-testid="timezone-select"]').select('IST');
    cy.get('[data-testid="notifications-toggle"]').uncheck().check();
    cy.get('[data-testid="theme-toggle"]').select('contrast');

    cy.get('[data-testid="save-settings-button"]').click();
    cy.get('[data-testid="settings-feedback"]').should(
      'contain.text',
      'Settings saved successfully.',
    );

    cy.get('[data-testid="reset-settings-button"]').click();
    cy.get('[data-testid="settings-feedback"]').should(
      'contain.text',
      'Settings reset to defaults.',
    );
  });

  it('searches, sorts and paginates the data table', () => {
    cy.visit('/data');

    // Ensure table has rows initially
    cy.get('[data-testid="data-table"] tbody tr').its('length').should('be.gte', 1);

    // Search for a term that yields no results
    cy.get('[data-testid="search-input"]').type('no-such-company-xyz');
    cy.get('[data-testid="data-table"] tbody').contains('No matching records found.');

    // Clear search and test sorting
    cy.get('[data-testid="search-input"]').clear();
    cy.get('[data-testid="sort-company"]').click();
    cy.get('[data-testid="sort-company"]').click();

    // Change rows per page to force pagination
    cy.get('[data-testid="page-size-select"]').select('5');
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="prev-page-button"]').click();

    // Bounds: go to prev on first page should disable
    cy.get('[data-testid="page-number"]').then(($el) => {
      const text = $el.text();
      // read page number text like 'Page 1 of X'
      if (text.includes('Page 1')) {
        cy.get('[data-testid="prev-page-button"]').should('be.disabled');
      }
    });
  });

  it('covers dashboard refresh pluralization and export branch', () => {
    cy.visit('/dashboard');

    // initial state: 0 refreshes
    cy.get('[data-testid="dashboard-feedback"]').should('contain.text', 'Dashboard refreshed 0');

    // refresh once -> singular 'time'
    cy.get('[data-testid="refresh-button"]').click();
    cy.get('[data-testid="dashboard-feedback"]').should('contain.text', 'time');

    // refresh again -> plural 'times'
    cy.get('[data-testid="refresh-button"]').click();
    cy.get('[data-testid="dashboard-feedback"]').should('contain.text', 'times');

    // export takes the exported branch
    cy.get('[data-testid="export-button"]').click();
    cy.get('[data-testid="dashboard-feedback"]').should('contain.text', 'Export started successfully.');
  });
});
