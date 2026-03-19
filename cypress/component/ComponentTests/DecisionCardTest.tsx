import React from 'react';
import { TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS } from './config';
import { THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import DigitalConsentDashboardPage from '../../../src/pages/DigitalConsentDashboardPage';
import { createTestStore } from '../../../tests/util';
import { PM_PRODUCT_PREFIX, USER_TYPES } from '../../../src/utils/const';
import { topThreeRisks } from '../../../src/components/NewDecisionCard/helpers';
import { makeUpdateDecisionProp } from '../../../src/NewActions/helpers/productDecision';
import { checkDomElements, checkModals, checkToolTips, stepTo } from '../../helper';
import { DecisionCardStates, DECISION_CARD_STATES } from '../../support/DecisionCardStates';

const initializeStoreAndTheme = (journeyEnum, theme) => {
  const { store, state } = createTestStore(journeyEnum);
  cy.setTenantConfigByTheme(theme);
  cy.setResolution('macbook-13');
  cy.mount(<DigitalConsentDashboardPage />, { reduxStore: store, theme });
  return { store, state };
};

const expected = {
  initialCoverage: '$425,000',
  initialTerm: '20',
  initialDiscountedRate: '$28.03',
  initialRate: '$28.03',
  initialRateRaw: 28.03,
  finalCoverage: '$1,000,000',
  finalTerm: '10 years',
  finalRateRaw: 58.14,
};

describe('Decision cards', () => {
  const exclusionDescription = 'test';
  const exclusionData = [{
    code: '',
    description: exclusionDescription,
    exclusion_id: 1660,
    type: 'manual',
  }];

  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    it(`${theme} - RUW`, () => {
      const { state } = initializeStoreAndTheme(STATES_ENUM.JOURNEY_1_INDIV_RUW, theme);
      const risks = topThreeRisks(state[USER_TYPES.PRIMARY][`${PM_PRODUCT_PREFIX.LIFE}Decision`].risks);
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.RUW, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // check if all risks are displayed
          risks.forEach((risk) => {
            cy.get('li').contains(risk).should('be.visible');
          });
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
        });
    });

    it(`${theme} - Declined`, () => {
      initializeStoreAndTheme(STATES_ENUM.JOURNEY_1_INDIV_DECLINED, theme);
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.DECLINED, PM_PRODUCT_PREFIX.LIFE, false, theme);
        });
    });

    it(`${theme} - Approved`, () => {
      initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.APPROVED, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'review-exclusions', snapshotDesc: `Decision Card test ${theme} review exclusions modal` },
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
        });
    });

    it(`${theme} - Rate change smoking discrepancy`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('smoking_discrepancy_flag', true));
      cy.window()
        .then(() => {
          DecisionCardStates(
            DECISION_CARD_STATES.RATE_CHANGE_SMOKING_DISCREPANCY,
            PM_PRODUCT_PREFIX.LIFE,
            false,
            theme,
          );
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'review-exclusions', snapshotDesc: `Decision Card test ${theme} review exclusions modal` },
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
        });
    });

    it(`${theme} - Rate change uw total debits`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_total_debits', 25));
      cy.window()
        .then(() => {
          DecisionCardStates(
            DECISION_CARD_STATES.RATE_CHANGE_SMOKING_DISCREPANCY,
            PM_PRODUCT_PREFIX.LIFE,
            false,
            theme,
          );
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'review-exclusions', snapshotDesc: `Decision Card test ${theme} review exclusions modal` },
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
        });
    });

    it(`${theme} - Rate change uw flat extra debits`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_flat_extra_debits', 2));
      cy.window()
        .then(() => {
          DecisionCardStates(
            DECISION_CARD_STATES.RATE_CHANGE_SMOKING_DISCREPANCY,
            PM_PRODUCT_PREFIX.LIFE,
            false,
            theme,
          );
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'review-exclusions', snapshotDesc: `Decision Card test ${theme} review exclusions modal` },
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
        });
    });

    it(`${theme} - RUW no invalid badges`, () => {
      const { store, state } = initializeStoreAndTheme(STATES_ENUM.JOURNEY_1_INDIV_RUW, theme);
      const risks = topThreeRisks(state[USER_TYPES.PRIMARY][`${PM_PRODUCT_PREFIX.LIFE}Decision`].risks);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('smoking_discrepancy_flag', true));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_total_debits', 25));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_flat_extra_debits', 2));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('exclusions', exclusionData));
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.RUW, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
        });
    });

    it(`${theme} - Declined no invalid badges`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.JOURNEY_1_INDIV_DECLINED, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('smoking_discrepancy_flag', true));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_total_debits', 25));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('uw_flat_extra_debits', 2));
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('exclusions', exclusionData));
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.DECLINED, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // check if declined message is displayed
          cy.get('p').contains('Unfortunately, you weren’t eligible for life insurance with us').should('be.visible');
        });
    });

    it(`${theme} - Exclusions`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('exclusions', exclusionData));
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.EXCLUSIONS, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // check if correct count of exlusions is shown on badge
          cy.get('[data-cy="exclusions-badge"]').contains('2').should('be.visible');
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
          // check if exclusion is present in the modal
          cy.get(`[data-cy="review-exclusions"]`).eq(0).click();
          cy.get('li').contains(exclusionDescription).scrollIntoView().should('be.visible');
          cy.get(`[data-cy="CloseModalButton"]`).eq(0).click();
        });
    });

    it(`${theme} - Exclusions with rate change`, () => {
      const { store } = initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
      store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('exclusions', exclusionData));
      cy.window()
        .then(() => {
          DecisionCardStates(DECISION_CARD_STATES.EXCLUSIONS, PM_PRODUCT_PREFIX.LIFE, false, theme);
          // check if correct count of exlusions is shown on badge
          cy.get('[data-cy="exclusions-badge"]').contains('2').should('be.visible');
          // ensure rate tooltip shows correct info
          checkToolTips([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.LIFE}`, snapshotDesc: `Decision Card test ${theme} rate change tooltip`, label: 'open rate tooltip' },
          ]);
          // ensure modals shows correct info
          checkModals([
            { dataCy: 'edit-coverage', snapshotDesc: `Decision Card test ${theme} edit coverage modal` },
          ]);
          // check if exclusion is present in the modal
          cy.get(`[data-cy="review-exclusions"]`).eq(0).click();
          cy.get('li').contains(exclusionDescription).scrollIntoView().should('be.visible');
          cy.get(`[data-cy="CloseModalButton"]`).eq(0).click();
        });
    });
  });
  it(`Can edit term length after being approved`, () => {
    const theme = THEMES.policyme_original;
    initializeStoreAndTheme(STATES_ENUM.DEV_INIT, theme);
    cy.window()
      .then(() => {
        DecisionCardStates(DECISION_CARD_STATES.APPROVED, PM_PRODUCT_PREFIX.LIFE, false, theme);
        // test that you can edit coverage
        cy.get('[data-cy="edit-coverage"]').first().click();
        // test that you can edit term length
        cy.get('[data-cy="rangeSlider"]')
          .then($el => stepTo($el, 0))
          .trigger('change', { force: true });
      });
  });
});
