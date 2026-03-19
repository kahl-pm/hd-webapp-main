import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import DigitalConsentDashboardPage from '../../../../src/pages/DigitalConsentDashboardPage';
import { checkDomElements } from '../../../helper';

describe('Digital Consent Decesion Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Life decision ${device} Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, 'life/digital-consent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <DigitalConsentDashboardPage />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      checkDomElements([
        { dataCy: 'Decision Card life', shouldExist: true },
        { dataCy: 'ci-addon-card', shouldExist: true },
      ]);

      cy.get('[data-cy="Decision Card life"]').within(() => {
        cy.get('[data-cy="review-exclusions"]').click();
      });
      cy.runA11yCheck();
    });
  });

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Life decision ${device} Page Edit Coverage modal ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, 'life/digital-consent');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <DigitalConsentDashboardPage />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      checkDomElements([
        { dataCy: 'Decision Card life', shouldExist: true },
        { dataCy: 'ci-addon-card', shouldExist: true },
      ]);
      cy.runA11yCheck();

      cy.get('[data-cy="Decision Card life"]').within(() => {
        cy.get('[data-cy="edit-coverage"]').click();
      });
      cy.runA11yCheck();
    });
  });
});
