import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

const BCL_TENANT_ID = 'e9a52c54-1afa-4597-a343-4b44b1851c70';

describe('Beneficiary short journey', () => {
/**
 * @fileoverview Tests for the beneficiary short journey in the life application.
 *
 * @description
 * This test suite verifies the behavior of the primary and secondary
 * beneficiary forms in the life application flow. It includes checks
 * for state manipulation, form submission, and UI interactions.
 *
 * @testcase Beneficiary short journey
 * - Verifies that:
 *  no trustee page, next question after trustee page
    go back
    select choose now
    choose beneficiaries with no minors
    // no trustee page
    go back and edit beneficiaries to choose some minors
    // see trustee page
    yes for trustee
    // give trustee information
    check state is updated for all minor beneficiaries
    // go back to trustee question, select no
    // check that state for trustee information is wiped
 */

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    // Add wait to ensure clean state between tests
    cy.wait(1000);
  });

  it('Beneficiaries', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        // Fix linter error by using proper assignment
        Object.assign(win, { __PRELOADED_STATE__: state });
      },
    });

    // Wait for page to fully load and journey to be determined
    cy.wait(2000);

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        // Wait for store to be fully initialized
        cy.wait(1000);
        
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
              pathname: '/application/common-primary-beneficiaries',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        
        // Wait for router state to be updated
        cy.wait(1000);
        
        cy.get('[data-cy="common-primary-beneficiaries-later"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          const state = store.getState();
          expect(state.primary.beneficiary.beneficiaries_estate_flag).to.equal('Y');
          cy.contains('Please let us know where you first heard about us.');
        });
        cy.get('[name="back"]:visible').click();
        cy.get('[data-cy="common-primary-beneficiaries-now"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          const state = store.getState();
          expect(state.primary.beneficiary.beneficiaries_estate_flag).to.equal('N');
          cy.contains('Who would you like to name as your primary beneficiaries?');
          // add a non-minor primary beneficiary
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="beneficiaryName-primary-0"]').type('primary aaa');
          cy.get('[data-cy="is-minor-0-false"]').click();
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click();
          cy.get('[data-cy="commonSecondaryBeneficiaries-false"]').click();
          // after choosing no on secondary beneficiaires
          // we validate no beneficiaires should have minor or trustee
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.filter(b => b.is_minor).length).to.equal(0);
            expect(beneficiaries.filter(b => b.trustee_name).length).to.equal(0);
          });
          // land on referrer wihout trustee page
          cy.contains('Please let us know where you first heard about us.');
          // back to common secondary beneficiaries
          cy.go('back');
          // back to primary beneficiaries
          cy.go('back');
          cy.go('back');

          // add a minor to primary beneficiaries
          cy.get('[data-cy="addBeneficiary-primary"]').click();
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-primary-1`, 'Child', { force: true });
          cy.get('[data-cy="beneficiaryName-primary-1"]').type('primary bbb');
          cy.get('[data-cy="is-minor-1-true"]').click();
          cy.get('[data-cy="beneficiaryPercent-primary-0"]').clear();
          cy.get('[data-cy="beneficiaryPercent-primary-0"]').type('50');
          cy.get('[data-cy="beneficiaryPercent-primary-1"]').type('50');
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click();

          // add a minor to secondary beneficiaries
          cy.get('[data-cy="commonSecondaryBeneficiaries-true"]').click();
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click();
          cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="secondaryBeneficiaryName-primary-0"]').type('secondary aaa');
          cy.get('[data-cy="is-minor-0-true"]').click();
          cy.get('[data-cy="submit"]:visible').click();
          // add a trustee
          if (Cypress.env('tenantId') === BCL_TENANT_ID) {
            cy.get('[data-cy="trustee-name"]').type('Trustee Smith');
          }
          // check states
          cy.get('[type="submit"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.length).to.equal(3);
            expect(beneficiaries.filter(b => b.is_minor).length).to.equal(2);
            if (Cypress.env('tenantId') === BCL_TENANT_ID) {
              expect(beneficiaries.filter(b => b.trustee_name === 'Trustee Smith').length).to.equal(2);
            }
          });
          // go back to trustee, wipe it and make sure it affects all beneficiaries
          if (Cypress.env('tenantId') === BCL_TENANT_ID) {
            cy.go('back');
            cy.get('[name="skip-trustee"]').click();
            cy.get('[name="confirm-skip-trustee"]').click().then(() => {
              const beneficiaries =
                Object.values(store.getState().primary.beneficiary.beneficiaries);
              expect(beneficiaries.length).to.equal(3);
              expect(beneficiaries.filter(b => b.is_minor).length).to.equal(2);
              expect(beneficiaries.filter(b => b.trustee_name).length).to.equal(0);
            });
          }
          // land on referrer
          cy.contains('Please let us know where you first heard about us.');
        });
      });
  });

  it('Beneficiaries - test form validation', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        // Fix linter error by using proper assignment
        Object.assign(win, { __PRELOADED_STATE__: state });
      },
    });

    // Wait for page to fully load and journey to be determined
    cy.wait(2000);

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        // Wait for store to be fully initialized
        cy.wait(1000);
        
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
              pathname: '/application/common-primary-beneficiaries',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        
        // Wait for router state to be updated
        cy.wait(1000);
        
        cy.get('[data-cy="common-primary-beneficiaries-now"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          cy.contains('Who would you like to name as your primary beneficiaries?');
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click().then(() => {
          });
          // stay on the same page until next correct submission
          cy.contains('Select one of the options');
          cy.wait(500);
          cy.contains('Who would you like to name as your primary beneficiaries');

          cy.get('[data-cy="beneficiaryName-primary-0"]').type('primary aaa');
          cy.get('[data-cy="is-minor-0-false"]').click();
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click();
          cy.wait(500);
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click();
          cy.wait(500);
          cy.contains('Select one of the options');
          cy.contains('Would you like to name any secondary beneficiaries?');
          // stay on the same page until next correct submission
          cy.get('[data-cy="commonSecondaryBeneficiaries-true"]').click();

          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click();
          cy.get('[data-cy="submit"]:visible').click();
          cy.wait(500);
          cy.contains('Select a relationship');
          cy.contains('Enter a name');
          cy.contains('Select one of the options');
          cy.contains('Would you like to name any secondary beneficiaries?');
          cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="secondaryBeneficiaryName-primary-0"]').type('secondary aaa');
          cy.get('[data-cy="is-minor-0-false"]').click();
          cy.get('[data-cy="submit"]:visible').click();
          // move on to the next page
          cy.contains('Please let us know where you first heard about us.');
        });
      });
  });

  it('Beneficiaries Quebec', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_QUEBEC);
        // Fix linter error by using proper assignment
        Object.assign(win, { __PRELOADED_STATE__: state });
      },
    });

    // Wait for page to fully load and journey to be determined
    cy.wait(2000);

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        // Wait for store to be fully initialized
        cy.wait(1000);
        
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
              pathname: '/application/common-primary-beneficiaries',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        
        // Wait for router state to be updated
        cy.wait(1000);
        
        cy.get('[data-cy="common-primary-beneficiaries-now"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          const state = store.getState();
          expect(state.primary.beneficiary.beneficiaries_estate_flag).to.equal('N');
          cy.contains('Who would you like to name as your primary beneficiaries?');
          // add a non-minor primary beneficiary
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="beneficiaryName-primary-0"]').type('primary aaa');
          cy.get('[data-cy="is-minor-0-true"]').click();
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click();
          cy.get('[data-cy="submit"]:visible').click();
          cy.get('[data-cy="commonSecondaryBeneficiaries-false"]').click();
          // after choosing no on secondary beneficiaires
          // we validate no beneficiaires should have minor or trustee
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.filter(b => b.is_minor).length).to.equal(1);
            expect(beneficiaries.filter(b => b.trustee_name).length).to.equal(0);
          });
          // land on referrer wihout trustee page
          cy.contains('Please let us know where you first heard about us.');
        });
      });
  });
});

describe('Joint - Beneficiary short journey', () => {
  /**
   * @fileoverview Tests for the beneficiary short journey in the life application.
   *
   * @description
   * This test suite verifies the behavior of the primary and secondary
   * beneficiary forms in the life application flow for joint app.
   *
   * @testcase Beneficiary short journey
   * - Verifies that:
   *  setting estate skips for both primary and secondary
   *  going back allows resetting beneificiaries
   *  no minor => no trustee question
   *  add minor to both users, make sure we land on both trustees (different names)
   *  fill in information for trustees for each
   *  new minors should have names updated accordingly
   *  test if selecting same partner would have the same beneficiary in both places
   *  wipe each of them and make sure no secondary beneficiary exists for the one wiped
   *  go back to Common Secondary Page and select none,
   *  secondary beneficiary should be included in neither of them
   */

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    // Add wait to ensure clean state between tests
    cy.wait(1000);
  });

  it('Joint Beneficiaries', () => {
    cy.visit((`${Cypress.env('baseURL')}/life/application/common-primary-beneficiaries`), {
      onBeforeLoad: (win) => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
        // Fix linter error by using proper assignment
        Object.assign(win, { __PRELOADED_STATE__: state });
      },
    });

    // Wait for page to fully load and journey to be determined
    cy.wait(2000);

    cy.window()
      .should('have.property', '__store__')
      .then((store) => {
        // Wait for store to be fully initialized
        cy.wait(1000);
        
        store.dispatch({
          type: '@@primary/session/update',
          property: 'life_application_id',
          value: 'aaaaaafjelifjefef',
        });
        store.dispatch({
          type: '@@secondary/session/update',
          property: 'life_application_id',
          value: 'bbbbaaaaaafjelifjefef',
        });
        store.dispatch({
          type: '@@secondary/household/update_household_prop',
          property: 'firstName',
          value: 'another username',
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
              pathname: '/application/common-primary-beneficiaries',
              search: '',
              hash: '',
              key: 'rz76dx',
              query: {},
            },
            action: 'PUSH',
            isFirstRendering: false,
          },
        });
        
        // Wait for router state to be updated
        cy.wait(1000);
        
        cy.get('[data-cy="common-primary-beneficiaries-later"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          const state = store.getState();
          expect(state.primary.beneficiary.beneficiaries_estate_flag).to.equal('Y');
          expect(state.secondary.beneficiary.beneficiaries_estate_flag).to.equal('Y');
          expect(state.primary.beneficiary.beneficiaries_standard_flag).to.equal(undefined);
          expect(state.secondary.beneficiary.beneficiaries_standard_flag).to.equal(undefined);
          cy.contains('Please let us know where you first heard about us.');
        });
        cy.get('[name="back"]:visible').click();
        cy.get('[data-cy="common-primary-beneficiaries-now"]').click();
        cy.get('[data-cy="submit-common-primary-beneficiaries"]:visible').click().then(() => {
          const state = store.getState();
          expect(state.primary.beneficiary.beneficiaries_estate_flag).to.equal('N');
          expect(state.secondary.beneficiary.beneficiaries_estate_flag).to.equal('N');
          cy.contains('Who would you like to name as your primary beneficiaries?');
          // add a non-minor primary beneficiary
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-primary-0`, 'Friend', { force: true });
          cy.get('[data-cy="beneficiaryName-primary-0"]').type('primary aaa');
          cy.get('[data-cy="is-minor-0-false"]').click();
          cy.get('[data-cy="submit-beneficiary-btn"]:visible').click();
          // add a non-minor beneficiary for secondary user
          cy.DesignSystemClickInSelect(`beneficiaryRelationship-secondary-0`, 'Child', { force: true });
          cy.get('[data-cy="beneficiaryName-secondary-0"]').type('secondary aaa');
          cy.get('[data-cy="is-minor-0-false"]').click();
          cy.wait(500);
          cy.get('[type="submit"]:visible').click();

          cy.get('[data-cy="commonSecondaryBeneficiaries-false"]').click();
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click();
          // land on referrer page
          cy.contains('Please let us know where you first heard about us.');
          cy.go('back');
          cy.get('[data-cy="commonSecondaryBeneficiaries-true"]').click();
          cy.get('[data-cy="common-secondary-beneficiary-primary-user"]').click();
          cy.get('[data-cy="common-secondary-beneficiary-secondary-user"]').click();
          cy.wait(500);
          cy.get('[type="submit"]:visible').click();

          cy.get('[data-cy="secondary-user-beneficiary-same-as-partner"]').click();
          // add a minor for both users, should see trustee asked twice
          cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-primary-0`, 'Child', { force: true });
          cy.get('[data-cy="secondaryBeneficiaryName-primary-0"]').type('secondary common');
          cy.get('[data-cy="is-minor-0-true"]').click();
          cy.get('[data-cy="secondaryBeneficiaryPercent-primary-0"]').type('100');
          if (Cypress.env('tenantId') === BCL_TENANT_ID) {
            cy.get('[data-cy="submit"]:visible').click();
            // add trustee for each
            cy.get('[data-cy="trustee-name"]').type('Trustee A');
            cy.get('[type="submit"]:visible').click();
            cy.wait(1000);

            cy.get('[data-cy="trustee-name"]').clear();
            cy.get('[data-cy="trustee-name"]').type('Trustee B');
          }
          cy.wait(500);
          cy.get('[type="submit"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.length).to.equal(2);
            expect(beneficiaries.filter(b => b.is_minor).length).to.equal(1);
            expect(beneficiaries.some(b => b.beneficiary_name === 'secondary common')).to.equal(true);
            if (Cypress.env('tenantId') === BCL_TENANT_ID) {
              expect(beneficiaries.filter(b => b.trustee_name === 'Trustee A').length).to.equal(1);
            }
            const beneficiaries_sec =
              Object.values(store.getState().secondary.beneficiary.beneficiaries);
            expect(beneficiaries_sec.length).to.equal(2);
            expect(beneficiaries_sec.filter(b => b.is_minor).length).to.equal(1);
            expect(beneficiaries.some(b => b.beneficiary_name === 'secondary common')).to.equal(true);
            if (Cypress.env('tenantId') === BCL_TENANT_ID) {
              expect(beneficiaries_sec.filter(b => b.trustee_name === 'Trustee B').length).to.equal(1);
            }
          });

          // go back to common secondary beneficiary page and select partner only
          cy.go('back');
          cy.go('back');
          cy.go('back');
          cy.get('[data-cy="common-secondary-beneficiary-secondary-user"]').click();
          cy.wait(1000);
          cy.get('[type="submit"]:visible').click();
          cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-secondary-0`, 'Child', { force: true });
          cy.get('[data-cy="secondaryBeneficiaryName-secondary-0"]').clear();
          cy.get('[data-cy="secondaryBeneficiaryName-secondary-0"]').type('secondary AAA');
          cy.get('[data-cy="is-minor-0-true"]').click();
          cy.get('[data-cy="secondaryBeneficiaryPercent-secondary-0"]').clear();
          cy.get('[data-cy="secondaryBeneficiaryPercent-secondary-0"]').type('100');
          cy.get('[type="submit"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.filter(b => b.beneficiary_type === 'secondary').length).to.equal(0);
            const beneficiaries_sec =
              Object.values(store.getState().secondary.beneficiary.beneficiaries);
            expect(beneficiaries_sec.filter(b => b.beneficiary_type === 'secondary').length).to.equal(1);
          });

          cy.go('back');
          cy.go('back');
          cy.go('back');
          cy.get('[data-cy="common-secondary-beneficiary-primary-user"]').click();
          cy.wait(1000);
          cy.get('[type="submit"]:visible').click().then(() => {
            cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-primary-0`, 'Child', { force: true });
            cy.get('[data-cy="secondaryBeneficiaryName-primary-0"]').clear();
            cy.get('[data-cy="secondaryBeneficiaryName-primary-0"]').type('secondary BBB');
            cy.get('[data-cy="is-minor-0-true"]').click();
            cy.get('[data-cy="secondaryBeneficiaryPercent-primary-0"]').clear();
            cy.get('[data-cy="secondaryBeneficiaryPercent-primary-0"]').type('100');
            cy.get('[type="submit"]:visible').click().then(() => {
              cy.wait(1000);
              const beneficiaries = Object.values(
                store.getState().primary.beneficiary.beneficiaries,
              );
              expect(beneficiaries.filter(b => b.beneficiary_type === 'secondary').length).to.equal(1);
              const beneficiaries_sec =
                Object.values(store.getState().secondary.beneficiary.beneficiaries);
              expect(beneficiaries_sec.filter(b => b.beneficiary_type === 'secondary').length).to.equal(0);
            });
          });
          cy.go('back');
          cy.go('back');
          cy.go('back');
          cy.get('[data-cy="commonSecondaryBeneficiaries-false"]').click();
          cy.get('[data-cy="submit-common-secondary-benenficiaries"]:visible').click().then(() => {
            const beneficiaries = Object.values(store.getState().primary.beneficiary.beneficiaries);
            expect(beneficiaries.filter(b => b.beneficiary_type === 'secondary').length).to.equal(0);
            const beneficiaries_sec =
                Object.values(store.getState().secondary.beneficiary.beneficiaries);
            expect(beneficiaries_sec.filter(b => b.beneficiary_type === 'secondary').length).to.equal(0);
          });
          // land on referrer page
          cy.contains('Please let us know where you first heard about us.');
        });
      });
  });
});
