import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_INTENT_CHOICES } from '../../../../src/utils/const';
import Intent from '../../../../src/pages/Intent';
import { createTestStore } from '../../../../tests/util';

describe('Intent Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  describe('Mobile View', () => {
    it(`Intent Mobile Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.runA11yCheck();
    });

    it(`Intent Mobile Page ${tenant_theme} theme a11y test with an intent selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.UserIntent(USER_INTENT_CHOICES[0].value, true);
      cy.runA11yCheck();
    });

    it(`Intent Mobile Page ${tenant_theme} theme a11y test with no intent selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.UserIntent(null, false, true);
      cy.runA11yCheck();
    });

    it(`Intent Mobile Page ${tenant_theme} HD theme a11y test with no intent selected`, () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      // check if the HD intent choices are present
      cy.get('[value="Self-employed or Contractor"]').should('exist');
      cy.get('[value="Small Business Owner"]').should('exist');
      cy.get('[value="Supplement Existing Coverage"]').should('exist');
      cy.get('[value="Changing Jobs"]').should('exist');
      cy.get('[value="Exploring Alternatives"]').should('exist');
      cy.get('[value="Retiring"]').should('exist');
      cy.get('[value="Newcomer to Canada"]').should('exist');
      cy.get('[value="Other"]').should('exist');

      cy.UserIntent(null, false, true);
      cy.runA11yCheck();
    });
  });

  describe('Desktop View', () => {
    it(`Intent Desktop Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.runA11yCheck();
    });

    it(`Intent Desktop Page ${tenant_theme} theme a11y test with an intent selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.UserIntent(USER_INTENT_CHOICES[0].value, true);
      cy.runA11yCheck();
    });

    it(`Intent Desktop Page ${tenant_theme} theme a11y test with no intent selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      cy.UserIntent(null, false, true);
      cy.runA11yCheck();
    });

    it(`Intent Desktop Page ${tenant_theme} HD theme a11y test with no intent selected`, () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/intent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');

      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.USER_INTENT} component={Intent} />, { reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.USER_INTENT],
          } },
      );

      // check if the HD intent choices are present
      cy.get('[value="Self-employed or Contractor"]').should('exist');
      cy.get('[value="Small Business Owner"]').should('exist');
      cy.get('[value="Supplement Existing Coverage"]').should('exist');
      cy.get('[value="Changing Jobs"]').should('exist');
      cy.get('[value="Exploring Alternatives"]').should('exist');
      cy.get('[value="Retiring"]').should('exist');
      cy.get('[value="Newcomer to Canada"]').should('exist');
      cy.get('[value="Other"]').should('exist');

      cy.UserIntent(null, false, true);
      cy.runA11yCheck();
    });
  });
});
