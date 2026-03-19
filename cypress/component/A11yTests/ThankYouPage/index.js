import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import ThankYou from '../../../../src/pages/approved/ThankYou';

describe('ThankYou Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`HD ThankYou Page Desktop ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/approved/primary/thankyou');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <ThankYou />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.runA11yCheck();
  });

  it(`HD ThankYou Page Mobile ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/approved/primary/thankyou');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6');
    cy.mountFullAppWithNavBar(
      <ThankYou />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.runA11yCheck();
  });

  it(`DC ThankYou Page Desktop ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT_PAYMENT_COMPLETE, '/life/approved/primary/thankyou');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <ThankYou />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.runA11yCheck();
  });

  it(`DC ThankYou Page Desktop ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT_PAYMENT_COMPLETE, '/life/approved/primary/thankyou');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6');
    cy.mountFullAppWithNavBar(
      <ThankYou />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.runA11yCheck();
  });
});
