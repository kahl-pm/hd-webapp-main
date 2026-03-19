import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';
import ACCRatedAlert from '../../../src/ABTests/AB_TEST_86/AccRatedAlert';
import { USER_TYPES, PM_PRODUCT_PREFIX } from '../../../src/utils/const';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { makeUpdateDecisionProp } from '../../../src/NewActions/helpers/productDecision';

describe('ACCRatedAlert Component Tests', () => {
  const tenant_theme = THEMES.policyme_original;

  it('should render and request callback', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
    store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('smoking_discrepancy_flag', true));
    store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('active_decision', 'Approved'));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.intercept('POST', '**/advisor/callback/*', { statusCode: 200 }).as('callbackRequest');
    cy.mount(<ACCRatedAlert userType={USER_TYPES.PRIMARY} product={PM_PRODUCT_PREFIX.LIFE} />, { reduxStore: store, theme: tenant_theme });
    cy.get('[data-cy="acc-rated-request-callback"]').should('exist');
    cy.get('[data-cy="acc-rated-request-callback"]').click().then(() => {
      cy.get('[data-cy="acc-rated-callback-confirmation-header"]').should('exist');
    });
  });

  it('if request callback failed, show error message', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
    store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('smoking_discrepancy_flag', true));
    store.dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.LIFE)('active_decision', 'Approved'));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.intercept('POST', '**/advisor/callback/*', { statusCode: 500 }).as('callbackRequest');
    cy.mount(<ACCRatedAlert userType={USER_TYPES.PRIMARY} product={PM_PRODUCT_PREFIX.LIFE} />, { reduxStore: store, theme: tenant_theme });
    cy.get('[data-cy="acc-rated-request-callback"]').should('exist');
    cy.get('[data-cy="acc-rated-request-callback"]').click().then(() => {
      cy.get('[data-cy="acc-rated-callback-error-message"]').should('exist');
    });
  });
});