import React from 'react';
import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS } from './config';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import PaymentSummary from '../../../src/components/PaymentSummary';
import { createTestStore } from '../../../tests/util';
import { USER_TYPES } from '../../../src/utils/const';
import { CAA_DISCOUNTS_VALUE, DISCOUNT_CODES, DISCOUNTS_VALUE } from '../../../src/utils/discounts';

const screenSizes = [
  'iphone-6',
  [1920, 1080],
];

function getPriceNumber(text) {
  return parseFloat(text.trim().match(/[\d.]+/)[0]);
}

function roundTo2digits(number) {
  return Number(number.toFixed(2));
}

function onSameLine(field, value) {
  cy.contains(field).parent().contains(value);
}

const DISCOUNT_JOINT = DISCOUNTS_VALUE[DISCOUNT_CODES.JOINT_DISCOUNT_V2] / 100;
const DISCOUNT_CAA = DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_DISCOUNT] / 100;

describe('<PaymentSummary />', () => {
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    it(`${theme} - joint discount`, () => {
      cy.linkRoutes();
      if (theme === 'cibc') {
        // do nothing - we don't have official UI for CIBC yet;
      } else {
        const { store, state } = createTestStore(STATES_ENUM.JOINT);
        cy.setTenantConfigByTheme(theme);
        cy.setResolution('macbook-13');
        cy.mount(<PaymentSummary userType={USER_TYPES.PRIMARY} />, { reduxStore: store, theme });
        let enable_digital_consent;
        cy.window()
          .then((win) => {
            enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
          })
          .then(() => {
            if (enable_digital_consent) {
              let priceTL = 0;
              cy.contains('$650,000 over 30 years')
                .parent()
                .find('p')
                .eq(1)
                .invoke('text')
                .then((text) => {
                  priceTL = getPriceNumber(text);
                  onSameLine('Couples Savings (10% off first year)', `-$${roundTo2digits(priceTL * DISCOUNT_JOINT)}`);
                });
              cy.get('[data-cy=todayPaymentText]').find('p').invoke('text').then((text) => {
                expect(text).to.equal('Today\'s payment:$58.56');
              });
              cy.get('[data-cy=todayPaymentText]').find('div').invoke('text').then((text) => {
                expect(text).to.equal(`$${roundTo2digits(priceTL * (1 - DISCOUNT_JOINT))}`);
              });
            }
          });
      }
    });
  });

  it(`PM affiliate discount`, () => {
    cy.linkRoutes();
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_POLICYME_PARTNER);
    const theme = 'policyme_original';
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.mount(<PaymentSummary userType={USER_TYPES.PRIMARY} />, { reduxStore: store, theme });
    let enable_digital_consent;
    cy.window()
      .then((win) => {
        enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
      })
      .then(() => {
        if (enable_digital_consent) {
          cy.contains('$650,000 over 25 years')
            .parent()
            .find('p')
            .eq(1)
            .invoke('text')
            .then((text) => {
              const priceTL = getPriceNumber(text);
              onSameLine('First 2 months:', 'FREE');
              onSameLine('Total due on Feb 05:', roundTo2digits(priceTL));
              onSameLine('Total Today:', '$0.00');
            });
        }
      });
  });

  it(`joint & CAA membership discount`, () => {
    cy.linkRoutes();
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_CAA_MEMBERSHIP);
    const theme = 'QUE';
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.mount(<PaymentSummary userType={USER_TYPES.PRIMARY} />, { reduxStore: store, theme });
    let enable_digital_consent;
    cy.window()
      .then((win) => {
        enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
      })
      .then(() => {
        if (enable_digital_consent) {
          cy.contains('$500,000 over 30 years')
            .parent()
            .find('p')
            .eq(1)
            .invoke('text')
            .then((text) => {
              const priceTL = parseFloat(text.trim().match(/[\d.]+/)[0]);
              onSameLine('Couples Savings (10% off first year)', `-$${roundTo2digits(DISCOUNT_JOINT * priceTL)}`);
              onSameLine('Before savings', roundTo2digits(priceTL * (1 - DISCOUNT_JOINT)));
              onSameLine('CAA Savings (10%)', roundTo2digits(priceTL * DISCOUNT_CAA));
              onSameLine("Today's payment:", `$${roundTo2digits(priceTL * (1 - DISCOUNT_JOINT - DISCOUNT_CAA))}`);
            });
        }
      });
  });
});
