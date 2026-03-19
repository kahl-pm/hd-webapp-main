import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import PartnerSameAddress from '../../../../src/pages/application/PartnerSameAddress';

describe('Partner same address Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/application/partner-same-address';
  const INITIALROUTERENTRY = '/application/partner-same-address';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
  
    describe(`${device} View`, () => {
      it(`Existing Coverage Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
  
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_SAME_ADDRESS} component={PartnerSameAddress} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );
  
        cy.runA11yCheck();
      });
  
      it(`Existing Coverage Page ${tenant_theme} theme a11y test with yes clicked`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
  
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_SAME_ADDRESS} component={PartnerSameAddress} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );
  
        cy.get('[data-cy=partner_same_address-Y]').click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with no clicked`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
  
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_SAME_ADDRESS} component={PartnerSameAddress} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );
  
        cy.get('[data-cy=partner_same_address-N]').click();
        cy.runA11yCheck();
      });

      it(`Existing Coverage Page ${tenant_theme} theme a11y test with nothing entered error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
  
        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_PARTNER_SAME_ADDRESS} component={PartnerSameAddress} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
            } },
        );

        // submitPartnerSameAddress
  
        cy.get('[data-cy=submitPartnerSameAddress]')
          .last()
          .click();
        cy.runA11yCheck();
      });
    });
  });
});
