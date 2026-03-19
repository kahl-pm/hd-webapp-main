import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import PaymentInProgress from '../../../../src/pages/approved/PaymentInProgress';

describe('Payment In Progress A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/approved/primary/payment-in-progress';


  ['macbook-13', 'iphone-6+'].forEach((device) => {

    describe(`${device} View`, () => {
      it(`Payment In Progress Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER, URL);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <PaymentInProgress />,
          {
            reduxStore: store,
            theme: tenant_theme,
          },
        );
        cy.contains('Processing your payment...');
        cy.runA11yCheck();
      });
    });
  });
});