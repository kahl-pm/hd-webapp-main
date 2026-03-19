describe('Quotes Page redirection', {
    requestTimeout: 10000,
  }, () => {
    it('Should redirect to basic quotes page if missing partner info', () => {
      cy.on('window:before:load', win => {
        win.fetch = null;
      });
      cy.linkRoutes();
      // missing gender info
      cy.visit(`${Cypress.env('baseURL')}/hd/hd/life-insurance-quotes-continued?debug=1&cypress=1&birthdate=01011990&smoker=False&gender=M&province=BC&partner=True&partner_birthdate=02021990&partner_smoker=False&partner_province=BC`);
      cy.viewport(1920, 1080);

      cy.get('[data-cy=quotesCompareInputsHeader]');
      cy.get('[id="secondary_smoker-false"]:checked')
      cy.get('[id="secondary_gender-Male"]:checked').should('not.exist');
      cy.get('[id="secondary_gender-Female"]:checked').should('not.exist');
    });

    it('Should stay on quotes page if containing partner info', () => {
      cy.on('window:before:load', win => {
        win.fetch = null;
      });
      cy.linkRoutes();
      cy.visit(`${Cypress.env('baseURL')}/hd/hd/life-insurance-quotes-continued?debug=1&cypress=1&birthdate=01011990&smoker=False&gender=M&province=BC&partner=True&partner_birthdate=02021990&partner_gender=F&partner_smoker=False&partner_province=BC`);
      cy.viewport(1920, 1080);
      cy.get('[data-cy=estimated-rate-price]');
    });
  });
