import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import PaymentReceived from '../../../../src/components/StripePayments/PaymentReceived';

describe('Payment Received A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/approved/primary/payment-received';


  ['macbook-13', 'iphone-6+'].forEach((device) => {
  
    describe(`${device} View`, () => {
      it(`Payment Received Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);
  
        cy.mountFullAppWithNavBar(
          <PaymentReceived />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.contains('Thank you, your payment has been received!');
        cy.runA11yCheck();
      });
    });
  });
});
