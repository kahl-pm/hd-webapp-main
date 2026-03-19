import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('Validate that checkout page coverage slider has correct value', () => {
/**
 * @fileoverview Tests the coverage slider on checkout page
 *
 */

  it('Checkout page coverage slider', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/digital-consent`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        store.dispatch({
          type: '@@primary/lifePolicy/update',
          property: 'policy_document_signature_completed',
          value: false,
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/1960',
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/life/digital-consent',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        const state = store.getState();
        state.primary.lifeDecision.active_maximum_eligible_coverage = 350000;
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('span[style="left: 100%;"]')
          .contains('$350,000')
          .should('be.visible');
      });
  });
});
