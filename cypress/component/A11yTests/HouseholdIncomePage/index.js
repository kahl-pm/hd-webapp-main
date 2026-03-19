import React from 'react';
import { Route } from 'react-router';
import { THEMES } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import HouseholdIncome from '../../../../src/pages/HouseholdIncome';
import { HOUSEHOLD_INCOME_OPTIONS, ROUTES } from '../../../../src/utils/const';

describe('Household Income Page', () => {
  const tenantTheme = THEMES.policyme_original;
  const URL = '/life/hd/household-income';
  const INITIALROUTERENTRY = '/hd/household-income';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Household Income Page ${device} Page ${tenantTheme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.HOUSEHOLD_INCOME} component={HouseholdIncome} />,
          {
            reduxStore: store,
            theme: tenantTheme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            },
          },
        );
        cy.runA11yCheck();
      });

      it(`Household Income Page ${device} Page ${tenantTheme} theme a11y test submit with nothing selected`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.HOUSEHOLD_INCOME} component={HouseholdIncome} />,
          {
            reduxStore: store,
            theme: tenantTheme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            },
          },
        );
        cy.get('[data-cy="submit"]').last().click();
        cy.runA11yCheck();
      });

      HOUSEHOLD_INCOME_OPTIONS.forEach(option => {
        it(`Household Income Page ${device} Page ${tenantTheme} theme a11y test submit with ${option.value} selected`, () => {
          const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
          cy.setTenantConfigByTheme(tenantTheme);
          cy.setResolution(device);
          cy.mountFullAppWithNavBar(
            <Route path={ROUTES.HOUSEHOLD_INCOME} component={HouseholdIncome} />,
            {
              reduxStore: store,
              theme: tenantTheme,
              routerProps: {
                initialEntries: [INITIALROUTERENTRY],
              },
            },
          );
          cy.get(`[data-cy="household-income-${option.value}"]`).click();
          cy.get('[data-cy="submit"]').last().click();
          cy.runA11yCheck();
        });
      });
    });
  });
});
