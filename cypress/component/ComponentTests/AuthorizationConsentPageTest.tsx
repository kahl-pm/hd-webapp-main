import React from 'react';
import { TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS } from './digitalConsentConfig';
import { TENANT_FLAGS, LOCALE, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import Authorization, { CONSENT_CTA, CONSENT_HEADER } from '../../../src/pages/application/Authorization';
import { createTestStore } from '../../../tests/util';
import { AURA_CONSENT_TYPES, DEFAULT_CONSENT_VERSIONS } from '../../../src/utils/consentVersion';
import { getMainProduct } from '../../../src/Selectors/helpers/productApp';
import { AUTHORIZATION_TYPE } from '../../../src/utils/const';
import { EXPECTED_CONSENT_VERSIONS } from '../../support/ConsentText/AuthorizationConsent';
import { EXPECTED_CONSENT_CTA_VERSIONS } from '../../support/ConsentText/AuthorizationConsentCTA';
import { validateConsentCopy } from '../../support/ConsentText';
import { updateMetadata } from '../../../src/NewActions/metadata';

describe('LIFE or CI Single <Authorization />', () => {
  TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS.forEach((theme) => {
    Object.values(LOCALE).forEach((lang) => {
      it(`${theme} - ${lang} - match snapshot`, () => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV);
        cy.setTenantConfigByTheme(theme);
        cy.setResolution('macbook-13');
        store.dispatch(updateMetadata('lang', lang));
        cy.mount(<Authorization />, { reduxStore: store, theme });
        cy.percySnapshotWithBreakpoints(`AuthorizationConsentPageTest ${theme}`);
        let enable_digital_consent;
        let tenant;
        cy.window()
          .then((win) => {
            enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
            tenant = win.__policyme.TENANT.name;
            console.log('tenant', win.__policyme.TENANT);
          })
          .then(() => {
            const tenantCode:TenantCodeType = TENANTS_NAME_CODES_MAPPING[tenant];
            const tenantExpected = EXPECTED_CONSENT_VERSIONS[tenantCode];
            const journeyType = enable_digital_consent
              ? AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY
              : AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY;
            const expectedCopy = tenantExpected[journeyType].primary;
            const product = getMainProduct(state, state.userControl.currentUser);
            const consentVersions =
              DEFAULT_CONSENT_VERSIONS[TENANTS_NAME_CODES_MAPPING[tenant]][product];
            const docusignJourney =
              consentVersions[AUTHORIZATION_TYPE.MIB][AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY];
            const digitalConsentJourney =
              consentVersions[AUTHORIZATION_TYPE.MIB][AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY];

            // INTENTIONALLY FRAGILE TEST
            // If these tests fail, you might have wrongly modified
            // the id of the key specified in Authorization.js
            // If you did not bump any version constants and you intended to change the copy,
            // you should be creating a new key instead,
            // and bump the version number of the DEFAULT_CONSENT_VERSIONS for MIB type
            // instead of modifying the existing key
            // If you've correctly bumped the version constants,
            // update the tests to match the version
            // Assert the default consent copy versions without tenant customisation
            expect(CONSENT_HEADER[digitalConsentJourney].id).to.contain(
              EXPECTED_CONSENT_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY].primary.version,
            );
            expect(CONSENT_HEADER[docusignJourney].id).to.contain(
              EXPECTED_CONSENT_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY].primary.version,
            );
            expect(CONSENT_CTA[digitalConsentJourney].id).to.contain(
              EXPECTED_CONSENT_CTA_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY].primary.version,
            );
            expect(CONSENT_CTA[docusignJourney].id).to.contain(
              EXPECTED_CONSENT_CTA_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY].primary.version,
            );
            cy.get(`[data-cy="submit-decision"]`)
              .should('have.text', EXPECTED_CONSENT_CTA_VERSIONS[tenantCode][journeyType].primary.text[lang]);
            // INTENTIONALLY FRAGILE TEST
            // This test is intentionally fragile because
            // it is testing the exact text of the consent
            // and should not be accidentally modified via lokalise/code changes.
            // If the text of the consent changes, update this test to reflect the new consent.
            // Ensure MIB consent in DEFAULT_CONSENT_VERSIONS is bumped
            // Ensure you add a new version key to the CONSENT_HEADER/BODY/CTA objects instead of
            // modifying the ids of the existing key
            cy.get(`[data-cy="consent-body"]`)
              .find('ul>li')
              .should(($lis) => validateConsentCopy($lis, expectedCopy, lang));
          });
      });
    });
  });
});

