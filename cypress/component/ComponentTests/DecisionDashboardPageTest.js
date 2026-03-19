import { TENANT_FLAGS, THEMES } from '@policyme/global-libjs-utils';
import React from 'react';

import DecisionDashboardPage from '../../../src/pages/DecisionDashboardPage';
import { TENANT_SUBORGANIZATION_CODES } from '../../../src/tenant/consts';
import DigitalConsentDashboardPage from '../../../src/pages/DigitalConsentDashboardPage';
import { PM_PRODUCT_PREFIX } from '../../../src/utils/const';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS } from './config';

function getPriceFromElement(selector) {
  return cy.get(selector).invoke('text').then((priceText) => {
    return parseFloat(priceText.trim().match(/[\d.]+/)[0]);
  });
}

describe('<DecisionDashboardPage />', () => {
  // percy snapshot
  const theme = THEMES.BCL;
  it(`${theme} - match snapshot`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT);
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(<DecisionDashboardPage />, { reduxStore: store, theme });
    cy.window()
      .then(() => {
        cy.get(`[data-cy="Decision Card ${PM_PRODUCT_PREFIX.LIFE}"]`).should('exist');
        cy.get('.ciAddonContainer').should('exist');
        cy.percySnapshotWithBreakpoints(`Decision Page test${theme}`);
        cy.get('[data-cy="edit-coverage"]').click();
        cy.percySnapshotWithBreakpoints(`Decision Page test${theme} editmodal`);
      });
  });
});

describe('<DigitalConsentDashboardPage />', () => {
  const isSuborgTheme = (t) => Object.values(TENANT_SUBORGANIZATION_CODES).includes(t);
  // percy snapshot
  beforeEach(() => {
    cy.linkRoutes();
    cy.intercept('POST', 'https://r.stripe.com/b', {
      statusCode: 200,
      body: {
        data: { success: 1 },
      },
    }).as('postStripe');
    cy.intercept('GET', /\/api\/(life|ci)-quotes\/v(\d+)\/*/, { cache: false }).as('quotes');
    cy.intercept('POST', '**/api/global-payments/v1/user/*/customer', {
      cache: false,
      statusCode: 200,
      body: {
        data: {
          stripe_customer_id: 'cus_111111111',
        },
      },
    }).as('createCustomer');
    cy.intercept('POST', '**/api/global-payments/v1/user/*/customer/*/setup-intent', {
      cache: false,
      statusCode: 200,
      body: {
        data: {
          setup_intent_client_secret: 'seti_aaaaa_secret_bbbb',
        },
      },
    }).as('setupIntent');
    cy.intercept('PATCH', '**/api/life-main/v3/life_policies/*', {
      statusCode: 200,
      body: {
        data: { success: 1 },
      },
    }).as('patchLifePolicies');
    cy.intercept('PATCH', '**/api/ci-main/v1/ci_apps/**', {
      statusCode: 200,
      body: {
        data: { success: 1 },
      },
    }).as('updateCiAppVersInfo');
  });
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    it(`${theme} - match snapshot`, () => {
      if (theme === 'cibc') {
        // do nothing - we don't have official UI for CIBC yet;
      } else {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT);
        cy.setTenantConfigByTheme(theme);
        cy.setResolution('macbook-13');
        cy.mountFullAppWithNavBar(<DigitalConsentDashboardPage />, { reduxStore: store, theme });
        cy.intercept('GET', /\/api\/(life|ci)-quotes\/v(\d+)\/*/, { cache: false }).as('quotes');
        let enable_digital_consent;
        cy.window()
          .then((win) => {
            enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
          })
          .then(() => {
            if (enable_digital_consent) {
              cy.wait('@createCustomer', { timeout: 10000 });
              cy.wait('@setupIntent', { timeout: 10000 });
              cy.wait(1000);
              cy.get(`[data-cy="Decision Card ${PM_PRODUCT_PREFIX.LIFE}"]`).should('exist');
              if (theme !== THEMES.policyme_original && !isSuborgTheme(theme)) {
                cy.get(`[data-cy="ci-addon-card"]`).should('not.exist');
                cy.get(`[data-cy="ci-addon-actionable-card"]`).should('exist');
              } else {
                cy.get(`[data-cy="ci-addon-card"] [name="switch"]`).click();
                cy.get('[data-cy="skip-ci-modal"]').click();
              }
              cy.get('#payment-summary-accordion-header').parent().parent().as('paymentSummary');

              // test summary
              if (theme === 'policyme_original' || isSuborgTheme(theme)) {
                cy.get('@paymentSummary').should('contain', 'Term Life Insurance');
                cy.get('@paymentSummary').should('contain', '$425,000 over 20 years');
                cy.get('@paymentSummary').should('not.contain', 'Critical Illness Insurance');
                getPriceFromElement(
                  '[data-cy="Decision Card life"] [data-cy="approved-rate-price"]',
                ).then((priceTL) => {
                  getPriceFromElement('[data-cy="submit"]').then(
                    (priceTotal) => {
                      expect(priceTotal).to.equal(priceTL);
                    },
                  );
                });
                cy.get(`[data-cy="ci-addon-card"] [name="switch"]`).click();
              } else {
                cy.get('[data-cy="skip-ci"]').click();
                cy.get('[data-cy="skip-ci-modal"]').click();
              }

              cy.get('body').then(($body) => {
                if ($body.find('#ci-cross-sell-accordion-header').length) {
                  cy.get('#ci-cross-sell-accordion-header').should('contain', 'More Details').click();
                }
              });
              cy.percySnapshotWithBreakpoints(`Decision Page test ${theme}`);
              cy.get('[data-cy="edit-coverage"]').eq(0).click();
              cy.percySnapshotWithBreakpoints(`Decision Page test ${theme} editmodal`);

              if (theme === 'policyme_original') {
                cy.DesiredCoverage(20, 30); // 700k 30
                cy.get('[data-cy="update-coverage"]').click();
                cy.get('@paymentSummary').should('contain', '$700,000 over 30 years'); // TL

                // ci add on card
                cy.get('#ci-cross-sell-accordion-header').should('contain', 'More Details').click();
                cy.get('[data-cy="ci-addon-card"] label').should('contain', 'Add Critical Illness Insurance').click();
                cy.get('[data-cy="add-ci-modal"]').click();

                cy.get('@paymentSummary').should('contain', 'Critical Illness Insurance');
                cy.get('@paymentSummary').should('contain', '$20,000 over 20 years'); // CI

                getPriceFromElement('[data-cy="Decision Card life"] [data-cy="approved-rate-price"]').then((priceTL) => {
                  getPriceFromElement('[data-cy="ci-addon-card"] [data-cy="approved-rate-price"]').then((priceCI) => {
                    getPriceFromElement('[data-cy="submit"]').then((priceTotal) => {
                      expect(priceTotal).to.equal(priceTL + priceCI);
                    });
                  });
                });
              }
            }
          });
      }
    });
  });
});

describe('<DecisionDashboardPage /> Exclusive Perk', () => {
  const theme = THEMES.BCL;
  it(`${theme} - match snapshot`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_POLICYME_PARTNER);
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(<DecisionDashboardPage />, { reduxStore: store, theme });
    cy.get('[data-cy=exclusivePerkDiscountText]:visible')
      .should('have.length', 1)
      .should('have.text', 'First 2 months:');
    cy.get('[data-cy=exclusivePerkDiscountValue]:visible')
      .should('have.length', 1)
      .should('have.text', 'FREE');
  });
});
