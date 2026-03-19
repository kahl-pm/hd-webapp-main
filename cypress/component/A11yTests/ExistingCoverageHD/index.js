import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { QUEBEC_PROVINCE_VALUE, ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import ExistingCoverage from '../../../../src/pages/ExistingCoverage';
import { updateHouseholdPropPrimary } from '../../../../src/NewActions/household';

describe('Existing Coverage Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/hd/existing-hd-coverage';
  const INITIALROUTERENTRY = '/hd/existing-hd-coverage';

  ['macbook-13', 'iphone-6+'].forEach((device) => {

    describe(`${device} View`, () => {
      it(`Existing Coverage Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with quebec modal showing`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropPrimary('healthcard_province', QUEBEC_PROVINCE_VALUE));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.get('[data-cy="existing_hd_cov-Y"]').click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with nothing chosen error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.get('[data-cy="group-benefits-submit"]').last().click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with No chosen`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.get('[data-cy="existing_hd_cov-N"]').click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with Yes chosen and existing policy chosen`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.get('[data-cy="existing_hd_cov-Y"]').click();
        cy.get('[data-cy="what-matters-most-to-you-0"]').click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with Yes chosen and existing policy not chosen error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverage} />, {
            reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
          }
        },
        );

        cy.get('[data-cy="existing_hd_cov-Y"]').click();
        cy.get('[data-cy="group-benefits-submit"]').last().click();
        cy.runA11yCheck();
      });
    });
  });
});
