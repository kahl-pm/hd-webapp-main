import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';

const testInputs = [
  {
    routes: '/life/intent',
    showToggle: true,
  },
  {
    routes: '/ci/intent',
    showToggle: true,
  },
  {
    routes: '/recommendation',
    showToggle: true,
  },
  {
    routes: '/life/quotes',
    showToggle: true,
  },
  {
    routes: '/ci/quotes',
    showToggle: true,
  },
  {
    routes: '/life/life-insurance-quotes',
    showToggle: true,
  },
  {
    routes: '/ci/life-insurance-quotes',
    showToggle: true,
  },
  {
    routes: '/life/life-insurance-quotes-continued',
    showToggle: true,
  },
  {
    routes: '/ci/life-insurance-quotes-continued',
    showToggle: true,
  },
  {
    routes: '/mortgage-quotes',
    showToggle: true,
  },
  {
    routes: '/questions/intro',
    showToggle: true,
  },
  {
    routes: '/questions/partner',
    showToggle: true,
  },
  {
    routes: '/questions/kids',
    showToggle: true,
  },
  {
    routes: '/questions/kids-housing',
    showToggle: true,
  },
  {
    routes: '/questions/kids-education',
    showToggle: true,
  },
  {
    routes: '/questions/birthdate',
    showToggle: true,
  },
  {
    routes: '/questions/gender',
    showToggle: true,
  },
  {
    routes: '/questions/smoke',
    showToggle: true,
  },
  {
    routes: '/questions/health',
    showToggle: true,
  },
  {
    routes: '/questions/income',
    showToggle: true,
  },
  {
    routes: '/questions/residence',
    showToggle: true,
  },
  {
    routes: '/questions/existing-policies',
    showToggle: true,
  },
  {
    routes: '/questions/existing-coverage',
    showToggle: true,
  },
  {
    routes: '/questions/savings',
    showToggle: true,
  },
  {
    routes: '/questions/debts',
    showToggle: true,
  },
  {
    routes: '/questions/expenses',
    showToggle: true,
  },
  {
    routes: '/questions/email',
    showToggle: true,
  },
  {
    routes: '/application/citizenship',
    showToggle: false,
  },
  {
    routes: '/application/birth-location',
    showToggle: false,
  },
  {
    routes: '/application/primary/full-address',
    showToggle: false,
  },
  {
    routes: '/application/employment-income-annual',
    showToggle: false,
  },
  {
    routes: '/application/employment-income-annual-self',
    showToggle: false,
  },
  {
    routes: '/application/employment-income-annual-partner',
    showToggle: false,
  },
  {
    routes: '/application/finances',
    showToggle: false,
  },
  {
    routes: '/application/existing-policies',
    showToggle: false,
  },
  {
    routes: '/application/replace-existing-policies',
    showToggle: false,
  },
  {
    routes: '/application/pending-policies',
    showToggle: false,
  },
  {
    routes: '/application/primary-transition',
    showToggle: false,
  },
  {
    routes: '/application/common-primary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/application/common-secondary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/application/primary/primary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/application/primary/secondary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/application/partner-email',
    showToggle: false,
  },
  {
    routes: '/application/partner-info',
    showToggle: false,
  },
  {
    routes: '/application/partner-same-address',
    showToggle: false,
  },
  {
    routes: '/application/contact',
    showToggle: false,
  },
  {
    routes: '/application/referrer',
    showToggle: false,
  },
  {
    routes: '/application/interest',
    showToggle: false,
  },
  {
    routes: '/application/primary/disclosure-integration/0',
    showToggle: false,
  },
  {
    routes: '/application/consent',
    showToggle: false,
  },
  {
    routes: '/aura-start-error',
    showToggle: false,
  },
  {
    routes: '/docusign/application/primary/callback',
    showToggle: false,
  },
  {
    routes: '/policy/get-link/unsuccessful',
    showToggle: false,
  },
  {
    routes: '/policy/get-link/not-found',
    showToggle: false,
  },
  {
    routes: '/policy/access-code',
    showToggle: false,
  },
  {
    routes: '/policy/access-code/expired',
    showToggle: false,
  },
  {
    routes: '/policy/access-code/unsuccessful',
    showToggle: false,
  },
  {
    routes: '/approved/primary/payment-received',
    showToggle: false,
  },
  {
    routes: '/approved',
    showToggle: false,
  },
  {
    routes: '/approved/primary/common-primary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/approved/primary/common-secondary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/approved/primary/primary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/approved/primary/secondary-beneficiaries',
    showToggle: false,
  },
  {
    routes: '/approved/primary/review-esign-policy',
    showToggle: false,
  },
  {
    routes: '/approved/primary/ci-add-on',
    showToggle: false,
  },
  {
    routes: '/approved/primary/payment-plans',
    showToggle: false,
  },
  {
    routes: '/approved/primary/payment-form',
    showToggle: false,
  },
  {
    routes: '/approved/primary/thankyou',
    showToggle: false,
  },
  {
    routes: '/verification',
    showToggle: false,
  },
  {
    routes: '/verification-error/expired',
    showToggle: false,
  },
  {
    routes: '/magic-link/callback',
    showToggle: false,
  },
];

const DummyComponent = () => <div>dummy</div>;

describe('Language Toggle Nav bar A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  describe('Desktop View', () => {
    it(`Language Toggle Nav bar ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, `/life/intent`);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route
          path={'/life/intent'}
          component={DummyComponent}
        />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: ['/life/intent'],
          },
        },
      );
      cy.runA11yCheck();
    });

    it(`Language Toggle Nav bar ${tenant_theme} theme shows toggle on certain routes`, () => {
      testInputs.forEach(({ routes, showToggle }) => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, `${routes}`);
        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution('macbook-13');
        cy.mountFullAppWithNavBar(
          <Route
            path={routes}
            component={DummyComponent}
          />, {
            reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [routes],
            },
          },
        );
        if (showToggle) {
          cy.get('[data-cy="language-toggle"]')
            .should('have.text', 'FR')
            .click();
          cy.get('[data-cy="language-toggle"]')
            .should('have.text', 'EN');
        } else {
          cy.get('[data-cy="language-toggle"]').should('not.exist');
        }
      });
    });
  });
});
