import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('AddressBlockers', () => {
/**
 * @fileoverview Tests for the AddressBlockers application.
 *
 * @description
 * This test suite verifies the behavior of the AddressBlockers
 * based on province that is selected by the user on the
 * address pages
 */

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it('Mismatched Provinces AB -> QC', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
        
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'Quebec');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy=CloseModalButton]:visible').click();
        cy.DesignSystemClickInSelect('addressProvince', 'Alberta');
        cy.get('[data-cy=address-submit]')
          .last()
          .click({ force: true });
      });
  });

  it('Mismatched Provinces AB -> BC, primaryCTA perseveres original province AB', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'British Columbia');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy="update-province-and-continue"]').click().then(() => {
          const state = store.getState();
          expect(state.primary.household.province).to.equal('AB');
        });
        cy.get('[data-cy=address-submit]')
          .last()
          .click({ force: true });
        cy.root().should('not.contain.html', 'Heads up! Looks like there’s a province mismatch');
      });
  });

  it('Mismatched Provinces AB -> BC, secondaryCTA redirects back with province AB populated', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'British Columbia');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy="go-back-to-edit"]').click().then(() => {
          // back to quotes page
          cy.contains('Who would you like to get coverage for?');
          const state = store.getState();
          expect(state.metadata.isforceRedoStartApp).to.equal(true);
          expect(state.primary.household.province).to.equal('AB');
          cy.get('[value="Alberta"]').should('exist');
        });
      });
  });

  it('Updating address via autocomplete should not impact initial province', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.ClearAndType('Address', 'UBC');
        cy.get('[class="pac-item"]').eq(1).click();
        cy.DesignSystemClickInSelect('addressProvince', 'Alberta');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.root().should('not.contain.html', 'Heads up! Looks like there’s a province mismatch').then(() => {
          const state = store.getState();
          expect(state.primary.household.province).to.equal('AB');
        });
      });
  });

  it('Mismatched Provinces QC -> AB', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_QUEBEC_HOUSEHOLD);
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'Alberta');
        cy.get('[data-cy=address-submit]').last().click();
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy=CloseModalButton]:visible').click();
        cy.DesignSystemClickInSelect('addressProvince', 'Quebec');
        cy.get('[data-cy=address-submit]').last().click();
        cy.contains('Living in Quebec? Get a recommendation to continue your application');
      });
  });

  it('Mismatched Provinces QC -> QC Needs assessment incomplete', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_QUEBEC_HOUSEHOLD);
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.get('[data-cy=address-submit]').last().click();
        cy.contains('Living in Quebec? Get a recommendation to continue your application');
      });
  });

  it('Mismatched Provinces QC -> QC Needs assessment complete', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_QUEBEC_HOUSEHOLD);
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
          type: '@@primary/life/session/update',
          property: 'recmd_cov_amt',
          value: 500000,
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.get('[data-cy=address-submit]').last().click();
        cy.root().should('not.contain.html', 'Living in Quebec? Get a recommendation to continue your application');
      });
  });
});

