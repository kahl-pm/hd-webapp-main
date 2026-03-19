import jsCookie from 'js-cookie';
import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

const [birthdate35, birthdate52, birthdate62, birthdate72] = [25, 52, 62, 72].map(
  age => `01/01/${new Date().getFullYear() - age}`,
);

describe('Make sure CTA show modal depending on age', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it('Individual under 51 Quotes -> No Modal', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        store.dispatch({
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate35,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Ready to start your application?');
      });
  });

  it('Individual above 71 Quotes -> No Modal', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate72,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Individual over 51 but under 60 Quotes -> Show Modal to lower to 750k', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
    cy.visit((url), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        store.dispatch({
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate52,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Looking for a faster approval? Reducing coverage might help');
        cy.get('[data-cy="keep-current-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.not.equal(750000);
        });
        cy.contains('Ready to start your application?');
        cy.go('back');
        cy.get('[data-cy="submit"]:visible').click();
        cy.get('[data-cy="update-ARUW-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.equal(750000);
          cy.get('[data-cy="coverageAmount"]').should('have.text', '$750,000');
        });
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Individual over 61 but under 70 Quotes -> Show Modal to lower to 100k', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate62,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Looking for a faster approval? Reducing coverage might help');
        cy.get('[data-cy="keep-current-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.not.equal(100000);
        });
        cy.contains('Ready to start your application?');
        cy.go('back');
        cy.get('[data-cy="submit"]:visible').click();
        cy.get('[data-cy="update-ARUW-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.equal(100000);
          cy.get('[data-cy="coverageAmount"]').should('have.text', '$100,000');
        });
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Joint with one over 51 but one under -> Show Modal to lower to 750k', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate52,
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate35,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Looking for a faster approval? Reducing coverage might help');
        cy.get('[data-cy="keep-current-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.not.equal(750000);
          expect(state.secondary.lifeSession.override_amt).to.not.equal(750000);
        });
        cy.contains('Ready to start your application?');
        cy.go('back');
        cy.get('[data-cy="submit"]:visible').click();
        cy.get('[data-cy="update-ARUW-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.equal(750000);
          expect(state.secondary.lifeSession.override_amt).to.equal(750000);
          cy.get('[data-cy="coverageAmount"]').should('have.text', '$750,000');
        });
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Joint with one over 61 but one under and above 51 -> Show Modal to lower to 100k', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate62,
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate52,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Looking for a faster approval? Reducing coverage might help');
        cy.get('[data-cy="keep-current-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.not.equal(100000);
          expect(state.secondary.lifeSession.override_amt).to.not.equal(100000);
        });
        cy.contains('Ready to start your application?');
        cy.go('back');
        cy.get('[data-cy="submit"]:visible').click();
        cy.get('[data-cy="update-ARUW-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.equal(100000);
          expect(state.secondary.lifeSession.override_amt).to.equal(100000);
          cy.get('[data-cy="coverageAmount"]').should('have.text', '$100,000');
        });
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Joint with one over 71 but one under and above 51 -> Show Modal to lower to 750k', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate52,
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate72,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Looking for a faster approval? Reducing coverage might help');
        cy.get('[data-cy="keep-current-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.not.equal(750000);
          expect(state.secondary.lifeSession.override_amt).to.not.equal(750000);
        });
        cy.contains('Ready to start your application?');
        cy.go('back');
        cy.get('[data-cy="submit"]:visible').click();
        cy.get('[data-cy="update-ARUW-coverage"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.lifeSession.override_amt).to.equal(750000);
          expect(state.secondary.lifeSession.override_amt).to.equal(750000);
          cy.get('[data-cy="coverageAmount"]').should('have.text', '$750,000');
        });
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Joint with both below 51 -> No modal', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate35,
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate35,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });

  it('Joint with one below 51 and one above 71 -> No modal', () => {
    const url = `${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=1000000`;
    cy.ChangeTenantFlag(url, TENANT_FLAGS.ENABLE_SENIOR_ACCEL_UW_LIMITS, true);
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
          type: '@@metadata/init_ab_test_band',
          data: 'test_3',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/lifeApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@secondary/ciApp/update',
          property: 'underwriting_method',
          value: 'fully_underwritten',
        });
        store.dispatch({
          type: '@@primary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate35,
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'birthdate',
          value: birthdate72,
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
        cy.wait(3000);
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        cy.moveSlider(nativeInputValueSetter, 'amountSlider', 40);
        cy.wait(3000);
        cy.get('[data-cy="submit"]:visible').click();
        cy.wait(3000);
        cy.contains('Ready to start your application?');
      });
  });
});
