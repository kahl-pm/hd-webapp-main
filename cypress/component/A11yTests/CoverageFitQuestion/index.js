import React from 'react';
import { Route } from 'react-router';
import { THEMES } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import { COVERAGE_FIT_OPTIONS, ROUTES } from '../../../../src/utils/const';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import CoverageFitQuestion from '../../../../src/pages/CoverageFitQuestion';

describe('Coverage Fit Question A11y Test', () => {
  const tenantTheme = THEMES.policyme_original;
  const URL = '/life/hd/coverage-fit-question';
  const INITIALROUTERENTRY = '/hd/coverage-fit-question';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Coverage Fit Question ${device} Page ${tenantTheme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.COVERAGE_FIT_QUESTION} component={CoverageFitQuestion} />,
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

      it(`Coverage Fit Question ${device} Page ${tenantTheme} theme a11y test submit with nothing selected`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.COVERAGE_FIT_QUESTION} component={CoverageFitQuestion} />,
          {
            reduxStore: store,
            theme: tenantTheme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            },
          },
        );

        cy.get('[data-cy="coverage-fit-submit"]').last().click();
        cy.runA11yCheck();
      });

      Object.keys(COVERAGE_FIT_OPTIONS).forEach((key) => {
        const option = COVERAGE_FIT_OPTIONS[key];
        it(`Coverage Fit Question ${device} Page ${tenantTheme} theme a11y test for ${option} selected`, () => {
          const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
          cy.setTenantConfigByTheme(tenantTheme);
          cy.setResolution(device);

          cy.mountFullAppWithNavBar(
            <Route path={ROUTES.COVERAGE_FIT_QUESTION} component={CoverageFitQuestion} />,
            {
              reduxStore: store,
              theme: tenantTheme,
              routerProps: {
                initialEntries: [INITIALROUTERENTRY],
              },
            },
          );

          cy.get(`[data-cy="cov_fit_options-${option}"]`).click();
          cy.get('[data-cy="coverage-fit-submit"]').last().click();
          cy.runA11yCheck();
        });
      });

      it(`Coverage Fit Question ${device} Page ${tenantTheme} theme a11y test shows CDCP modal`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, URL);
        cy.setTenantConfigByTheme(tenantTheme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.COVERAGE_FIT_QUESTION} component={CoverageFitQuestion} />,
          {
            reduxStore: store,
            theme: tenantTheme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            },
          },
        );

        cy.get('[data-cy="cdcp_modal_link"]').last().click();
        cy.get('[id="hdCDCPHeader"]').should('be.visible');
        cy.runA11yCheck();
      });
    });
  });
});
