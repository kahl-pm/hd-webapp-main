import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { BUYING_METHOD, PM_PRODUCT_PREFIX, ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import FullAddress from '../../../../src/pages/application/FullAddress';
import { updateHouseholdPropPrimary } from '../../../../src/NewActions/household';
import { makeUpdateProductAppProp } from '../../../../src/NewActions/helpers/productApp';

describe('Full Address Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/application/primary/full-address';
  const INITIALROUTERENTRY = '/application/primary/full-address';

  beforeEach(() => {
    cy.intercept('PATCH', '/api/global-main/v1/household_infos/8a1aeadd-d177-4100-bc05-213e51d8ed21/0', {
      statusCode: 200,
      body: { success: true },
    }).as('patch');

    cy.intercept('POST', '/api/global-main/v1/crm', {
      statusCode: 200,
      body: { success: true },
    }).as('patch');
  });

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Full Address Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_FULL_ADDRESS} component={FullAddress} />,
          { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Full Address Page ${tenant_theme} theme a11y test with required errors`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_FULL_ADDRESS} component={FullAddress} />,
          { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.get('[data-cy=address-submit]')
          .last()
          .click();
        cy.runA11yCheck();
      });

      it(`Full Address Page ${tenant_theme} theme a11y test with inputted fields`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        store.dispatch(updateHouseholdPropPrimary('province', 'ON'));
        store.dispatch(updateHouseholdPropPrimary('country', 'CA'));
        store.dispatch(updateHouseholdPropPrimary('postalCode', 'M5V 2L7'));
        store.dispatch(updateHouseholdPropPrimary('city', 'Toronto'));
        store.dispatch(updateHouseholdPropPrimary('address1', '123 Main St'));
        store.dispatch(updateHouseholdPropPrimary('address2', 'Unit 123'));

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_FULL_ADDRESS} component={FullAddress} />,
          { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.runA11yCheck();
      });

      it(`Full Address Page ${tenant_theme} theme a11y test with hd province mismatch modal`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        store.dispatch(updateHouseholdPropPrimary('province', 'ON'));
        store.dispatch(updateHouseholdPropPrimary('country', 'CA'));
        store.dispatch(updateHouseholdPropPrimary('postalCode', 'M5V 2L7'));
        store.dispatch(updateHouseholdPropPrimary('city', 'Toronto'));
        store.dispatch(updateHouseholdPropPrimary('address1', '123 Main St'));
        store.dispatch(updateHouseholdPropPrimary('address2', 'Unit 123'));

        store.dispatch(updateHouseholdPropPrimary('healthcard_province', 'MN'));

        store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.CI, 'primary')('buying_method', ''));
        store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.LIFE, 'primary')('buying_method', ''));
        store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.HD, 'primary')('buying_method', BUYING_METHOD.STAND_ALONE));

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_FULL_ADDRESS} component={FullAddress} />,
          { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.get('[data-cy=address-submit]')
          .last()
          .click();
        cy.get('[data-cy="healthcardmismatchheader"]');
        cy.runA11yCheck();
      });

      // TODO: Reenable after getting PM_ENABLE_QUEBEC_NEEDS_ASSESSMENT
      // flag turned on in cypress mode
      // it(`Full Address Page ${tenant_theme} theme a11y test
      // with quebec needs assessment modal`, () => {
      //   const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      //   cy.setTenantConfigByTheme(tenant_theme);
      //   cy.setResolution(device);

      //   store.dispatch(updateHouseholdPropPrimary('province', 'QC'));
      //   store.dispatch(updateHouseholdPropPrimary('country', 'CA'));
      //   store.dispatch(updateHouseholdPropPrimary('postalCode', 'M5V 2L7'));
      //   store.dispatch(updateHouseholdPropPrimary('city', 'Toronto'));
      //   store.dispatch(updateHouseholdPropPrimary('address1', '123 Main St'));
      //   store.dispatch(updateHouseholdPropPrimary('address2', 'Unit 123'));

      //   store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.CI,
      // 'primary')('buying_method', ''));
      //   store.dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.LIFE,
      // 'primary')('buying_method', BUYING_METHOD.STAND_ALONE));
      //   store.dispatch(makeUpdateProductSessionProp('primary',
      // PM_PRODUCT_PREFIX.LIFE)('recmd_cov_amt', undefined));

      //   cy.mountFullAppWithNavBar(
      //     <Route path={ROUTES.APPLICATION_FULL_ADDRESS}
      // component={FullAddress} />, { reduxStore: store,
      //       theme: tenant_theme,
      //       routerProps: {
      //         initialEntries: [INITIALROUTERENTRY],
      //       } },
      //   );

      //   cy.get('[data-cy=address-submit]')
      //    .click();
      //   cy.get('[data-cy="quebecNeedsAssessmentModal"]');
      //   cy.runA11yCheck();
      // });

      it(`Full Address Page ${tenant_theme} theme a11y test with unsupported country modal`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        store.dispatch(updateHouseholdPropPrimary('province', 'ON'));
        store.dispatch(updateHouseholdPropPrimary('country', 'NZ'));
        store.dispatch(updateHouseholdPropPrimary('postalCode', 'M5V 2L7'));
        store.dispatch(updateHouseholdPropPrimary('city', 'Toronto'));
        store.dispatch(updateHouseholdPropPrimary('address1', '123 Main St'));
        store.dispatch(updateHouseholdPropPrimary('address2', 'Unit 123'));

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_FULL_ADDRESS} component={FullAddress} />,
          { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        cy.get('[data-cy=address-submit]')
          .last()
          .click();
        cy.get('[data-cy="ineligbleCountryModalHeader"]');
        cy.runA11yCheck();
      });
    });
  });
});