describe('LIFE or CI Joint <Authorization />', () => {
  TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS.forEach((theme) => {
    Object.values(LOCALE).forEach((lang) => {
      it(`${theme} - ${lang} - match snapshot`, () => {
        const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT);
        cy.setTenantConfigByTheme(theme);
        cy.setResolution('macbook-13');
        store.dispatch(updateMetadata('lang', lang));
        cy.mount(<Authorization />, { reduxStore: store, theme });
        cy.percySnapshotWithBreakpoints(`AuthorizationConsentPageTest ${theme}`);
        let enable_digital_consent;
        let tenant;
        cy.window()
          .then((win) => {
            enable_digital_consent = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_DIGITAL_CONSENT];
            tenant = win.__policyme.TENANT.name;
            console.log('tenant', win.__policyme.TENANT);
          })
          .then(() => {
            const tenantCode:TenantCodeType = TENANTS_NAME_CODES_MAPPING[tenant];
            const tenantExpected = EXPECTED_CONSENT_VERSIONS[tenantCode];
            const journeyType = enable_digital_consent
              ? AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY
              : AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY;
            const expectedCopy = tenantExpected[journeyType].joint;
            const product = getMainProduct(state, state.userControl.currentUser);
            const consentVersions =
              DEFAULT_CONSENT_VERSIONS[TENANTS_NAME_CODES_MAPPING[tenant]][product];
            const docusignJourney =
              consentVersions[AUTHORIZATION_TYPE.MIB][AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY];
            const digitalConsentJourney =
              consentVersions[AUTHORIZATION_TYPE.MIB][AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY];

            // INTENTIONALLY FRAGILE TEST
            // If these tests fail, you might have wrongly modified
            // the id of the key specified in Authorization.js
            // If you did not bump any version constants and you intended to change the copy,
            // you should be creating a new key instead,
            // and bump the version number of the DEFAULT_CONSENT_VERSIONS for MIB type
            // instead of modifying the existing key
            // If you've correctly bumped the version constants,
            // update the tests to match the version
            // Assert the default consent copy versions without tenant customisation
            expect(CONSENT_HEADER[digitalConsentJourney].id).to.contain(
              EXPECTED_CONSENT_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY].joint.version,
            );
            expect(CONSENT_HEADER[docusignJourney].id).to.contain(
              EXPECTED_CONSENT_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY].joint.version,
            );
            expect(CONSENT_CTA[digitalConsentJourney].id).to.contain(
              EXPECTED_CONSENT_CTA_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY].joint.version,
            );
            expect(CONSENT_CTA[docusignJourney].id).to.contain(
              EXPECTED_CONSENT_CTA_VERSIONS[
                TENANTS_NAME_CODES_MAPPING[tenant]][
                AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY].joint.version,
            );
            cy.get(`[data-cy="submit-decision"]`)
              .should('have.text', EXPECTED_CONSENT_CTA_VERSIONS[tenantCode][journeyType].joint.text[lang]);
            // INTENTIONALLY FRAGILE TEST
            // This test is intentionally fragile because
            // it is testing the exact text of the consent
            // and should not be accidentally modified via lokalise/code changes.
            // If the text of the consent changes, update this test to reflect the new consent.
            // Ensure MIB consent in DEFAULT_CONSENT_VERSIONS is bumped
            // Ensure you add a new version key to the CONSENT_HEADER/BODY/CTA objects instead of
            // modifying the ids of the existing key
            cy.get(`[data-cy="consent-body"]`)
              .find('ul>li')
              .should(($lis) => validateConsentCopy($lis, expectedCopy, lang));
          });
      });
    });
  });
});
