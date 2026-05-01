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

  it('covers all settings state transitions and message states', () => {
    cy.visit('/settings');

    // Test notification toggle OFF and back ON
    cy.get('[data-testid="notifications-toggle"]').uncheck();
    cy.get('[data-testid="notifications-toggle"]').should('not.be.checked');
    cy.get('[data-testid="notifications-toggle"]').check();
    cy.get('[data-testid="notifications-toggle"]').should('be.checked');

    // Test theme selection: light → contrast → light
    cy.get('[data-testid="theme-toggle"]').select('contrast');
    cy.get('[data-testid="theme-toggle"]').should('have.value', 'contrast');
    cy.get('[data-testid="theme-toggle"]').select('light');
    cy.get('[data-testid="theme-toggle"]').should('have.value', 'light');

    // Test currency changes
    cy.get('[data-testid="currency-select"]').select('EUR');
    cy.get('[data-testid="currency-select"]').should('have.value', 'EUR');
    cy.get('[data-testid="currency-select"]').select('INR');
    cy.get('[data-testid="currency-select"]').should('have.value', 'INR');
    cy.get('[data-testid="currency-select"]').select('USD');

    // Test timezone changes
    cy.get('[data-testid="timezone-select"]').select('EST');
    cy.get('[data-testid="timezone-select"]').should('have.value', 'EST');
    cy.get('[data-testid="timezone-select"]').select('UTC');

    // Test feedback message after save
    cy.get('[data-testid="save-settings-button"]').click();
    cy.get('[data-testid="settings-feedback"]').should('not.be.empty');
    cy.get('[data-testid="settings-feedback"]').should('contain.text', 'Settings saved');

    // Feedback should clear when user makes an edit
    cy.get('[data-testid="currency-select"]').select('EUR');
    cy.get('[data-testid="settings-feedback"]').should('be.empty');

    // Test reset path
    cy.get('[data-testid="reset-settings-button"]').click();
    cy.get('[data-testid="settings-feedback"]').should('contain.text', 'reset to defaults');
  });

  it('covers data table sort direction toggle and column-specific sorting', () => {
    cy.visit('/data');

    // Sort on company: asc (↑)
    cy.get('[data-testid="sort-company"]').click();
    cy.get('[data-testid="sort-company"]').should('contain', '↑');

    // Sort on company again: desc (↓)
    cy.get('[data-testid="sort-company"]').click();
    cy.get('[data-testid="sort-company"]').should('contain', '↓');

    // Sort on different column (region): resets to asc (↕→↑)
    cy.get('[data-testid="sort-region"]').click();
    cy.get('[data-testid="sort-region"]').should('contain', '↑');
    cy.get('[data-testid="sort-company"]').should('contain', '↕');

    // Sort on status and verify direction
    cy.get('[data-testid="sort-status"]').click();
    cy.get('[data-testid="sort-status"]').should('contain', '↑');
    cy.get('[data-testid="sort-status"]').click();
    cy.get('[data-testid="sort-status"]').should('contain', '↓');
  });

  it('covers data table pagination boundaries and page size transitions', () => {
    cy.visit('/data');

    // Set to small page size to have multiple pages
    cy.get('[data-testid="page-size-select"]').select('5');
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 1');

    // Verify next button works
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 2');

    // Continue to next
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 3');

    // Go back
    cy.get('[data-testid="prev-page-button"]').click();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 2');

    // Go to first page
    cy.get('[data-testid="prev-page-button"]').click();
    cy.get('[data-testid="prev-page-button"]').click();
    cy.get('[data-testid="prev-page-button"]').click();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 1');
    cy.get('[data-testid="prev-page-button"]').should('be.disabled');

    // Change page size and verify page resets
    cy.get('[data-testid="page-size-select"]').select('10');
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 1');

    // Navigate to last page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="next-page-button"]').should('be.disabled');
  });

  it('covers search input clear and refresh state on new search', () => {
    cy.visit('/data');

    // Navigate to page 2
    cy.get('[data-testid="page-size-select"]').select('5');
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 2');

    // Search -> should reset page to 1
    cy.get('[data-testid="search-input"]').type('Acme');
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 1');

    // Clear search
    cy.get('[data-testid="search-input"]').clear();
    cy.get('[data-testid="page-number"]').should('contain.text', 'Page 1');
  });

  it('covers invalid route redirect and unknown route fallback', () => {
    cy.visit('/invalid-route-xyz');
    cy.location('pathname').should('include', '/dashboard');
    cy.get('.page-title').should('contain.text', 'Dashboard');
  });
});
