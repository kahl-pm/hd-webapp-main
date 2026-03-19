import { PM_PRODUCT_PREFIX } from '../../src/utils/const';
import { THEMES } from '@policyme/global-libjs-utils';

import { TENANT_SUBORGANIZATION_CODES } from '../../src/tenant/consts';
import { checkDomElements, checkNestedDomElements } from '../helper';

const isSuborgTheme = (t: string) => Object.values(TENANT_SUBORGANIZATION_CODES).includes(t as any);

export type DecisionCardStatesType = typeof DECISION_CARD_STATES[keyof typeof DECISION_CARD_STATES];
export const DECISION_CARD_STATES = {
  RUW: 'RUW',
  DECLINED: 'DECLINED',
  APPROVED: 'APPROVED',
  RATE_CHANGE_SMOKING_DISCREPANCY: 'RATE_CHANGE_SMOKING_DISCREPANCY',
  RATE_CHANGE_UW_TOTAL_DEBITS: 'RATE_CHANGE_UW_TOTAL_DEBITS',
  RATE_CHANGE_UW_FLAT_EXTRA_DEBITS: 'RATE_CHANGE_UW_FLAT_EXTRA_DEBITS',
  EXCLUSIONS: 'EXCLUSIONS',
};

export const DecisionCardStates = (state, product, isConsented: boolean, tenant: string) => {
  switch (state) {
    case DECISION_CARD_STATES.RUW:
      checkNestedDomElements([
        { dataCy: 'review-badge', shouldExist: true },
        { dataCy: 'rate-change-badge', shouldExist: false },
        { dataCy: 'approved-badge', shouldExist: false },
        { dataCy: 'declined-badge', shouldExist: false },
        { dataCy: 'exclusions-badge', shouldExist: false },
        { dataCy: 'review-desc', shouldExist: true },
      ], `Decision Card ${product}`);
      // when life app is in RUW state, the CI add on card should not be displayed
      if (product === PM_PRODUCT_PREFIX.LIFE) {
        checkDomElements([
          { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
          { dataCy: 'ci-addon-card', shouldExist: false },
        ]);
      }
      break;
    case DECISION_CARD_STATES.DECLINED:
      checkNestedDomElements([
        { dataCy: 'review-badge', shouldExist: false },
        { dataCy: 'rate-change-badge', shouldExist: false },
        { dataCy: 'approved-badge', shouldExist: false },
        { dataCy: 'declined-badge', shouldExist: true },
        { dataCy: 'exclusions-badge', shouldExist: false },
        { dataCy: 'declined-desc', shouldExist: true },
      ], `Decision Card ${product}`);
      // when life app is in declied state, the CI add on card should not be displayed
      if (product === PM_PRODUCT_PREFIX.LIFE) {
        checkDomElements([
          { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
          { dataCy: 'ci-addon-card', shouldExist: false },
        ]);
      }
      // check if declined message is displayed correctly
      if (product === PM_PRODUCT_PREFIX.CI) {
        cy.get('p').contains('Unfortunately, you weren’t eligible for critical illness insurance with us').should('be.visible');
      } else {
        cy.get('p').contains('Unfortunately, you weren’t eligible for life insurance with us').should('be.visible');
      }
      break;
    case DECISION_CARD_STATES.APPROVED:
      checkNestedDomElements([
        { dataCy: 'review-badge', shouldExist: false },
        { dataCy: 'rate-change-badge', shouldExist: false },
        { dataCy: 'approved-badge', shouldExist: true },
        { dataCy: 'declined-badge', shouldExist: false },
        { dataCy: 'exclusions-badge', shouldExist: false },
        { dataCy: 'approved-rate-price', shouldExist: true },
        { dataCy: 'download-policy-coverage', shouldExist: true },
        { dataCy: 'download-qa-document-dashboard', shouldExist: !isConsented },
        { dataCy: 'edit-coverage', shouldExist: !isConsented },
        { dataCy: 'review-exclusions', shouldExist: true },
      ], `Decision Card ${product}`);
      // when life app is in approved state, the CI add on card should be displayed
      if (product === PM_PRODUCT_PREFIX.LIFE && !isConsented) {
        if (tenant !== THEMES.policyme_original && !isSuborgTheme(tenant)) {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: false },
            { dataCy: 'ci-addon-actionable-card', shouldExist: true },
          ]);
        } else {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: true },
          ]);
        }
      }
      // when ci app is in approved state
      // the CI add on card should not be displayed if user has already consented
      if (product === PM_PRODUCT_PREFIX.CI) {
        checkDomElements([
          { dataCy: 'ci-addon-card', shouldExist: false },
          { dataCy: 'ci-addon-actionable-card', shouldExist: false },
        ]);
      }
      break;
    case DECISION_CARD_STATES.RATE_CHANGE_UW_FLAT_EXTRA_DEBITS:
    case DECISION_CARD_STATES.RATE_CHANGE_UW_TOTAL_DEBITS:
    case DECISION_CARD_STATES.RATE_CHANGE_SMOKING_DISCREPANCY:
      checkNestedDomElements([
        { dataCy: 'review-badge', shouldExist: false },
        { dataCy: 'rate-change-badge', shouldExist: true },
        { dataCy: 'approved-badge', shouldExist: true },
        { dataCy: 'declined-badge', shouldExist: false },
        { dataCy: 'exclusions-badge', shouldExist: false },
        { dataCy: 'approved-rate-price', shouldExist: true },
        { dataCy: 'download-policy-coverage', shouldExist: true },
        { dataCy: 'download-qa-document-dashboard', shouldExist: !isConsented },
        { dataCy: 'edit-coverage', shouldExist: !isConsented },
        { dataCy: 'review-exclusions', shouldExist: true },
      ], `Decision Card ${product}`);
      // when life app is in approved state, the CI add on card should be displayed
      if (product === PM_PRODUCT_PREFIX.LIFE && !isConsented) {
        if (tenant !== THEMES.policyme_original && !isSuborgTheme(tenant)) {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: false },
            { dataCy: 'ci-addon-actionable-card', shouldExist: true },
          ]);
        } else {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: true },
          ]);
        }
      }
      // when ci app is in approved state
      // the CI add on card should not be displayed if user has already consented
      if (product === PM_PRODUCT_PREFIX.CI) {
        checkDomElements([
          { dataCy: 'ci-addon-card', shouldExist: false },
          { dataCy: 'ci-addon-actionable-card', shouldExist: false },
        ]);
      }
      break;
    case DECISION_CARD_STATES.EXCLUSIONS:
      checkNestedDomElements([
        { dataCy: 'review-badge', shouldExist: false },
        { dataCy: 'rate-change-badge', shouldExist: false },
        { dataCy: 'approved-badge', shouldExist: true },
        { dataCy: 'declined-badge', shouldExist: false },
        { dataCy: 'exclusions-badge', shouldExist: true },
        { dataCy: 'approved-rate-price', shouldExist: true },
        { dataCy: 'download-policy-coverage', shouldExist: true },
        { dataCy: 'download-qa-document-dashboard', shouldExist: !isConsented },
        { dataCy: 'edit-coverage', shouldExist: !isConsented },
        { dataCy: 'review-exclusions', shouldExist: true },
      ], `Decision Card ${product}`);
      // when life app is in approved state, the CI add on card should be displayed
      if (product === PM_PRODUCT_PREFIX.LIFE && !isConsented) {
        if (tenant !== THEMES.policyme_original && !isSuborgTheme(tenant)) {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: false },
            { dataCy: 'ci-addon-actionable-card', shouldExist: true },
          ]);
        } else {
          checkDomElements([
            { dataCy: `Decision Card ${PM_PRODUCT_PREFIX.CI}`, shouldExist: false },
            { dataCy: 'ci-addon-card', shouldExist: true },
          ]);
        }
      }
      // when ci app is in approved state
      // the CI add on card should not be displayed if user has already consented
      if (product === PM_PRODUCT_PREFIX.CI) {
        checkDomElements([
          { dataCy: 'ci-addon-card', shouldExist: false },
          { dataCy: 'ci-addon-actionable-card', shouldExist: false },
        ]);
      }
      break;
    default:
      throw new Error(`Unknown state: ${state}`);
  }
};
