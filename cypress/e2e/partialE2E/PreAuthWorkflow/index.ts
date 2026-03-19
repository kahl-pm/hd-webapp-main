import Cookies from 'js-cookie';
import { PROVINCES } from '../../../../src/utils/const';

describe('Pre Auth Workflow', () => {
  it('Should receive 401 before authenticated', () => {
    let appId: string;

    // Set up intercept BEFORE any actions that might trigger it
    cy.intercept('POST', '/api/life-main/v3/life_apps/session/**').as('postLifeApp');
    cy.intercept('POST', '/api/global-accounts/v1/users').as('postUser');
    cy.intercept('POST', '/api/global-accounts/v1/email', (req) => {
      const headers = {
        ...(req.headers || {}),
        'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
      };
      // eslint-disable-next-line no-param-reassign
      req.headers = headers;
    }).as('sendEmail');
    cy.intercept('POST', '/api/global-accounts/v1/auth0/email', (req) => {
      const headers = {
        ...(req.headers || {}),
        'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
      };
      // eslint-disable-next-line no-param-reassign
      req.headers = headers;
    }).as('sendAuth0Email');
    cy.intercept('POST', '/api/global-accounts/v1/email_link/**/validate', (req) => {
      const headers = {
        ...(req.headers || {}),
        'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
      };
      // eslint-disable-next-line no-param-reassign
      req.headers = headers;
    }).as('validateEmailLink');

    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    cy.visit(`${Cypress.env('baseURL')}/life/life/intent`);
    cy.get(`[data-cy="user-intent-Mortgage"]`).click({ force: true });
    cy.get('[data-cy=submit]:visible').click();
    cy.contains('Who would you like to get coverage for?');
    cy.QuotesInputPrimary('1 Jan 1997', 'Female', true, PROVINCES.AB, 'primary');
    cy.wait(1000);
    cy.get('[data-cy=submit]:visible').click({ force: true });
    cy.contains('Let’s personalize your life insurance');
    cy.wait(1000);
    cy.get('[data-cy=submit]:visible').click({ force: true });
    cy.contains('Ready to start your application?');
    Cookies.remove('OptanonConsent');
    cy.get('[data-cy=firstName]').click({ scrollBehavior: 'center', force: true });
    cy.get('[data-cy=firstName]').type('{selectall}{backspace}John', { scrollBehavior: 'center', force: true });
    cy.get('[data-cy=lastName]').click({ scrollBehavior: 'center', force: true });
    cy.get('[data-cy=lastName]').type('{selectall}{backspace}Doe', { scrollBehavior: 'center', force: true });
    cy.get('[data-cy=email]').click({ scrollBehavior: 'center', force: true });
    cy.get('[data-cy=email]').type('{selectall}{backspace}michelle.huang@policyme.com', { scrollBehavior: 'center', force: true });
    cy.get('[data-cy=submit]:visible').click();

    // When we called the POST /user endpoint, we created a pre-auth session
    cy.get('@postLifeApp').its('response.body').then((body) => {
      appId = body.data.app_id;
      // postLifeApp is a pre-auth endpoint, so we should get a 200 back with the appId
      // then immediately call the journey endpoint, which does not support pre-auth,
      // hence we should get a 401 back
      cy.then(() => {
        cy.request({
          method: 'GET',
          url: `/api/global-main/v1/policy/${appId}/journey`,
          failOnStatusCode: false,
        }).its('status').should('eq', 401);
        // we are not authenticated, so we should get a 401
      });
    });
    // at this point, we got through magic link, meaning our token should no longer be pre-auth
    // and we should be authenticated, so we expect to get a 200 back
    cy.contains('Where do you live', { timeout: 12000 }).should('be.visible').then((body) => {
      cy.request({
        method: 'GET',
        url: `/api/global-main/v1/policy/${appId}/journey`,
      }).its('status').should('eq', 200);
    });
    cy.visit(`${Cypress.env('baseURL')}/life/life/intent`);
    cy.get(`[data-cy="user-intent-Mortgage"]`).click({ force: true });
    cy.get('[data-cy=submit]:visible').click();
    cy.contains('Who would you like to get coverage for?');
    cy.QuotesInputPrimary('1 Jan 1997', 'Female', true, PROVINCES.AB, 'primary');
    cy.wait(1000);
    cy.get('[data-cy=submit]:visible').click({ force: true });
    cy.contains('Let’s personalize your life insurance');
    cy.wait(1000);
    cy.get('[data-cy=submit]:visible').click({ force: true });
    cy.contains('Ready to start your application?');
    Cookies.remove('OptanonConsent');
    cy.get('[data-cy=firstName]').click({ scrollBehavior: 'center', force: true });
    cy.get('[data-cy=firstName]').type('{selectall}{backspace}John', { scrollBehavior: 'center', force: true });
    cy.get('[data-cy=lastName]').click({ scrollBehavior: 'center', force: true });
    cy.get('[data-cy=lastName]').type('{selectall}{backspace}Doe', { scrollBehavior: 'center', force: true });
    cy.get('[data-cy=submit]:visible').click();
    cy.get('@postUser.all').should('have.length', 1); // create user is only called once at the beginning on first start-app
  });
});
