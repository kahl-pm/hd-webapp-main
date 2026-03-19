import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import AURA_QUESTION from './test_data';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';

describe('Search Question Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/233';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/233';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Search Question Aura type Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(233, AURA_QUESTION));

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

      it(`Search Question Aura type Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        // Make aura_response the question object from your disclosure redux state question
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(233, AURA_QUESTION));

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
        cy.get('[data-cy="select-field-What is the name of the medical condition, diagnosis or cause?-primary"]').should('exist');
        cy.contains('Please select an option').should('exist');
        cy.runA11yCheck();
      });

      it(`Search Question Aura type Page ${tenant_theme} theme a11y test with select focused and options list open`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(233, AURA_QUESTION));

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
        cy.get('[data-cy="select-field-What is the name of the medical condition, diagnosis or cause?-primary"]').click();
        cy.runA11yCheck();
      });

      it(`Search Question Aura type Page ${tenant_theme} theme a11y test with multiple options selected`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(233, AURA_QUESTION));

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
        cy.get('[data-cy="select-field-What is the name of the medical condition, diagnosis or cause?-primary"]').click();
        cy.get('[data-cy="select-field-What is the name of the medical condition, diagnosis or cause?-primary"]').type(AURA_QUESTION.aura_response.constraints.choices[0].text);
        cy.get(`[data-testid="select-option-${AURA_QUESTION.aura_response.constraints.choices[0].value}"]`).click();
        cy.runA11yCheck();
      });
    });
  });
});
