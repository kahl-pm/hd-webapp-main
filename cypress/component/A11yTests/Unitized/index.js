import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import { updateMetadata } from '../../../../src/NewActions/metadata';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../../../src/NewActions/household';
import { updateSessionHouseholdPropPrimary } from '../../../../src/NewActions/session';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';

describe('Unitized Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/97';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/97';

  const AURA_QUESTION = {
    aura_response: {
      _links: {
        section: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6f8896d1-d739-44ec-a3f3-81b6969b8a90/sections/0',
        },
        self: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6f8896d1-d739-44ec-a3f3-81b6969b8a90/questions/97',
        },
        sessionStatus: {
          completed: false,
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6f8896d1-d739-44ec-a3f3-81b6969b8a90/status',
          submitted: false,
        },
      },
      constraints: {
        availableUnits: [
          {
            decimalPrecision: 0,
            label: 'feet/inches',
            symbolParts: [
              'ft',
              'in',
            ],
            unitSymbol: 'ft_in',
            validationRanges: [
              {
                lower: 3,
                upper: 12,
              },
              {
                lower: 0,
                upper: 11,
              },
            ],
          },
          {
            decimalPrecision: 2,
            label: 'centimeters',
            symbolParts: [
              'cm',
            ],
            unitSymbol: 'cm',
            validationRanges: [
              {
                lower: 91,
                upper: 394,
              },
            ],
          },
        ],
        canBeUnknown: false,
        componentType: 'TextInput',
      },
      context: [],
      externalId: '10000',
      helpText: '',
      id: 97,
      isAnswered: false,
      richHelpText: '',
      richText: '<span>What is your height?</span>',
      text: 'What is your height?',
      type: 'UNITIZED',
    },
    question_id: 97,
    submitted: false,
    section_id: 1,
  };

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Unitized Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
      });

      it(`Unitized Aura Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        // Make aura_response the question object from your disclosure redux state question
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.SubmitForm();
        cy.get('[data-cy="available-unit-What is your height?-primary"]').should('exist');
        cy.contains('Enter a value').should('exist');
        cy.runA11yCheck();
      });

      it(`Unitized Aura Page ${tenant_theme} theme a11y test with menu open`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );
        cy.get('[data-cy="available-unit-What is your height?-primary"]').click();
        cy.contains('centimeters').should('exist');
        cy.runA11yCheck();
      });

      it(`Unitized Aura Page ${tenant_theme} theme a11y test with decimal input`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );
        cy.get('[data-cy="available-unit-What is your height?-primary"]').click();
        cy.contains('centimeters').click();
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').type('100.586');
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').should('have.value', '100.59');
        cy.runA11yCheck();
      });

      it(`Unitized Aura Page ${tenant_theme} theme a11y test with number input`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').type('44');
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').should('have.value', '44');
        cy.get('[data-cy="unitized-input-What is your height?-1-primary"]').type('1.1');
        cy.get('[data-cy="unitized-input-What is your height?-1-primary"]').should('have.value', '11');
        cy.runA11yCheck();
      });

      it(`Unitized Aura Page ${tenant_theme} theme a11y test with too low and too high errors`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        // Make aura_response the question object from your disclosure redux state question
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(97, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').type('1');
        cy.get('[data-cy="unitized-input-What is your height?-0-primary"]').should('have.value', '1');
        cy.get('[data-cy="unitized-input-What is your height?-1-primary"]').type('15');
        cy.get('[data-cy="unitized-input-What is your height?-1-primary"]').should('have.value', '15');
        cy.SubmitForm();
        cy.contains('Too low').should('exist');
        cy.contains('Too high').should('exist');
        cy.runA11yCheck();
      });
    });
  });
});
