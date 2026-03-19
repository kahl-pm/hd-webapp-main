import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { PROVINCES } from '../../../../src/utils/const';
import quotes from '../../../../debug/mock-responses/quotes';

describe('Group short journey', () => {
/**
 * @fileoverview Tests for the group short journey in the life application.
 *
 * @description
 * This test suite covers the group short journey in the life application.
 *
 * @testcase Group short journey
 * - Verifies that start app page behaves appropriately for these conditions:
 *  quebec and group
    quebec and individual
    nonquebec and group
    non quebec and individual
    tenant without config and group
 */

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it('redirects to /dog page when Quebec and group', () => {
    cy.ChangeTenantFlag('/life/life/start-app', TENANT_FLAGS.ENABLE_GROUP_TL, true);

    cy.visit(`${Cypress.env('baseURL')}/life/life/start-app`, {
      onBeforeLoad: (win) => {
        let { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        state.primary.household.province = 'QC';
        state.primary.lifeApp.insurance_ownership_type = 'group';
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.url().should('include', '/dog');
  });

  it('does NOT redirect to /dog page when Quebec and individual', () => {
    cy.ChangeTenantFlag('/life/life/start-app', TENANT_FLAGS.ENABLE_GROUP_TL, true);

    cy.visit(`${Cypress.env('baseURL')}/life/life/start-app`, {
      onBeforeLoad: (win) => {
        let { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        state.primary.household.province = 'QC';
        state.primary.lifeApp.insurance_ownership_type = 'individual';
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.url().should('not.include', '/dog');
  });

  it('redirects to /accounts page when insurance_ownership_type is set to individual even though group is enabled', () => {
    cy.ChangeTenantFlag('/life/life/life-insurance-quotes-continued?province=ON&birthdate=011990&smoker=F&gender=F', TENANT_FLAGS.ENABLE_GROUP_TL, true);
    Cypress.env('PM_ENABLE_GROUP_TL_CI_CAA', '1');

    cy.visit(`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?province=ON&birthdate=011990&smoker=F&gender=F`, {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        win.__PRELOADED_STATE__ = state;
      },
    });
    // we want the user to reapply if they have an old "individual" url when group is enabled
    cy.window().should('have.property', '__store__')
      .then((store) => {
        store.dispatch({
          type: '@@primary/lifeApp/update',
          property: 'insurance_ownership_type',
          value: 'individual',
        });
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
        cy.get('[data-cy="submit"]:visible').click();
        cy.url().then((url) => {
          expect(url.includes('3001') || url.includes('accounts.')).to.be.true;
        });
      });
  });

  it('does NOT redirect to /dog page when group is enabled and province in non-quebec', () => {
    cy.ChangeTenantFlag('/life/life/start-app', TENANT_FLAGS.ENABLE_GROUP_TL, true);

    cy.visit(`${Cypress.env('baseURL')}/life/life/start-app`, {
      onBeforeLoad: (win) => {
        let { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        state.primary.household.province = 'ON';
        state.primary.lifeApp.insurance_ownership_type = 'group';
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.url().should('not.include', '/dog');
  });

  it('redirects to /dog page when tenant does not have group enabled', () => {
    cy.setABTest(false, 'control');
    cy.ChangeTenantFlag('/life/life/start-app', TENANT_FLAGS.ENABLE_GROUP_TL, false);

    cy.visit(`${Cypress.env('baseURL')}/life/life/start-app`, {
      onBeforeLoad: (win) => {
        let { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        state.primary.household.province = 'ON';
        state.primary.lifeApp.insurance_ownership_type = 'group';
        win.__PRELOADED_STATE__ = state;
      },
    });

    cy.url().should('include', '/dog');
  });

  it('Start from quotes page - LIFE & INDIVIDUAL', () => {
    cy.setABTest(false, 'control');
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/family`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/start-app`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    Cypress.env('PM_ENABLE_GROUP_TL_CI_CAA', '1');
    cy.visit((`${Cypress.env('baseURL')}/life/life/family`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.DEFAULT);
        win.__PRELOADED_STATE__ = state;
      },
    });
    cy.intercept('GET', '**/api/life-quotes/v2/**', {
      statusCode: 200,
      body: {
        quotes,
      },
    }).as('getLifeQuotes');
    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        cy.setABTest(false, 'control');
        cy.get(`[data-cy="user-intent-Mortgage"]`).click({ force: true });
        cy.get('[data-cy=submit]:visible').click();
        cy.QuotesInputPrimary('1 Jan 1997', 'Female', true, PROVINCES.AB, 'primary');
        cy.get('[data-cy=submit]:visible').click({ force: true });
        cy.get('[data-cy=submit]:visible').click({ force: true });
        // land on start app and check for insurance_ownership_type
        cy.get('[data-cy=submit]:visible').click({ force: true }).then(() => {
          expect(store.getState().primary.lifeApp.insurance_ownership_type).to.equal('group');
        });
        cy.go('back');
        // change province
        cy.go('back');
        cy.go('back');
        cy.DesignSystemClickInSelect(`primary_addressProvince`, 'Quebec');
        cy.get('[data-cy="submit"]:visible').click().then(() => {
          expect(store.getState().primary.lifeApp.insurance_ownership_type).to.equal('individual');
        });
      });
  });

  it('Start from quotes page - JOINT', () => {
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/family`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    cy.ChangeTenantFlag(`${Cypress.env('baseURL')}/life/life/start-app`, TENANT_FLAGS.ENABLE_GROUP_TL, true);
    Cypress.env('PM_ENABLE_GROUP_TL_CI_CAA', '1');
    cy.intercept('GET', '**/api/life-quotes/v2/**', {
      statusCode: 200,
      body: {
        quotes,
      },
    }).as('getLifeQuotes');
    cy.visit((`${Cypress.env('baseURL')}/life/life/family`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.DEFAULT);
        win.__PRELOADED_STATE__ = state;
      },
    });
    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        cy.setABTest(false, 'control');
        cy.get(`[data-cy="user-intent-Mortgage"]`).click({ force: true });
        cy.wait(1000);
        cy.get('[data-cy=submit]:visible').click();
        cy.QuotesInputPrimary('1 Jan 1997', 'Female', true, PROVINCES.AB, 'primary');
        cy.get('[data-cy="quotesCompareInputsAddPartnerBtn"]').click();
        cy.QuotesInputPrimary('2 Jan 1996', 'Male', false, PROVINCES.AB, 'secondary');
        cy.DesignSystemClickInSelect('secondary_addressProvince', 'Quebec', { force: true });
        cy.DesignSystemClickInSelect('secondary_addressProvince', 'Alberta', { force: true });
        cy.get('[data-cy=submit]:visible').click({ force: true });
        cy.get('[data-cy=submit]:visible').click({ force: true });
        // land on start app and check for insurance_ownership_type
        cy.get('[data-cy=submit]:visible').click({ force: true }).then(() => {
          expect(store.getState().primary.lifeApp.insurance_ownership_type).to.equal('group');
          expect(store.getState().secondary.lifeApp.insurance_ownership_type).to.equal('group');
        });
        cy.go('back');
        cy.go('back');
        cy.go('back');
        cy.DesignSystemClickInSelect(`primary_addressProvince`, 'Quebec');
        cy.DesignSystemClickInSelect(`secondary_addressProvince`, 'Quebec');
        cy.get('[data-cy=submit]:visible').click({ force: true }).then(() => {
          expect(store.getState().primary.lifeApp.insurance_ownership_type).to.equal('individual');
          expect(store.getState().secondary.lifeApp.insurance_ownership_type).to.equal('individual');
        });
      });
  });
});
