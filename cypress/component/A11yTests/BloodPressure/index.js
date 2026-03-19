// tests

import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import BLOOD_PRESSURE_QUESTION from './test_data';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';

describe('Blood Pressure Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/266';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/266';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Blood Pressure Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(234, BLOOD_PRESSURE_QUESTION));

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
            },
          },
        );

        cy.runA11yCheck();
      });

      it(`Blood Pressure Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(234, BLOOD_PRESSURE_QUESTION));

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
            },
          },
        );

        cy.SubmitForm();
        cy.get(`[data-cy="bloodPressure-systolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).should('exist');
        cy.contains('Please enter an answer').should('exist');
        cy.runA11yCheck();
      });

      it(`Blood Pressure Page ${tenant_theme} theme a11y test with input focused`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(234, BLOOD_PRESSURE_QUESTION));

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
            },
          },
        );

        cy.get(`[data-cy="bloodPressure-systolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).focus();
        cy.runA11yCheck();
      });

      it(`Blood Pressure Page ${tenant_theme} theme a11y test with multiple readings`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(234, BLOOD_PRESSURE_QUESTION));

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
            },
          },
        );

        // Input first reading
        cy.get(`[data-cy="bloodPressure-systolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).type('120');
        cy.get(`[data-cy="bloodPressure-diastolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).type('80');

        // Add a new reading
        cy.get('[data-cy="addReading"]').click();

        // Input second reading
        cy.get(`[data-cy="bloodPressure-systolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-1-primary"]`).type('130');
        cy.get(`[data-cy="bloodPressure-diastolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-1-primary"]`).type('85');

        cy.runA11yCheck();
      });

      it(`Blood Pressure Page ${tenant_theme} theme a11y test with invalid blood pressure`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(234, BLOOD_PRESSURE_QUESTION));

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
            },
          },
        );

        cy.get(`[data-cy="bloodPressure-systolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).type('70');
        cy.get(`[data-cy="bloodPressure-diastolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).type('120');

        cy.contains('Systolic Values cannot be less than or equal to diastolic values').should('exist');
        cy.runA11yCheck();

        cy.intercept('PATCH', '**/api/aura/v1/disclosure/session/**', {
          statusCode: 200,
          body: {},
        }).as('submitRequest');

        cy.SubmitForm();

        cy.contains('Systolic Values cannot be less than or equal to diastolic values').should('exist');

        // Assert that the form does not submit
        cy.get('@submitRequest.all').should('have.length', 0);

        cy.get(`[data-cy="bloodPressure-diastolic-${BLOOD_PRESSURE_QUESTION.aura_response.text}-0-primary"]`).clear().type('70');

        cy.contains('Systolic Values cannot be less than or equal to diastolic values', { timeout: 300 }).should('not.exist');
        cy.SubmitForm();

        // Assert that the form submits when data is good
        cy.get('@submitRequest.all').should('have.length', 1);
      });
    });
  });
});
