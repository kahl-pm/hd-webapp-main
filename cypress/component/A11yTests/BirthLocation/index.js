import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import BirthLocation from '../../../../src/pages/application/BirthLocation';

describe('BirthLocation Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const BIRTH_LOCATION_URL = '/life/birth-location';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`BirthLocation Page ${tenant_theme} theme a11y test for Single Application`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Joint Application`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Single Application with interactions`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        cy.get('[data-cy="Country"]').click();
        cy.get('[role="option"]').contains('United States').click();

        cy.get('[data-cy="State"]').should('exist');

        cy.get('[data-cy="State"]').click();
        cy.get('[role="option"]').contains('California').click();

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Single Application with missing required fields`, () => {
        const { store } = createTestStore(STATES_ENUM.DEFAULT, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        // Attempt to submit the form without selecting a country
        cy.get('[data-cy="submit"]').last().click();

        // Verify that validation message appears
        cy.contains('Select a country').should('exist');

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Joint Application with interactions`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        // Primary applicant selects Canada
        cy.get('[data-cy="Country"]').click();
        cy.get('[role="option"]').contains('Canada').click();

        // Verify that province select appears for primary
        cy.get('[data-cy="Province"]').should('exist');

        // Primary applicant selects Ontario
        cy.get('[data-cy="Province"]').click();
        cy.get('[role="option"]').contains('Ontario').click();

        // Secondary applicant selects United States
        cy.get('[data-cy="partnerCountry"]').click();
        cy.get('[role="option"]').contains('United States').click();

        // Verify that state select appears for secondary
        cy.get('[data-cy="secState"]').should('exist');

        // Secondary applicant selects New York
        cy.get('[data-cy="secState"]').click();
        cy.get('[role="option"]').contains('New York').click();

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Joint Application with missing required fields`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        // Attempt to submit the form without selecting countries
        cy.get('[data-cy="submit"]').last().click();

        // Verify that validation messages appear
        cy.contains('Select a country').should('exist');

        cy.runA11yCheck();
      });

      it(`BirthLocation Page ${tenant_theme} theme a11y test for Single Application with state/province validation error`, () => {
        const { store } = createTestStore(STATES_ENUM.DEFAULT, BIRTH_LOCATION_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.BIRTH_LOCATION} component={BirthLocation} />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [BIRTH_LOCATION_URL],
            },
          },
        );

        // Select country as United States
        cy.get('[data-cy="Country"]').click();
        cy.get('[role="option"]').contains('United States').click();

        // Attempt to submit the form without selecting a state
        cy.get('[data-cy="submit"]').last().click();

        // Verify that validation message appears for state
        cy.contains('Select a state').should('exist');

        cy.runA11yCheck();
      });
    });
  });
});
