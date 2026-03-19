import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('Browser Forward short journey', () => {
/**
 * @fileoverview Tests for the browser forward being disabled on back
 *
 * @description
 * This test suite verifies the behavior of the browser forward button
 *
 * @testcase Browser Forward journey
 * - Verifies that:
 *  - The browser forward button is disabled when user go back in the flow
 */

  it('Browser Forward Disable on back', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/contact`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        win.__PRELOADED_STATE__ = state;
      },
    });
    cy.intercept('PUT', '/api/global-accounts/v1/user/*/consent', {
      statusCode: 200,
      body: {},
    }).as('putConsent');
    cy.intercept('PATCH', '/api/global-main/v1/household_infos/*/0', {
      statusCode: 200,
      body: { success: true },
    }).as('patch');

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        store.dispatch({
          type: '@@primary/lifePolicy/update',
          property: 'policy_document_signature_completed',
          value: false,
        });
        store.dispatch({
          type: '@@primary/session/update',
          property: 'is_logged_in',
          value: true,
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/contact',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        // submit cell phone page
        cy.contains('What is your cell phone number?');
        cy.get('[type="submit"]:visible').click();
        cy.contains('Where were you born?');
        // go back to previous page
        cy.go('back');
        cy.contains('What is your cell phone number?');
        // check if the forward button is disabled
        cy.go('forward');
        cy.contains('What is your cell phone number?');
        // go forward by submitting the page
        cy.get('[type="submit"]:visible').click();
        cy.contains('Where were you born?');
      });
  });
});
