import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import StripePaymentForm from '../../../../src/pages/approved/StripePaymentForm';
import { PaymentsProvider } from '../../../../src/providers/PaymentProvider';

describe('StripePaymentForm Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  beforeEach(() => {
    cy.intercept("POST", "**/api/global-payments/v1/user/*/customer", {
      statusCode: 200,
      body: {
        data: {
          stripe_customer_id: "cus_111111111",
        },
      },
    }).as("createCustomer");
    cy.intercept("POST", "**/api/global-payments/v1/user/*/customer/*/setup-intent", {
      statusCode: 200,
      body: {
        data: {
          setup_intent_client_secret: "seti_aaaaa_secret_bbbb",
        },
      },
    }).as("setupIntent");
  });

  it(`StripePaymentForm Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI, '/life/approved/primary/payment-form');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    
    cy.mountFullAppWithNavBar(
      <PaymentsProvider>
        <StripePaymentForm />
      </PaymentsProvider>,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.wait("@createCustomer", 10000);
    cy.wait("@setupIntent", 10000);
    cy.runA11yCheck();
    cy.SubmitForm();
    cy.runA11yCheck();
  });

  it(`StripePaymentForm Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/ci/start-app');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <PaymentsProvider>
        <StripePaymentForm />
      </PaymentsProvider>,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.wait("@createCustomer", 10000);
    cy.wait("@setupIntent", 10000);
    cy.runA11yCheck();
    cy.SubmitForm();
    cy.runA11yCheck();
  });
});
