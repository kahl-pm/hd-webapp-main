import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Authorization from '../../../../src/pages/application/Authorization';

describe('Authorization Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`Authorization Individual Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Authorization />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.get(`[data-cy="consent-body"]`)
      .find('ul>li')
      .invoke('text')
      .should('not.be.empty');
  });

  it(`Authorization Individual Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Authorization />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.get(`[data-cy="consent-body"]`)
      .find('ul>li')
      .invoke('text')
      .should('not.be.empty');
  });

  it(`Authorization Joint Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Authorization />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.get(`[data-cy="consent-body"]`)
      .find('ul>li')
      .invoke('text')
      .should('not.be.empty');
  });

  it(`Authorization Joint Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <Authorization />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.get(`[data-cy="consent-body"]`)
      .find('ul>li')
      .invoke('text')
      .should('not.be.empty');
  });
});
