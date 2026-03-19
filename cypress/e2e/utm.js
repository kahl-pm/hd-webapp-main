describe('Blog To Life App Route UTM Cookie logic', () => {
  it('transfers cookies set on blog page to life app', () => {
    cy.on('window:before:load', win => {
      win.fetch = null; // eslint-disable-line no-param-reassign
    });
    
    cy.intercept('POST', 'https://dev.policyme.com/api/life-main/v2.0/utm').as('initUTM');
    cy.visit('https://dev.policyme.com/blog/more-canadians-are-considering-life-insurance-since-covid-19-began/?utm_source=direct&utm_campaign=reddit&sid=123', { failOnStatusCode: false });
    // cy.wait(1000);
    cy.getCookie('utm_source').should('have.property', 'value', 'direct');
    cy.getCookie('utm_campaign').should('have.property', 'value', 'reddit');
    cy.getCookie('utm_content').should('have.property', 'value', 'More%20Canadians%20Are%20Considering%20Life%20Insurance%20Since%20COVID-19%20Began');
    cy.getCookie('utm_extras').should('have.property', 'value');
    cy.wait('@initUTM').then(async (xhr) => {
      const response = await new Response(xhr.responseBody).text();
      const jsonResponse = JSON.parse(response);
      cy.intercept('PATCH', `https://dev.policyme.com/api/life-main/v3/utm/${jsonResponse.data.utm_global_id}/tracking/${jsonResponse.data.utm_tracking_id}`).as('utmPATCH');
      expect(jsonResponse.data.utm_global_id).to.exist;
      expect(jsonResponse.data.utm_tracking_id).to.exist;
      cy.wrap(jsonResponse.data.utm_global_id).as('utmGlobal');
      cy.wrap(jsonResponse.data.utm_global_id).as('utmTracking');
      cy.getCookie('utm_global_id').should('have.property', 'value', jsonResponse.data.utm_global_id);
      cy.getCookie('utm_tracking_id').should('have.property', 'value', jsonResponse.data.utm_tracking_id);
      // jsonResponse is real json response
      // This solution came from https://stackoverflow.com/questions/59317761/cypress-response-body-as-blob-instead-of-json-but-json-in-chrome-devtools
    });
    cy.get('.button-container > div.jsx-726197490 > .jsx-726197490')
      .click();
    cy.getCookie('utm_source').should('have.property', 'value', 'direct');
    cy.getCookie('utm_campaign').should('have.property', 'value', 'reddit');
    cy.getCookie('utm_content').should('have.property', 'value', 'More%20Canadians%20Are%20Considering%20Life%20Insurance%20Since%20COVID-19%20Began');
    cy.getCookie('utm_extras').should('have.property', 'value');
    cy.get('@utmGlobal').then((utmGlobal) => {
      cy.getCookie('utm_global_id').should('have.property', 'value', utmGlobal);
    });
    cy.get('@utmTracking').then((utmGlobal) => {
      cy.getCookie('utm_global_id').should('have.property', 'value', utmGlobal);
    });
  });
});

describe('utm cookie logic on blog only', () => {
  it('updates any previously set cookies after landing on new blog ar', () => {
    cy.on('window:before:load', win => {
      win.fetch = null; // eslint-disable-line no-param-reassign
    });
    
    cy.intercept('POST', 'https://dev.policyme.com/api/life-main/v2.0/utm').as('initUTM');
    cy.setCookie('utm_source', 'direct');
    cy.setCookie('utm_campaign', 'facebook');
    cy.setCookie('utm_extras', '{%22sid%22:%22123%22}');
    cy.visit('https://dev.policyme.com/blog/more-canadians-are-considering-life-insurance-since-covid-19-began/?utm_source=seo&utm_campaign=cypress&sid=123', { failOnStatusCode: false });
    cy.wait('@initUTM').then(async (xhr) => {
      const response = await new Response(xhr.responseBody).text();
      const jsonResponse = JSON.parse(response);
      cy.intercept('PATCH', `https://dev.policyme.com/api/life-main/v3/utm/${jsonResponse.data.utm_global_id}/tracking/${jsonResponse.data.utm_tracking_id}`).as('utmPATCH');
      expect(jsonResponse.data.utm_global_id).to.exist;
      expect(jsonResponse.data.utm_tracking_id).to.exist;
      cy.getCookie('utm_global_id').should('have.property', 'value', jsonResponse.data.utm_global_id);
      cy.getCookie('utm_tracking_id').should('have.property', 'value', jsonResponse.data.utm_tracking_id);
      // jsonResponse is real json response
      // This solution came from https://stackoverflow.com/questions/59317761/cypress-response-body-as-blob-instead-of-json-but-json-in-chrome-devtools
    });
    cy.getCookie('utm_source').should('have.property', 'value', 'seo');
    cy.getCookie('utm_campaign').should('have.property', 'value', 'cypress');
    cy.getCookie('utm_extras').should('have.property', 'value');
  });
  it('creates a new tracking id if there is already a global id', () => {
    cy.on('window:before:load', win => {
      win.fetch = null; // eslint-disable-line no-param-reassign
    });
    
    cy.intercept('POST', 'https://dev.policyme.com/api/life-main/v2.0/utm/00000000-0000-4000-0000-000000000000/tracking').as('initUTM');
    cy.setCookie('utm_global_id', '00000000-0000-4000-0000-000000000000', { domain: 'dev.policyme.com' });
    cy.setCookie('utm_tracking_id', '00000000-0000-4000-0000-000000000000'); // can't set domain for this cookie due to cypress adding a . in front and causes another tracking id to be created
    cy.visit('https://dev.policyme.com/blog/more-canadians-are-considering-life-insurance-since-covid-19-began/?utm_source=seo&utm_campaign=cypress&sid=123', { failOnStatusCode: false });
    cy.wait('@initUTM').then(async (xhr) => {
      const response = await new Response(xhr.responseBody).text();
      const jsonResponse = JSON.parse(response);
      expect(jsonResponse.data.utm_tracking_id).to.exist;
      expect(jsonResponse.data.utm_tracking_id).to.not.equal('00000000-0000-4000-0000-000000000000'); // tracking should change
      cy.getCookie('utm_global_id').should('have.property', 'value', '00000000-0000-4000-0000-000000000000');
      cy.getCookie('utm_tracking_id').should('have.property', 'value', jsonResponse.data.utm_tracking_id);
      // jsonResponse is real json response
      // This solution came from https://stackoverflow.com/questions/59317761/cypress-response-body-as-blob-instead-of-json-but-json-in-chrome-devtools
    });
  });
});

