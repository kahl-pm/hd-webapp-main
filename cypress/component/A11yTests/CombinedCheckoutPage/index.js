import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import CombinedCheckoutPage from '../../../../src/pages/health-and-dental/CombinedCheckoutPage';

describe('Combined Checkout Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Combined Checkout Page ${tenant_theme} theme a11y test for device ${device}`, () => {
      const { store } = createTestStore(STATES_ENUM.DEV_INIT, '/combined-checkout-hd');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <CombinedCheckoutPage />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.contains('Your coverage will officially start on the date');

      // check if the faq title is present
      cy.get('[data-cy="effective-date-faq-title"]').should('exist');

      // check if the faq items are present
      cy.get('[id="directBilling"]').should('exist');
      cy.get('[id="startPlan"]').should('exist');
      cy.get('[id="paymentDate"]').should('exist');
      
      cy.runA11yCheck();
    });
  });
});
