import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import PartnerInfo from '../../../../src/pages/application/PartnerInfo';
import { updateMetadata } from '../../../../src/NewActions/metadata';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../../../src/NewActions/household';
import { updateSessionHouseholdPropPrimary } from '../../../../src/NewActions/session';

describe('Partner Info Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/application/partner-info';
  const INITIALROUTERENTRY = '/application/partner-info';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Partner Info Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropSecondary('email', ''));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_INFO} component={PartnerInfo} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Partner Info Page ${tenant_theme} theme a11y test with nothing entered error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropSecondary('email', ''));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_INFO} component={PartnerInfo} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.SubmitForm();
        cy.runA11yCheck();
      });

      it(`Partner Info Page ${tenant_theme} theme a11y test with dup partner email error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropPrimary('email', 'corner.byers+cyptest@policyme.com'));
        store.dispatch(updateHouseholdPropSecondary('email', 'corner.byers+cyptest@policyme.com'));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_INFO} component={PartnerInfo} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.SubmitForm();
        cy.runA11yCheck();
      });

      it(`Partner Info Page ${tenant_theme} theme a11y test with email check modal`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateMetadata('suggestedEmail', 'someemail@gmail.com'));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_INFO} component={PartnerInfo} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.runA11yCheck();
      });
    });
  });
});
