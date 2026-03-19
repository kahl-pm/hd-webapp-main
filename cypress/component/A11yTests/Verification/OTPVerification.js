import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

import { createTestStore } from '../../../../tests/util';
import OTPVerification from '../../../../src/pages/application/OTPVerification';

describe('OTPVerification Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`OTPVerification Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/otp-verification');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.linkRoutes();
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <OTPVerification />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`Passes a11y test for ${tenant_theme} when no input is entered`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/otp-verification');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.linkRoutes();
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <OTPVerification />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.SubmitForm();
    cy.runA11yCheck();
  });

  it(`OTPVerification Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/otp-verification');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.linkRoutes();
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <OTPVerification />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });
});
