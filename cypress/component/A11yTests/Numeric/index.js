import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';
import AURA_QUESTION from './test_data';

describe('Numeric Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/231';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/231';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Numeric Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(231, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
      });

      it(`Numeric Aura Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        // Make aura_response the question object from your disclosure redux state question
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(231, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.SubmitForm();
        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').should('exist');
        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').should('have.attr', 'aria-invalid', 'true');
        cy.runA11yCheck();
      });

      it(`Numeric Aura Page ${tenant_theme} theme a11y test only allow numbers, no decimal precision`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(231, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').type('2.7');
        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').should('have.value', '27');
      });

      it(`Numeric Aura Page ${tenant_theme} theme a11y test only allow numbers, with decimal precision`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        const alteredAuraQuestion = {
          ...AURA_QUESTION,
          aura_response: {
            ...AURA_QUESTION.aura_response,
            constraints: {
              ...AURA_QUESTION.aura_response.constraints,
              decimalPrecision: 2,
            },
          },
        };

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(231, alteredAuraQuestion));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').type('1e1.392');
        cy.get('[data-cy="numeric-input-Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? -primary"]').should('have.value', '11.39');
      });
    });
  });
});
