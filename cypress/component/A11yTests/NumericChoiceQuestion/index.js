import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';
import AURA_QUESTION from './test_data';

describe('Numeric Choice Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/246';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/246';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Numeric Choice Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(246, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
            path: INITIALROUTERENTRY,
          }
        },
        );

        cy.runA11yCheck();
      });

      it(`Numeric Choice Aura Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(246, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
            path: INITIALROUTERENTRY,
          }
        },
        );

        cy.SubmitForm();
        cy.get('[data-cy="numeric-choice-radio-What is the degree of your paralysis?-primary-Monoplegia (paralysis of one limb)"]').should('exist');
        cy.get('[data-cy="numeric-choice-radio-What is the degree of your paralysis?-primary-Diplegia or paraplegia (paralysis of both arms or legs)"]').should('exist');
        cy.get('[data-cy="numeric-choice-radio-What is the degree of your paralysis?-primary-Quadriplegia or tetraplegia (paralysis of all four limbs)"]').should('exist');
        cy.runA11yCheck();
      });
    });

    it(`Numeric Choice Aura Page ${tenant_theme} theme a11y test with an option selected`, () => {
      const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

      store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(246, AURA_QUESTION));

      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);

      cy.mountFullAppWithNavBar(
        <Route
          path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
          component={DisclosureIntegration}
        />,
        {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [INITIALROUTERENTRY],
            path: INITIALROUTERENTRY,
          },
        },
      );

      // Select an option
      cy.get(
        '[data-cy="numeric-choice-radio-What is the degree of your paralysis?-primary-Monoplegia (paralysis of one limb)"]',
      ).click();

      cy.runA11yCheck();
    });
  });
});
