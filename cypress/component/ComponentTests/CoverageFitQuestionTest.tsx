import { PM_PRODUCT_PREFIX, TENANT_FLAGS, THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import CoverageFitQuestion from '../../../src/pages/CoverageFitQuestion';
import { updateMetadata } from '../../../src/NewActions/metadata';
import { COVERAGE_FIT_OPTIONS } from '../../../src/utils/const';

describe('Test Coverage Fit page', () => {
  const tenant_theme = THEMES.policyme_original;
  const tenant_theme_CAA = THEMES.CAA;

  it(`Test Coverage Fit page PM`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CoverageFitQuestion />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED}"]`).should('exist');
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.PRESCRIPTION_DRUGS_NOT_NEEDED}"]`).should('exist');
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.PRESCRIPTION_DENTAL_COVERAGE_NEEDED}"]`).should('exist');
    cy.get('[data-cy="cdcp_modal_link"]').should('exist');
  });

  it(`Test Coverage Fit page CAA`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme_CAA);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CoverageFitQuestion />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED}"]`).should('not.exist');
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.PRESCRIPTION_DRUGS_NOT_NEEDED}"]`).should('exist');
    cy.get(`[data-cy="cov_fit_options-${COVERAGE_FIT_OPTIONS.PRESCRIPTION_DENTAL_COVERAGE_NEEDED}"]`).should('exist');
    cy.get('[data-cy="cdcp_modal_link"]').should('not.exist');
  });
});
