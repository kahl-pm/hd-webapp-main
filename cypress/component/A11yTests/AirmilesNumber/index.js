import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import AirmilesNumber from '../../../../src/pages/health-and-dental/AirmilesNumber';

describe('AirmilesNumber Page A11y Test', () => {
  const tenant_theme = THEMES.BMOI;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`AirmilesNumber Page ${tenant_theme} theme a11y test - initial state`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <AirmilesNumber />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.runA11yCheck();
      });

      it(`AirmilesNumber Page ${tenant_theme} theme a11y test - Yes selected`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <AirmilesNumber />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.get('[data-cy="airmilesNumber-Y"]').click();
        cy.runA11yCheck();
      });

      it(`AirmilesNumber Page ${tenant_theme} theme a11y test - Yes selected with error`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <AirmilesNumber />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.get('[data-cy="airmilesNumber-Y"]').click();
        cy.get('input[name="airmilesNumber"]').type('123');
        cy.get('[data-cy="submit"]').last().click();
        cy.runA11yCheck();
      });

      it(`AirmilesNumber Page ${tenant_theme} theme a11y test - Yes selected with valid input`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <AirmilesNumber />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.get('[data-cy="airmilesNumber-Y"]').click();
        cy.get('input[name="airmilesNumber"]').type('80060860886');
        cy.runA11yCheck();
      });

      it(`AirmilesNumber Page ${tenant_theme} theme a11y test - No selected`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <AirmilesNumber />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.get('[data-cy="airmilesNumber-N"]').click();
        cy.runA11yCheck();
      });
    });
  });
}); 