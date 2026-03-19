import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('Environment test', () => {
  /**
     * @fileoverview Tests making sure state injection only works in lower envrionment.
     *
     * @testcase Beneficiary short journey
     * - Verifies that:
     *  prod
     *  dev
     */

  it('Cannot bypass url - dev', () => {
    cy.visit((`https://dev.policyme.com/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        win.__PRELOADED_STATE__ = state;
      },
    });
    cy.window()
      .should('not.have.property', '__store__');
  });

  it('Cannot bypass url - prod', () => {
    cy.visit((`https://policyme.com/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        win.__PRELOADED_STATE__ = state;
      },
    });
    cy.window()
      .should('not.have.property', '__store__');
  });
});
