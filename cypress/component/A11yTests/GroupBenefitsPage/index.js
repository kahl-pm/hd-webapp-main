import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import GroupBenefits from '../../../../src/pages/GroupBenefits';
import { createTestStore } from '../../../../tests/util';

describe('Group Benefits Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/hd/group-benefits';
  const INITIALROUTERENTRY = '/hd/group-benefits';

  beforeEach(() => {
    cy.intercept('POST', '/api/hd-quotes/v1/quotes', {
      statusCode: 200,
      body: { success: true },
    }).as('hdQuotes');
  });

  describe('Mobile View', () => {
    it(`Group Benefits Mobile Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.runA11yCheck();
    });

    it(`Group Benefits Mobile Page ${tenant_theme} theme a11y test with Yes chosen`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy="groupBenefits-Y"]').click();
      cy.runA11yCheck();
    });

    it(`Group Benefits Mobile Page ${tenant_theme} theme a11y test with False chosen`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy="groupBenefits-N"]').click();
      cy.runA11yCheck();
    });

    it(`Group Benefits Mobile Page ${tenant_theme} theme a11y test with required choice error`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy=group-benefits-submit]:visible')
        .click();
      cy.runA11yCheck();
    });
  });

  describe('Desktop View', () => {
    it(`Group Benefits Desktop Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.runA11yCheck();
    });

    it(`Group Benefits Desktop Page ${tenant_theme} theme a11y test with Yes chosen`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy="groupBenefits-Y"]').click();
      cy.runA11yCheck();
    });

    it(`Group Benefits Desktop Page ${tenant_theme} theme a11y test with False chosen`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy="groupBenefits-N"]').click();
      cy.runA11yCheck();
    });

    it(`Group Benefits Desktop Page ${tenant_theme} theme a11y test with required choice error`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          } },
      );

      cy.get('[data-cy=group-benefits-submit]')
        .click();
      cy.runA11yCheck();
    });
  });
});
