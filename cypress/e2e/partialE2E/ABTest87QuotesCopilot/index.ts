import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import moment from 'moment';

/**
 * @fileoverview Tests for AB Test 87: Quotes Copilot Journey
 *
 * @description
 * This test suite covers the Quotes Copilot journey entry point A/B test.
 *
 * Test flow (test_0-4): /life/life/life-insurance-quotes -> /life/life/intent -> questions -> /life/life/start-app
 * Control flow (test_5+, control): /life/life/intent -> /life/life/life-insurance-quotes -> /life/life/life-insurance-quotes-continued -> /life/life/start-app
 */


describe('AB Test 87: Quotes Copilot Journey', () => {
  const TEST_BAND = 'test_0';
  const CONTROL_BAND = 'control';

  beforeEach(() => {
    cy.clearCookies();
    cy.viewport(1920, 1080);
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.intercept('POST', '**/api/global-main/v1/household_infos', {
      statusCode: 201,
      body: {
        data: {
          hh_info_id: 'cae2b8ef-f4d3-4eb1-b2d2-de90312f2792',
          hh_info_id_vers: '0',
        },
        status: 201,
      },
    }).as('householdInfos');
    let lifeSessionCallCount = 0;
    let ciSessionsCallCount = 0;

    cy.intercept('PATCH', '**/api/global-main/v1/household_infos/**', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          data:{"success":1},"status":200,
        },
      });
    }).as('patchHouseholdInfos');

    cy.intercept('POST', '**/api/life-main/v3/life_sessions/*', (req) => {
      lifeSessionCallCount++;
      if (lifeSessionCallCount === 1) {
        req.reply({
          statusCode: 201,
          body: {
            data: {
              session_id: '38323e0c-0baf-4374-a2b0-aaaabbbb',
              session_id_vers: 0,
            },
            status: 201,
          },
        });
      } else {
        req.reply({
          statusCode: 201,
          body: {
            data: {
              session_id: '38323e0c-0baf-4374-a2b0-ccccdddd',
              session_id_vers: 0,
            },
            status: 201,
          },
        });
      }
    }).as('lifeSessions');

    cy.intercept('PATCH', '**/api/life-main/v3/life_sessions/*/0', {
      statusCode: 201,
      body: {
        data: {
          success: 1,
        },
      },
    }).as('lifeQuotes');

    cy.intercept('POST', '**/api/life-main/v3/life_sessions/*/0/expenses', {
      statusCode: 201,
      body: {
        data: {
          "expenses": {
              "categories": {
                  "childcare": 500,
                  "discretionary": 650,
                  "food": 800,
                  "other": [],
                  "residence": 2000,
                  "shopping": 450,
                  "telecom": 150,
                  "transportation": 350,
                  "utilities": 200
              },
              "max": 5500,
              "min": 4500
          },
          "session_id": "3f743429-aa30-40a3-87ea-debbd796959e",
          "session_id_vers": "0"
        },
        status: 201,
      },
    }).as('lifeExpenses');

    cy.intercept('POST', '**/api/life-main/v3/life_sessions/*/0/coverages', {
      statusCode: 200,
      body: {
        data: {
          "addtl": {
              "abroad": null,
              "disability": null,
              "education": null,
              "parents": null
          },
          "cov_type": "SINGLE_KIDS_NO_HOUSING",
          "cover_education": null,
          "cover_housing": null,
          "existing": {
              "spouse": {
                  "group": null,
                  "individual": null
              },
              "user": {
                  "group": null,
                  "individual": null
              }
          },
          "joint_role": null,
          "options": [
              {
                  "amt": 325000,
                  "amt_unrounded": 325000,
                  "extra_fields": {
                      "breakdown": {
                          "debts": 0,
                          "existing_coverage": 0,
                          "kids_education_costs": 0,
                          "kids_expenses": 325000,
                          "non_retirement_savings": 0,
                          "rtrmt_savings_after_tax": 0
                      }
                  },
                  "fullname": "Tuna Fish",
                  "higher_cov_amt": 525000,
                  "id": 1,
                  "lower_cov_amt": 100000,
                  "name": "tunafish",
                  "type": 6
              }
          ],
          "quotes": [],
          "selected_opt": 1,
          "selected_quote": null,
          "selected_quote_type": null,
          "selected_term": null,
          "term": 15
        },
        status: 200,
      },
    }).as('lifeCoverages');

    cy.intercept('POST', '**/api/ci-main/v1/ci_recommendation/**', {
      statusCode: 200,
      body: {
        data: {
          "recommended_coverage_amount": 10000, // minimum recommended coverage amount
          "recommended_term": 30
        },
        status: 200,
      },
    }).as('ciRecommendation');

    cy.intercept('POST', '**/api/ci-main/v1/ci_sessions/*', (req) => {
      ciSessionsCallCount++;

      if (ciSessionsCallCount === 1) {
        req.reply({
          statusCode: 201,
          body: {
            data: {
              session_id: '38323e0c-0baf-4374-a2b0-eeeeffff',
              session_id_vers: 0,
            },
          },
        });
      } else {
        req.reply({
          statusCode: 201,
          body: {
            data: {
              session_id: '38323e0c-0baf-4374-a2b0-gggghhhh',
              session_id_vers: 0,
            },
          },
        });
      }
    }).as('ciSessions');
  });

  describe.skip('Test variant B', () => {
    it('navigates through the CI Attach journey: quotes -> intent -> start-app', () => {
      cy.setABTest(false, TEST_BAND);
      cy.visit(`${Cypress.env('baseURL')}/life/intent`, {
        onBeforeLoad: (win) => {
          const { state } = createTestStore(STATES_ENUM.DEFAULT);
          state.metadata.abTestBand = TEST_BAND;
          win.__PRELOADED_STATE__ = state;
        },
      });
      cy.window()
        .should('have.property', '__store__')
        .then((store) => {
          cy.url().should('include', '/life/life/life-insurance-quotes');
          cy.get('[data-cy="primary_userGender-Male"]').should('not.exist');
          cy.DesignSystemBirthdate('1 January 1997', 'primary_DOB');
          cy.get('[data-cy="primary_userGender-Male"]').click();
          cy.DesignSystemClickInSelect('primary_addressProvince', 'Ontario');
          cy.get('[data-cy="submit"]:visible').click();
          cy.get('[role="alert"]').should('exist');
          cy.get('[data-cy="primary_Smoker-false"]').click();
          cy.get('[data-cy="submit"]:visible').click();

          cy.url().should('include', '/life/life/intent');
          cy.get('[name="quotes-copilot-intent"]').should('exist');
          cy.get('[data-cy="submit"]:visible').click();
          cy.get('[role="alert"]').should('exist');
          cy.get('[data-cy="quotes-copilot-intent-mortgage-and-debts"]').click();
          cy.get('[data-cy="quotes-copilot-intent-family-financial-wellbeing"]').click();
          cy.get('[data-cy="submit"]:visible').click();

          cy.url().should('include', '/intent-transition');
          cy.get('[data-cy="submit"]:visible').click();

          cy.url().should('include', '/questions/partner');
          cy.get('[data-cy="birthdate-day"]').should('not.exist');
          cy.get('[data-cy="hasPartner-true"]').click();
          cy.DesignSystemBirthdate('1 January 1998', 'secondary_DOB');
          cy.get('[data-cy="secondary_userGender-Female"]').click();
          cy.DesignSystemClickInSelect('secondary_addressProvince', 'British Columbia');
          cy.get('[data-cy="provinceMismatchBlockerModalQuotesCopilot"]').should('exist');
          cy.get('[data-cy="CloseModalButton"]').click();
          cy.get('[data-cy="submit"]:visible').should('be.disabled');
          cy.DesignSystemClickInSelect('secondary_addressProvince', 'Ontario');
          cy.get('[data-cy="secondary_Smoker-true"]').click();
          cy.get('[data-cy="submit"]:visible').click();

          cy.wait('@householdInfos');
          cy.wait('@lifeSessions');
          cy.wait('@ciSessions');

          cy.url().should('include', '/questions/kids');
          cy.get('[data-cy="hasKids-true"]').click();
          cy.get('[data-cy="child-0"]').type('1');
          cy.get('[data-cy="kids-submit"]:visible').click();

          cy.url().should('include', '/tl-transition');
          cy.get('[data-cy="submit"]:visible').click();

          cy.url().should('include', '/questions/income');
          cy.get('[data-cy="userIncome"]').type('100000');
          cy.get('[data-cy="partnerIncome"]').type('120000');
          cy.get('[data-cy="income-submit"]:visible').click();

          cy.url().should('include', '/questions/residence');
          cy.get('[data-cy="residenceType-rent"]').click();
          cy.get('[data-cy="exps_residence"]').type('1000');
          cy.get('[data-cy="residence-submit"]:visible').click();

          cy.url().should('include', '/questions/savings');
          cy.get('[data-cy="hasSavings-true"]').click();
          cy.get('[data-cy="retirementSavings"]').type('100000');
          cy.get('[data-cy="nonRetirementSavings"]').type('200000');
          cy.get('[data-cy="useSavingsForCI-true"]').click();
          cy.get('[data-cy="savings-submit"]:visible').click();

          cy.url().should('include', '/ci-transition');
          cy.get('[data-cy="submit"]:visible').click().then(() => {
            const state = store.getState();
            expect(state.primary.household.province).to.equal('ON');
            expect(state.primary.household.userIncome).to.equal(100000);
            expect(state.primary.household.partnerIncome).to.equal(120000);
            expect(state.primary.household.nonRetirementSavings).to.equal(200000);
            expect(state.primary.household.retirementSavings).to.equal(100000);
            expect(state.primary.household.useSavingsForCI).to.be.true;
            expect(state.primary.household.residenceType).to.equal('rent');
  
            expect(state.secondary.household.province).to.equal('ON');
            expect(state.secondary.household.userIncome).to.equal(120000);
            expect(state.secondary.household.partnerIncome).to.equal(100000);
            expect(state.secondary.household.nonRetirementSavings).to.equal(200000);
            expect(state.secondary.household.retirementSavings).to.equal(100000);
            expect(state.secondary.household.useSavingsForCI).to.be.true;
            expect(state.secondary.household.residenceType).to.equal('rent');
            expect(state.expenses.exps_residence).to.equal(1000);
          });
          cy.url().should('include', '/life/getting-recommendation');
          cy.wait(5000);
          cy.get('[data-cy="submit"]:visible').click();
          cy.url().should('include', '/life/recommendation');
          // check for ci minimum coverage title
          cy.contains('Coverage built for your biggest responsibilities');
          cy.contains('This plan prioritizes life insurance to help cover major responsibilities like income replacement and long-term financial commitments, with critical illness coverage adding flexibility if you need time off work due to illness.');
          // check for TL bullet points
          // has partner
          cy.contains('Cover everyday expenses and prevent financial responsibilities from falling on your loved ones.');
          // has kids
          cy.contains("Fund your children's future education costs.");
          // mortgage as intent
          cy.contains('Pay off your remaining mortgage or other debts.');
          // static point
          cy.contains('Plus: Every policy provides each of your kids (or future kids!) with');



          // check for CI bullet points
          cy.contains('Help cover mortgage payments if illness prevents you from working for a period of time.');
          // static point
          cy.contains('Get up to 4 partial payouts for the 17 partially covered conditions, without affecting your total coverage amount.');

          cy.get('[data-cy="submit"]').click();
          cy.url().should('include', '/life/life/life-insurance-quotes-continued');

          cy.contains('Jan 1st, 1997 | Male | Non-Smoker | ON');

          cy.get('[name="edit-primary-details"]').click();
          cy.get('[data-cy="user-details-modal"]').should('exist');
          cy.get('[data-cy="user-details-birthdate-day"]').should('exist');
          cy.get('[data-cy="user-details-birthdate-month"]').should('exist');
          cy.get('[data-cy="user-details-birthdate-year"]').should('exist');
          cy.get('[data-cy="user-details-gender-Male"]').should('exist');
          cy.get('[data-cy="addressProvince"]').should('exist');
          cy.get('[data-cy="user-details-smoker-false"]').should('exist');

          cy.get('[data-cy="user-details-modal"] input[name="birthdate"]')
            .should('have.value', '01/01/1997');
          cy.DesignSystemBirthdate('2 February 1990', 'user-details-birthdate');
          cy.get('[data-cy="user-details-gender-Female"]').click();
          cy.DesignSystemClickInSelect('addressProvince', 'British Columbia');
          cy.get('[data-cy="user-details-smoker-true"]').click();
          cy.get('[data-cy="user-details-submit"]:visible').click();

          cy.contains('Feb 2nd, 1990 | Female | Smoker | BC');
        });
    });

    it('should not see the experiment if coming from advice calculator', () => {
        cy.setABTest(false, TEST_BAND);
        cy.visit(`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=0&override_amt=0&term=&email_ref_v0=1&gender=F&smoker=false&birthdate=01011988&life_session_id=30c76153-e100-456e-b9d7-2f1973660eec&life_session_id_vers=0&household_id=dee693d6-644e-4639-af96-e687657e55da&household_id_vers=0&province=BC&partner=false&underwriting_method=fully_underwritten&user_id=65099`);
        cy.url().should('include', '/life/life/life-insurance-quotes-continued');
        cy.get('[data-cy="quotes-copilot-quotes-continued-customize-coverage-title"]').should('not.exist');
    });

    it('should not be able to land on quotes copilot intent page without required data', () => {
      cy.setABTest(false, TEST_BAND);
      cy.visit(`${Cypress.env('baseURL')}/life/life/intent`);
      cy.url().should('include', '/life/life/life-insurance-quotes');
    });

    it('should land on quotes copilot intent page without required data', () => {
      cy.setABTest(false, TEST_BAND);
      cy.visit(`${Cypress.env('baseURL')}/life/life/life-insurance-quotes-continued?cov_amt=0&override_amt=0&term=&email_ref_v0=1&gender=F&smoker=false&birthdate=01011988&province=BC&partner=false&underwriting_method=fully_underwritten`);
      cy.url().should('include', '/life/life/intent');
      cy.get('[name="quotes-copilot-intent"]').should('exist');
    });

    it('cannot directly land on questions page', () => {
      cy.setABTest(false, TEST_BAND);
      cy.visit(`${Cypress.env('baseURL')}/life/questions/kids`);
      cy.url().should('include', '/life/life/life-insurance-quotes');
    });

    it('cannot directly land on transition pages', () => {
      cy.setABTest(false, TEST_BAND);
      cy.visit(`${Cypress.env('baseURL')}/life/intent-transition`);
      cy.url().should('include', '/life/life/life-insurance-quotes');
    });
  });

  describe('Control variant', () => {
    it('follows the normal journey: intent -> quotes -> quotes-continued', () => {
      cy.setABTest(false, CONTROL_BAND);

      cy.visit(`${Cypress.env('baseURL')}/life/intent`, {
        onBeforeLoad: (win) => {
          const { state } = createTestStore(STATES_ENUM.DEFAULT);
          state.metadata.abTestBand = CONTROL_BAND;
          win.__PRELOADED_STATE__ = state;
        },
      });

      cy.url().should('include', '/life/intent');
      cy.get('[data-cy="user-intent-Mortgage"]').click({ force: true });
      cy.get('[data-cy="submit"]:visible').click();
      cy.url().should('include', '/life/life-insurance-quotes');
    });
  });
});
