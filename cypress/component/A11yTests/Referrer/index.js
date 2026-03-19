import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import {
  CRM_LIFE_SESSION_FIELDS,
  ROUTES,
  USER_LEAD_SOURCES_VALUES,
} from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import Referrer from '../../../../src/pages/application/Referrer';
import { updateMetadata } from '../../../../src/NewActions/metadata';

describe('Referrer Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = ROUTES.APPLICATION_REFERRER;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Referrer Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        cy.setTenantConfigByTheme(tenant_theme);

        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Referrer />, { reduxStore: store,
            theme: tenant_theme },
        );

        cy.runA11yCheck();

        store.dispatch(updateMetadata(
          CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE,
          USER_LEAD_SOURCES_VALUES.OTHER.value,
        ));

        cy.runA11yCheck();

        store.dispatch(updateMetadata(
          CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE,
          '',
        ));
      });
      it(`Referrer Aura Page ${tenant_theme} theme validation test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        cy.setTenantConfigByTheme(tenant_theme);

        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Referrer />, { reduxStore: store,
            theme: tenant_theme },
        );

        store.dispatch(updateMetadata(
          CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE,
          USER_LEAD_SOURCES_VALUES.OTHER.value,
        ));

        cy.get('[data-cy="submit"]')
          .last()
          .click()
          .then(() => {
            cy.get('[data-cy="referrerOther"]')
              .should('have.attr', 'aria-invalid', 'true');
          });

        cy.runA11yCheck();
      });
    });
  });
});
