import React from 'react';
import { LOCALE, TENANT_FLAGS, test, TenantCodeType } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { AUTHORIZATION_TYPE, PLAN_TYPES, PM_PRODUCT_PREFIX } from '../../../src/utils/const';
import { DEFAULT_CONSENT_VERSIONS } from '../../../src/utils/consentVersion';
import {
  CHECKOUT_CONSENT_CTA,
  CustomisableCheckoutConsentBody,
} from '../../../src/components/DigitalConsentHtmlComponents/CheckoutConsent';
import { expectedCopyForPrice } from '../../support/ConsentText/CheckoutConsent';
import { validateConsentCopy } from '../../support/ConsentText';
import { updateMetadata } from '../../../src/NewActions/metadata';
import { TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS } from './digitalConsentConfig';

describe('<CustomisableCheckoutConsentBody />', () => {
  TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS.forEach((theme) => {
    Object.values(LOCALE).forEach((lang) => {
      it(`${theme} - ${lang} - check copy content`, () => {
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED);
        store.dispatch(updateMetadata('lang', lang));
        const tenant = test.getTenantFromTheme(theme);
        const consentVersions = DEFAULT_CONSENT_VERSIONS[tenant.code][PM_PRODUCT_PREFIX.LIFE];
        const lifeOrCiConsentVersion = consentVersions[AUTHORIZATION_TYPE.CHECKOUT_CONSENT];
        const price = '$10.32';
        const CheckoutConsentBodyValues = {
          b: chunks => <b>{chunks}</b>,
          br: <br />,
          p: msg => (<p data-cy="consent-text">{msg}</p>),
          span1: msg => (<span>{msg}</span>),
          planType: PLAN_TYPES.MONTHLY,
          totalAmtDiscountedDisplay: price,
        };
        const EXPECTED_COPY = expectedCopyForPrice(price, lang);
        cy.mount(
          <CustomisableCheckoutConsentBody
            mainProduct={PM_PRODUCT_PREFIX.LIFE}
            lifeOrCiConsentVersion={lifeOrCiConsentVersion}
            values={CheckoutConsentBodyValues}
            action={() => {}}
            checked={false}
          />,
          { reduxStore: store, theme },
        );
        cy.percySnapshotWithBreakpoints(`DigitalConsentCheckoutTest ${theme}`);
        let enable_digital_consent;
        cy.window()
          .then((win) => {
            enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
          })
          .then(() => {
            if (enable_digital_consent) {
              const expected = EXPECTED_COPY[tenant.code as TenantCodeType];
              expect(CHECKOUT_CONSENT_CTA[lifeOrCiConsentVersion].id).to.contain(expected.version);
              cy.get(`[data-cy="consent-block"]`)
                .invoke('text')
                .should((text) => validateConsentCopy(text, expected, lang));
            }
          });
      });
    });
  });
});
