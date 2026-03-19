import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import EmploymentIncomeAnnual from '../../../../src/pages/application/EmploymentIncomeAnnual';
import { updateMetadata } from '../../../../src/NewActions/metadata';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../../../src/NewActions/household';
import { updateSessionHouseholdPropPrimary } from '../../../../src/NewActions/session';
import { updateUserControlProp } from '../../../../src/NewActions/userControl';

describe('Partner Info Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const SELF_URL = '/application/employment-income-annual-self';
  const PARTNER_URL = '/application/employment-income-annual-partner';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Employment Income Self Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, SELF_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF} component={EmploymentIncomeAnnual} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [SELF_URL],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Employment Income Self with Joint Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, SELF_URL);
        store.dispatch(updateHouseholdPropSecondary('firstName', 'PartnerName'));
        store.dispatch(updateUserControlProp('hasPartnerApplication', true));
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF} component={EmploymentIncomeAnnual} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [SELF_URL],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Employment Income Partner Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, PARTNER_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER} component={EmploymentIncomeAnnual} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [PARTNER_URL],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Employment Income Self Page What If Modal ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, SELF_URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        console.log(store.getState());

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF} component={EmploymentIncomeAnnual} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [SELF_URL],
            } },
        );

        cy.get('[name="whyIncomes"]').click();
        cy.runA11yCheck();
      });
    });
  });
});
