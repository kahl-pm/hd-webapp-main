import React from 'react';
import { Route } from 'react-router';
import { THEMES } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import FamilyCompositionPage from '../../../../src/pages/FamilyCompositionPage';
import { FAMILY_COMPOSITION_OPTIONS, ROUTES } from '../../../../src/utils/const';

describe('Family Composition Page', () => {
  const tenantTheme = THEMES.policyme_original;
  const URL = '/life/hd/family-composition';
  const INITIALROUTERENTRY = '/hd/family-composition';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Family Composition Page ${device} Page ${tenantTheme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.FAMILY_COMPOSITION} component={FamilyCompositionPage} />,
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

      it(`Family Composition Page ${device} Page ${tenantTheme} theme a11y test submit with nothing selected`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.FAMILY_COMPOSITION} component={FamilyCompositionPage} />,
          {
            reduxStore: store,
            theme: tenantTheme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            },
          },
        );

        cy.get('[data-cy="family-composition-submit"]').last().click();
        cy.runA11yCheck();
      });

      FAMILY_COMPOSITION_OPTIONS.forEach(option => {
        it(`Family Composition Page ${device} Page ${tenantTheme} theme a11y test submit with ${option.value} selected`, () => {
          const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
          cy.setTenantConfigByTheme(tenantTheme);
          cy.setResolution(device);
          cy.mountFullAppWithNavBar(
            <Route path={ROUTES.FAMILY_COMPOSITION} component={FamilyCompositionPage} />,
            {
              reduxStore: store,
              theme: tenantTheme,
              routerProps: {
                initialEntries: [INITIALROUTERENTRY],
              },
            },
          );

          cy.get(`[data-cy="family_composition_options-${option.value}"]`).click();
          cy.get('[data-cy="family-composition-submit"]').last().click();
          cy.runA11yCheck();
        });
      })
    });
  });
});