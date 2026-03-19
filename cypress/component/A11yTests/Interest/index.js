import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Interest from '../../../../src/pages/Interest';

describe('Interest Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`Interest Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/application/interest');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Interest />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`Interest Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/application/interest');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Interest />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`Interest Desktop Page - error message on unselected option`, () => {
    const { store } = createTestStore(STATES_ENUM.DEFAULT, '/life/application/interest');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Interest />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="submit"]:visible').click();

    cy.contains('Please select an option').should('be.visible');
  });

  it(`Interest Mobile Page - error message on unselected option`, () => {
    const { store } = createTestStore(STATES_ENUM.DEFAULT, '/life/application/interest');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Interest />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="submit"]').last().click();

    cy.contains('Please select an option').should('be.visible');
  });
});
