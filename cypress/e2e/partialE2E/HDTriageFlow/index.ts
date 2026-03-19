describe('Test the Health and Dental Triage Flow', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it('should go through HD application from quotes input until quotes cards', () => {
    cy.visit(`${Cypress.env('baseURL')}/life/hd/intent`);
    cy.get('[data-cy="undefined-Self-employed or Contractor"]').click();
    cy.get('[data-cy=submit]')
      .should('be.visible')
      .eq(1)
      .click();

    cy.url().should('include', 'life/hd/life-insurance-quotes');
    cy.get('[id=primary_province_search]').click();
    cy.get('[id=primary_province_search]').type('Ontario');
    cy.get('[id=primary_province_search-option-0]').click();

    cy.get('[data-cy=primary_expertDOB-day]').click();
    cy.get('[data-cy=primary_expertDOB-day]').type('1');
    cy.get('[id=primary_birthdate_day-option-0]').click();

    cy.get('[data-cy=primary_expertDOB-month]').click();
    cy.get('[data-cy=primary_expertDOB-month]').type('Feb');
    cy.get('[id=primary_birthdate_month-option-0]').click();

    cy.get('[data-cy=primary_expertDOB-year]').click();
    cy.get('[data-cy=primary_expertDOB-year]').type('1990');
    cy.get('[id=primary_birthdate_year-option-0]').click();

    cy.get('[data-cy=primary_userGender-Male]').click();

    cy.get('[data-cy=primary_expertSmoker-false]').click();

    cy.get('[data-cy=checkbox-quotes-input]').click();

    // cy.get('[data-cy=checkbox-quotes-provided-docs]').click();

    cy.get('[data-cy=submit]').eq(1).click();

    cy.url().should('include', 'life/hd/existing-hd-coverage');
    cy.get('[data-cy=existing_hd_cov-N]').click();
    cy.get('[data-cy=group-benefits-submit]').eq(1).click();

    cy.url().should('include', 'life/hd/group-benefits');
    cy.get('[data-cy=groupBenefits-N]').click();
    cy.get('[data-cy=group-benefits-submit]').eq(1).click();

    cy.url().should('include', 'life/hd/coverage-fit-question');
    cy.get('[data-cy=cov_fit_options-dental_and_prescription]').click();
    cy.get('[data-cy=coverage-fit-submit]').eq(1).click();
    cy.url().should('include', 'life/hd/life-insurance-quotes-continued');
  });
});
