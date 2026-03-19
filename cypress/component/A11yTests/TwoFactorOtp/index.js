import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import TwoFactorOtp from '../../../../src/pages/application/TwoFactorOtp';
import { createTestStore } from '../../../../tests/util';

describe('Two Factor Otp Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Two Factor Otp ${device} Page ${tenant_theme} theme a11y test`, () => {
      // Mock the verify-otp endpoint with controlled timing
      cy.intercept('POST', '**/api/global-accounts/v1/phone/verify-otp/*', {
        statusCode: 200,
        body: {
          success: true,
          num_otp_attempts_remaining: 3,
        },
        delay: 500, // 0.5 second delay to test loading states
      }).as('verifyOTP');

      // Mock the phone validation endpoint
      cy.intercept('POST', '**/api/global-accounts/v1/phone/validate/*', {
        statusCode: 200,
        body: {
          success: true,
        },
      }).as('validatePhone');

      const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/two-factor/verification');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.TWO_FACTOR_VERIFICATION_CODE} component={TwoFactorOtp} />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.TWO_FACTOR_VERIFICATION_CODE],
          },
        },
      );

      // Test button state during network request
      // First, enter an OTP code (assuming there's an input field)
      cy.get('[data-cy="verificationCode"]').type('123456');
      cy.get('[data-cy="login-submit"]').should('not.be.disabled');

      // Click the submit button and immediately check it's disabled
      cy.get('[data-cy="login-submit"]').click();

      // Assert button is disabled while request is pending
      cy.get('[data-cy="login-submit"]').should('be.disabled');

      // Wait for the network request to complete
      cy.wait('@verifyOTP');

      // Assert button is re-enabled after request completes
      cy.get('[data-cy="login-submit"]').should('not.be.disabled');

      cy.runA11yCheck();
    });
  });

  it(`Two Factor Otp Page ${tenant_theme} with failing request`, () => {
    // Mock the verify-otp endpoint with controlled timing
    cy.intercept('POST', '**/api/global-accounts/v1/phone/verify-otp/*', {
      statusCode: 400,
      body: {
        success: false,
        num_otp_attempts_remaining: 3,
      },
      delay: 750, // 0.75 second delay to test loading states
    }).as('verifyOTP');

    // Mock the phone validation endpoint
    cy.intercept('POST', '**/api/global-accounts/v1/phone/validate/*', {
      statusCode: 200,
      body: {
        success: true,
      },
    }).as('validatePhone');

    const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/two-factor/verification');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Route path={ROUTES.TWO_FACTOR_VERIFICATION_CODE} component={TwoFactorOtp} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTES.TWO_FACTOR_VERIFICATION_CODE],
        },
      },
    );

    // Test button state during network request
    // First, enter an OTP code (assuming there's an input field)
    cy.get('[data-cy="verificationCode"]').type('123456');
    cy.get('[data-cy="login-submit"]').should('not.be.disabled');

    // Click the submit button and immediately check it's disabled
    cy.get('[data-cy="login-submit"]').click();

    // Assert button is disabled while request is pending
    cy.get('[data-cy="login-submit"]').should('be.disabled');

    // Wait for the network request to complete
    cy.wait('@verifyOTP');

    // Assert button is re-enabled after request completes
    cy.get('[data-cy="login-submit"]').should('not.be.disabled');

    cy.runA11yCheck();
  });
});