describe('AddressBlocker partial e2e', () => {
/**
 * @fileoverview Tests for the address blocker and redirection side effects.
 *
 * @description
 * This test suite verifies the behaviour of the AddressBlockers
 * when user gets redirected to quote page
 * they will need to go through the same process
 * Make sure we are able to go to quotes -> startapp -> full address flow
 */
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.intercept('GET', '**/in_progress_policy/**', {
      statusCode: 200,
      body: { data:
        { policy_id: null } },
    });
    cy.intercept('PATCH', '*', {
      statusCode: 200,
      body: {},
    }).as('mockPatch');
    cy.intercept('POST', '**/discounts', {
      statusCode: 200,
      body: {},
    });
    cy.intercept('POST', '**/life_apps', {
      statusCode: 200,
      body: {
        data: {
          app_id: 'f849ace8-4ee6-447b-8601-ad75b2e5ff92',
        },
      },
    });
    cy.intercept('POST', '**/ci_apps', {
      statusCode: 200,
      body: {
        data: {
          app_id: 'f849ace9-4ee6-447b-8601-ad75b2e5ff92',
        },
      },
    });
    cy.intercept('PATCH', '/api/global-main/v1/household_infos/*/0', {
      statusCode: 200,
      body: { success: true },
    }).as('patch');
    cy.intercept('POST', '/api/global-main/v1/add_to_family/*', {
      statusCode: 200,
      body: { success: true },
    }).as('postAddToFamily');
    cy.intercept('POST', '/api/global-main/v1/applications/*/link/cross_sell', {
      statusCode: 200,
      body: { success: true },
    }).as('postLinkCrossSell');
    cy.intercept('POST', '/api/global-main/v1/applications/*/link/joint', {
      statusCode: 200,
      body: { success: true },
    }).as('postLinkJoint');
    cy.intercept('POST', '/api/ci-main/v1/ci_sessions/*', {
      statusCode: 200,
      body: {},
    }).as('postCiSession');
    cy.intercept('POST', '/api/life-main/*/life_sessions/*', {
      statusCode: 200,
      body: {},
    }).as('postLifeSession');
    cy.intercept('POST', '/api/life-main/*/life_apps/session/**', {
      statusCode: 200,
      body: {
        data: {
          app_id: 'f849ace8-4ee6-447b-8601-ad75b2e5ff92',
        },
      },
    }).as('postLifeApp');
    cy.intercept('POST', '/api/ci-main/*/ci_apps/session/**', {
      statusCode: 200,
      body: {
        data: {
          app_id: 'f849ace8-4ee6-447b-8601-ad75b2e5ff92',
        },
      },
    }).as('postLifeApp');
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
    cy.intercept('GET', '**/journey', {
      statusCode: 200,
      body: { data: {
        ab_test_band: 'test_5',
        controlling_user: 'primary',
        deal_link_product_type: 'term_life',
        dependents: [],
        primary: {
          email: 'michelle.huang+trest9081@policyme.com',
          health_dental: {},
          healthcard_province: null,
          hh_info_id: '773aba4e-5469-407c-8931-cb3d19aa6a55',
          joint_role: 0,
          phone: null,
          postal_code: null,
          province: 'BC',
          standard_ci: {
            insurance_ownership_type: 'individual',
            session_id: '55fc6b9a-ec14-44ba-8411-f556dd95716e',
          },
          term_life: {
            application_id: '7a322d5c-2477-4696-b85d-96d9f1c1bd93',
            buying_method: 'Stand-alone',
            coverage_amount: 500000,
            digital_consent_status: null,
            discount_codes: [],
            discounts: [],
            error_flag: null,
            exclusions: [],
            exclusions_flag: false,
            family_id: '0f6490c0-416f-4b02-b6e9-0e232c3c6c92',
            helcim_customer_code: null,
            id_verification_completed: false,
            insurance_ownership_type: 'individual',
            life_policies_beneficiaries: null,
            monthly_premium: null,
            product_added: true,
            quote_breakdown: {},
            recommended_coverage_amount: null,
            risks: null,
            session_id: '55fc6b9a-ec14-44ba-8411-f556dd95716d',
            smoking_discrepancy_flag: null,
            term_length: 30,
            tobacco_rating_flag: null,
            underwriting_method: 'fully_underwritten',
            uw_flat_extra_debits: null,
            uw_total_debits: null,
          },
          user_birthdate: '01/01/1997',
          user_birthday: '01',
          user_birthmonth: '01',
          user_birthyear: '1997',
          user_family_composition: null,
          user_first_name: 'Michelle',
          user_gender: 'Female',
          user_id: 53121,
          user_last_name: 'Huang',
          user_smoker: false,
        },
        secondary: {
          email: 'michelle.huang+trest9081@policyme.com',
          health_dental: {},
          healthcard_province: null,
          hh_info_id: '773aba4e-5469-407c-8931-cb3d19aa6a55',
          joint_role: 0,
          phone: null,
          postal_code: null,
          province: 'BC',
          standard_ci: {
            insurance_ownership_type: 'individual',
            session_id: '55fc6b9a-ec14-44ba-8411-f556dd95d16d',
          },
          term_life: {
            application_id: '7a322d5c-2477-4696-b85d-96d9f1c1bd93',
            buying_method: 'Stand-alone',
            coverage_amount: 500000,
            digital_consent_status: null,
            discount_codes: [],
            discounts: [],
            error_flag: null,
            exclusions: [],
            exclusions_flag: false,
            family_id: '0f6490c0-416f-4b02-b6e9-0e232c3c6c92',
            helcim_customer_code: null,
            id_verification_completed: false,
            insurance_ownership_type: 'individual',
            life_policies_beneficiaries: null,
            monthly_premium: null,
            product_added: true,
            quote_breakdown: {},
            recommended_coverage_amount: null,
            risks: null,
            session_id: '55fc6b9a-ec14-44ba-8411-f556dd95716d',
            smoking_discrepancy_flag: null,
            term_length: 30,
            tobacco_rating_flag: null,
            underwriting_method: 'fully_underwritten',
            uw_flat_extra_debits: null,
            uw_total_debits: null,
          },
          user_birthdate: '01/01/1997',
          user_birthday: '01',
          user_birthmonth: '01',
          user_birthyear: '1997',
          user_family_composition: null,
          user_first_name: 'Michelle',
          user_gender: 'Female',
          user_id: 53121,
          user_last_name: 'Huang',
          user_smoker: false,
        },
      } },
    });
  });

  it('Individual flow', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
          type: '@@primary/session/update_ci_session',
          value: { session_id: 'randomstring' },
        });
        store.dispatch({
          type: '@@primary/session/update_life_session',
          value: { session_id: 'randomstringlife' },
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
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'Quebec');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy="go-back-to-edit"]').click().then(() => {
          // back to quotes page
          cy.contains('Who would you like to get coverage for?');
          const state = store.getState();
          expect(state.metadata.isforceRedoStartApp).to.equal(true);
          expect(state.primary.household.province).to.equal('AB');
          cy.get('[value="Alberta"]').should('exist');
        });
        // land on quotes-continued page
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Let’s personalize your life insurance');
        // land on start app
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Ready to start your application?');
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Where do you live').then(() => {
          const state = store.getState();
          expect(state.metadata.isforceRedoStartApp).to.equal(false);
        });
      });
  });

  it('Joint flow', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/primary/full-address`), {
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
          type: '@@primary/session/update_ci_session',
          value: { session_id: 'randomstring' },
        });
        store.dispatch({
          type: '@@secondary/session/update_ci_session',
          value: { session_id: 'randomstring_sec' },
        });
        store.dispatch({
          type: '@@primary/session/update_life_session',
          value: { session_id: 'randomstringlife' },
        });
        store.dispatch({
          type: '@@secondary/session/update_life_session',
          value: { session_id: 'randomstringlife_sec' },
        });
        // need the below to set the state for journey
        // so it can find the correct next page
        store.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: {
            location: {
              pathname: '/application/primary/full-address',
              search: '',
              hash: '',
              key: 'vspn0m',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        cy.DesignSystemClickInSelect('addressProvince', 'Quebec');
        cy.get('[data-cy=address-submit]:visible').click({ force: true });
        cy.contains('Heads up! Looks like there’s a province mismatch');
        cy.get('[data-cy="go-back-to-edit"]').click().then(() => {
          // back to quotes page
          cy.contains('Who would you like to get coverage for?');
          const state = store.getState();
          expect(state.metadata.isforceRedoStartApp).to.equal(true);
          expect(state.primary.household.province).to.equal('AB');
          cy.get('[value="Alberta"]').should('exist');
        });
        cy.get('[data-cy="quotesCompareInputsAddPartnerBtn"]').click();
        cy.get('[data-cy="secondary_userGender-Female"]').click();
        // land on quotes-continued page
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Let’s personalize your life insurance');
        // land on start app
        cy.get('[data-cy="submit"]:visible').click().then(() => {
          const state = store.getState();
          expect(
            Boolean(state.secondary.lifeSession.override_amt),
          ).to.not.equal(false);
          expect(
            Boolean(state.secondary.lifeSession.term)
            || Boolean(state.secondary.lifeSession.selected_term),
          ).to.not.equal(false);
        });
        cy.contains('Ready to start your application?');
        cy.contains('Your Partner’s Details');
        cy.get('[data-cy="submit"]:visible').click();
        cy.contains('Where do you live');
        cy.ClearAndType('Address', 'SFU');
        cy.get('[class="pac-item"]').eq(1).click({ force: true });
        cy.wait(500);
        cy.get('[data-cy="address-submit"]:visible').click();
        cy.contains('both live at the same address?');
      });
  });
});
