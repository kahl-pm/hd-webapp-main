import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('Validate the coverage amounts', () => {
/**
 * @fileoverview Tests for the coverage amount being correct based
 * on user age
 *
 */

  beforeEach(() => {
    cy.intercept('POST', '**/api/global-payments/v1/user/*/customer', {
      cache: false,
      statusCode: 200,
      body: {
        data: {
          stripe_customer_id: 'cus_111111111',
        },
      },
    }).as('createCustomer');
    cy.intercept('POST', '**/api/global-payments/v1/user/*/customer/*/setup-intent', {
      cache: false,
      statusCode: 200,
      body: {
        data: {
          setup_intent_client_secret: 'seti_aaaaa_secret_bbbb',
        },
      },
    }).as('setupIntent');
  });

  it('Individual over 51 Quotes', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
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
              pathname: '/life/life-insurance-quotes-continued',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.wait(1000);
        cy.get('[data-index="0"]').contains('$50,000');
      });
  });

  it('Individual under 51 Quotes', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
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
          value: '01/01/2005',
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/life/life-insurance-quotes-continued',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.wait(1000);
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });

  it('Joint over 51 Quotes', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
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
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/1960',
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/life/life-insurance-quotes-continued',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.wait(1000);
        cy.get('[data-index="0"]').contains('$50,000');
      });
  });

  it('Joint under 51 Quotes', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
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
          value: '01/01/2005',
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/2005',
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/life/life-insurance-quotes-continued',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.wait(1000);
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });

  it('Joint mixed 51 Quotes', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
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
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/2005',
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/life/life-insurance-quotes-continued',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.wait(1000);
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });

  it('Individual over 51 Checkout', () => {
    const url = `${Cypress.env('baseURL')}/life/digital-consent`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
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
        cy.wait(1000);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('[data-index="0"]').contains('$50,000');
      });
  });

  it('Individual under 51 Checkout', () => {
    const url = `${Cypress.env('baseURL')}/life/digital-consent`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
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
          value: '01/01/2005',
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
        cy.wait(1000);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });

  it('Joint over 51 Checkout', () => {
    const url = `${Cypress.env('baseURL')}/life/digital-consent`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED);
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
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
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
        cy.wait(1000);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('[data-index="0"]').contains('$50,000');
      });
  });

  it('Joint under 51 Checkout', () => {
    const url = `${Cypress.env('baseURL')}/life/digital-consent`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED);
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
          value: '01/01/2005',
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/2005',
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
        cy.wait(1000);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });

  it('Joint mixed 51 Checkout', () => {
    const url = `${Cypress.env('baseURL')}/life/digital-consent`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_LOWER_SENIOR_COVERAGE, true);
    cy.visit(url, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED);
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
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: '01/01/2005',
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
        cy.wait(1000);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.get('[data-index="0"]').contains('$100,000');
      });
  });
});