describe('utm cookie logic on life site', () => {
  it('maintains cookies going through questions', () => {
    cy.on('window:before:load', win => {
      win.fetch = null; // eslint-disable-line no-param-reassign
    });
    
    cy.intercept('POST', 'https://dev.policyme.com/api/life-main/v3/utm').as('initUTM');
    cy.visit(`${Cypress.env('baseURL')}/life?utm_source=seo&utm_campaign=cypress&sid=123`);
    cy.getCookie('utm_source').should('have.property', 'value', 'seo');
    cy.getCookie('utm_campaign').should('have.property', 'value', 'cypress');
    cy.getCookie('utm_extras').should('have.property', 'value', '{%22sid%22:%22123%22}');
    cy.wait('@initUTM').then(async (xhr) => {
      const response = await new Response(xhr.responseBody).text();
      const jsonResponse = JSON.parse(response);
      cy.intercept('PATCH', `https://dev.policyme.com/api/life-main/v3/utm/${jsonResponse.data.utm_global_id}/tracking/${jsonResponse.data.utm_tracking_id}`).as('utmPATCH');
      expect(jsonResponse.data.utm_global_id).to.exist;
      expect(jsonResponse.data.utm_tracking_id).to.exist;
      cy.getCookie('utm_global_id').should('have.property', 'value', jsonResponse.data.utm_global_id);
      cy.getCookie('utm_tracking_id').should('have.property', 'value', jsonResponse.data.utm_tracking_id);
      // jsonResponse is real json response
      // This solution came from https://stackoverflow.com/questions/59317761/cypress-response-body-as-blob-instead-of-json-but-json-in-chrome-devtools
    });
    cy.get('[data-cy=triage-novice]')
      .click();
    cy.wait('@utmPATCH'); // waits until it makes a call to appropriate utm PATCH request
    // intro
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@utmPATCH'); // waits until it makes a call to appropriate utm PATCH request
  });
  it('updates any previously set cookies after landing on new page', () => {
    cy.on('window:before:load', win => {
      win.fetch = null; // eslint-disable-line no-param-reassign
    });
    
    cy.intercept('POST', 'https://dev.policyme.com/api/life-main/v3/utm/00000000-0000-4000-0000-000000000000/tracking').as('initUTM');
    cy.setCookie('utm_source', 'direct');
    cy.setCookie('utm_campaign', 'facebook');
    cy.setCookie('utm_extras', '{%22sid%22:%22123%22}');
    cy.setCookie('utm_global_id', '00000000-0000-4000-0000-000000000000', { domain: Cypress.env('domain') });
    cy.setCookie('utm_tracking_id', '00000000-0000-4000-0000-000000000000', { domain: Cypress.env('domain') }); // no problem with adding domain as localhost doesn't get a . added
    cy.visit(`${Cypress.env('baseURL')}/life?utm_source=seo&utm_campaign=cypress&sid=123`);
    cy.wait('@initUTM').then(async (xhr) => {
      const response = await new Response(xhr.responseBody).text();
      const jsonResponse = JSON.parse(response);
      expect(jsonResponse.data.utm_tracking_id).to.exist;
      expect(jsonResponse.data.utm_tracking_id).to.not.equal('00000000-0000-4000-0000-000000000000'); // tracking should change
      cy.getCookie('utm_global_id').should('have.property', 'value', '00000000-0000-4000-0000-000000000000');
      cy.getCookie('utm_tracking_id').should('have.property', 'value', jsonResponse.data.utm_tracking_id);
      // jsonResponse is real json response
      // This solution came from https://stackoverflow.com/questions/59317761/cypress-response-body-as-blob-instead-of-json-but-json-in-chrome-devtools
    });
    cy.getCookie('utm_source').should('have.property', 'value', 'seo');
    cy.getCookie('utm_campaign').should('have.property', 'value', 'cypress');
    cy.getCookie('utm_extras').should('have.property', 'value');
  });
});
