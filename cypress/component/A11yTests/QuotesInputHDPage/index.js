import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import moment from 'moment';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { BUYING_METHOD, PM_PRODUCT_PREFIX, ROUTES, PROVINCES } from '../../../../src/utils/const';
import QuotesInputHd from '../../../../src/pages/QuotesInput/QuotesInputHd';
import { createTestStore } from '../../../../tests/util';
import { updateMetadata } from '../../../../src/NewActions/metadata';
import QuotesCompare from '../../../../src/pages/QuotesInput/QuotesCompare';
import { makeUpdateProductAppProp } from '../../../../src/NewActions/helpers/productApp';

describe('Quotes Input HD Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`Quotes Input HD ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/hd/life-insurance-quotes');
    cy.setTenantConfigByTheme(tenant_theme);
    // mobile view
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.QUOTES_COMPARE} component={QuotesInputHd} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.QUOTES_COMPARE],
        },
      },
    );

    cy.runA11yCheck();

    // desktop view
    cy.setResolution('macbook-13');
    cy.runA11yCheck();
  });

  it(`Quotes Input HD ${tenant_theme} theme a11y test with form not filled`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/hd/life-insurance-quotes');
    cy.setTenantConfigByTheme(tenant_theme);
    // mobile view
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.QUOTES_COMPARE} component={QuotesInputHd} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.QUOTES_COMPARE],
        },
      },
    );

    cy.clickSubmit();
    cy.runA11yCheck();

    // desktop view
    cy.setResolution('macbook-13');
    cy.runA11yCheck();
  });

  it(`Quotes Input HD ${tenant_theme} theme a11y test with partner and dependent card open`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/hd/life-insurance-quotes');
    cy.setTenantConfigByTheme(tenant_theme);
    // mobile view
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.QUOTES_COMPARE} component={QuotesInputHd} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.QUOTES_COMPARE],
        },
      },
    );

    cy.get(`[data-cy=add-secondary-button]`).click();
    cy.get(`[data-cy=add-dependent-button]`).click();
    cy.runA11yCheck();

    // desktop view
    cy.setResolution('macbook-13');
    cy.runA11yCheck();
  });

  it(`Quotes Input HD ${tenant_theme} theme a11y test with partner and dependent card open and filled with dependent age more than 20`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/hd/life-insurance-quotes');

    store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.CI, 'primary')('buying_method', ''));
    store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.LIFE, 'primary')('buying_method', ''));
    store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.HD, 'primary')('buying_method', BUYING_METHOD.STAND_ALONE));

    cy.setTenantConfigByTheme(tenant_theme);
    // mobile view
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.QUOTES_COMPARE} component={QuotesInputHd} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.QUOTES_COMPARE],
        },
      },
    );

    const primaryUserBirthdate = moment().subtract(30, 'years').format('D MMMM YYYY');
    const dependentBirthdate = moment().subtract(21, 'years').format('D MMMM YYYY');

    cy.QuotesInputPrimary(primaryUserBirthdate, 'Male', false, PROVINCES.ON, 'primary');
    cy.QuotesInputDependant(dependentBirthdate, 'Male', null, null, 0);
    cy.get('[data-cy="checkbox-quotes-input"]').click();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();

    cy.runA11yCheck();
    cy.setResolution('macbook-13');
    cy.runA11yCheck();

    cy.contains('Must be 20 or under');
  });

  it(`Quotes Input HD ${tenant_theme} theme a11y test with partner province mismatch modal open`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/hd/life-insurance-quotes');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    // mobile view
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.QUOTES_COMPARE} component={QuotesCompare} />, { reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.QUOTES_COMPARE],
        } },
    );

    cy.QuotesInputPrimary('27 January 1996', 'Male', 'false', PROVINCES.BC, 'primary');
    cy.QuotesInputSecondary('27 January 1996', 'Female', 'false', PROVINCES.AB, 'secondary');
    cy.CheckInputBoxQuotesInput();
    // cy.get('[data-cy="checkbox-quotes-provided-docs"]').click();
    cy.clickSubmit();
    cy.runA11yCheck();
  });
});
