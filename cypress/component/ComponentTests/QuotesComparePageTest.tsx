import { PM_PRODUCT_PREFIX, TENANT_FLAGS, THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import QuotesCompare from '../../../src/pages/QuotesInput/QuotesCompare';
import { updateMetadata } from '../../../src/NewActions/metadata';
import { PROVINCES } from '../../../src/utils/const';

describe('QuotesCompare Page province mismatch modal tests', () => {
  const tenant_theme = THEMES.policyme_original;
  const tenant_theme_bcl = THEMES.BCL;

  it(`QuotesCompare HD Desktop Page province mismatch modal`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.BC, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('exist');
  });

  it(`QuotesCompare Life Desktop Page province mismatch modal`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.LIFE));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.BC, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('exist');
  });

  it(`QuotesCompare HD Desktop Page province mismatch modal disabled`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.window().then((win) => {
      win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_PROVINCE_MISMATCH_CHECK] = false;
    });
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.BC, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('not.exist');
  });

  it(`QuotesCompare Life Desktop Page province mismatch modal disabled`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.LIFE));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.window().then((win) => {
      win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_PROVINCE_MISMATCH_CHECK] = false;
    });
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.BC, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('not.exist');
  });

  it(`QuotesCompare HD Desktop Page province mismatch modal not show when province is same`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.AB, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('not.exist');
  });

  it(`QuotesCompare Life Desktop Page province mismatch modal not show when province is same`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.LIFE));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesCompare />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.AB, 'primary');
    cy.QuotesInputPrimary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.get(`[data-cy="provinceMismatchBlockerModal"]`).should('not.exist');
  });
});
