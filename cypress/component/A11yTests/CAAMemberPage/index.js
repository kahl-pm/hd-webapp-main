import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import CAAMember from '../../../../src/pages/CAAMember';
import { createTestStore } from '../../../../tests/util';

describe('CAA Member Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  describe('Mobile View', () => {
    it(`CAA Member Mobile Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.runA11yCheck();
    });

    it(`CAA Member Mobile Page ${tenant_theme} theme a11y test with YES selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.get('[data-cy="caaMember-Y"]').click();
      cy.runA11yCheck();
      cy.SubmitForm();
      cy.runA11yCheck();
    });

    it(`CAA Member Mobile Page ${tenant_theme} theme a11y test with NO selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.get('[data-cy="caaMember-N"]').click();
      cy.runA11yCheck();
      cy.SubmitForm();
      cy.runA11yCheck();
    });

  });

  describe('Desktop View', () => {
    it(`CAA Member Desktop Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.runA11yCheck();
    });

    it(`CAA Member Desktop Page ${tenant_theme} theme a11y test with YES selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.get('[data-cy="caaMember-Y"]').click();
      cy.runA11yCheck();
      cy.SubmitForm();
      cy.runA11yCheck();
    });

    it(`CAA Member Desktop Page ${tenant_theme} theme a11y test with NO selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/caa-member');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: ['/life/caa-member'],
        }
      });

      cy.get('[data-cy="caaMember-N"]').click();
      cy.runA11yCheck();
      cy.SubmitForm();
      cy.runA11yCheck();
    });
  });
});
