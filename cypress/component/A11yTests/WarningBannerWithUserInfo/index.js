import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import ReduxStateMother from '../../../../tests/ReduxStateMother';
import { createNewStore } from '../../../../src/store';
import WarningBannerWithUserInfo from '../../../../src/components/WarningBannerWithUserInfo';

const createAdvisorModeStore = (userInfo = {}) => {
  const stateMother = new ReduxStateMother(STATES_ENUM.DEFAULT);

  stateMother.metadata.setMetadataProp('externalAdvisorMode', true);
  stateMother.primary.lifeApp.external_advisor_id = 'advisor123';

  if (userInfo.firstName) stateMother.primary.household.firstName = userInfo.firstName;
  if (userInfo.lastName) stateMother.primary.household.lastName = userInfo.lastName;
  if (userInfo.email) stateMother.primary.household.email = userInfo.email;

  const store = createNewStore(stateMother.toJson());
  const state = store.getState();

  return { store, state };
};

const createBackdoorModeStore = (userInfo = {}) => {
  const stateMother = new ReduxStateMother(STATES_ENUM.DEFAULT);

  stateMother.primary.session.is_logged_in = true;

  if (userInfo.firstName) stateMother.primary.household.firstName = userInfo.firstName;
  if (userInfo.lastName) stateMother.primary.household.lastName = userInfo.lastName;
  if (userInfo.email) stateMother.primary.household.email = userInfo.email;

  const store = createNewStore(stateMother.toJson());
  const state = store.getState();

  cy.setCookie('backdoor_flag', 'true');
  cy.setCookie('portal_owner_id', 'portal123');

  return { store, state };
};

describe('WarningBannerWithUserInfo Component A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  beforeEach(() => {
    cy.clearCookies();
  });

  ['macbook-13'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`WarningBannerWithUserInfo - Advisor mode with user info`, () => {
        const { store } = createAdvisorModeStore({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        });

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <WarningBannerWithUserInfo />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );

        cy.contains('You are in Advisor Mode').should('be.visible');
        cy.contains('Logged in as John Doe (john.doe@example.com)').should('be.visible');

        cy.runA11yCheck();
      });

      it(`WarningBannerWithUserInfo - Backdoor mode with user info`, () => {
        const { store } = createBackdoorModeStore({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        });

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <WarningBannerWithUserInfo />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );

        cy.contains('You are in Backdoor Mode').should('be.visible');
        cy.contains('Logged in as Jane Smith (jane.smith@example.com)').should('be.visible');

        cy.runA11yCheck();
      });

      it(`WarningBannerWithUserInfo - Advisor mode without user info`, () => {
        const { store } = createAdvisorModeStore();

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <WarningBannerWithUserInfo />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );

        cy.contains('You are in Advisor Mode').should('be.visible');
        cy.contains('Logged in as').should('not.exist');

        cy.runA11yCheck();
      });

      it(`WarningBannerWithUserInfo - Neither mode (should not show)`, () => {
        const { store } = createTestStore(STATES_ENUM.DEFAULT, '/');

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
        cy.mountFullAppWithNavBar(
          <WarningBannerWithUserInfo />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );

        cy.contains('You are in').should('not.exist');

        cy.runA11yCheck();
      });
    });
  });
});
