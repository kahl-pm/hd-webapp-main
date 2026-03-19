import { TENANTS_NAME_CODES_MAPPING } from '@policyme/global-libjs-utils';
import { PROVINCES, SEGMENT_EVENTS, USER_TYPES, PM_PRODUCT_PREFIX } from '../../../../src/utils/const';
import { convertNormalEmailToTimestampedEmail } from '../../../helper';
import { testCaseData } from './input';
import { isSocialSignOnFeatureEnabled } from '../../../../src/utils/helpers';

/**
 * @description This is the test case data for the test case 51.
 * Note that this is only for bmoi, and is a duplicate of test case 37.
 * At this moment, we have decided to not extend test case 37 to
 * include bmoi and pm. This will be removed once we invest time in making
 * tests tenant agnostic.
 * @important
 * Additionally, this test is to be deprecated after BMOI launch as this serves
 * merely as a regression tool until the launch since we're pausing development on this
 * tenant for a few months.
 */
let {
  birthdate, billing,
  gender, firstName,
  lastName, address,
  payment,
  referrer, interest,
  email,
  hdTriage,
  userIntent,
  airmiles,
} = testCaseData.primary;

let { hdPlanType, hdPrescriptionDrugs,
  groupBenefits, existingHdCov,
  underwritingMethod, coverageFitFlag } = hdTriage;

const TEST_CASE = 51;

describe('Store test input data', {
  requestTimeout: 1000,
}, () => {
  it('Store test input data', () => {
    /**
     * We're doing this in order to prepare for reading the tenant id
     * from the test data instead of hardcoding it in the backend.
     */
    const tenantID = Cypress.env('tenantId');
    testCaseData.tenantId = tenantID;
    cy.writeFile('test51Primary.json', JSON.stringify(testCaseData, null, 2));
  });
});

describe('H&D GI single', {
  requestTimeout: 10000,
}, () => {

  it('Health and Dental Guaranteed Issue for BMOI', () => {
    const timestampedEmail = convertNormalEmailToTimestampedEmail(email);
    const tenantCode = Cypress.env('tenantCode');
    cy.TestCase(TEST_CASE);
    cy.linkRoutes();
    cy.setABTest(Cypress.env('baseURL').includes('bmoi'));
    cy.visit(`${Cypress.env('baseURL')}/life/hd/family?debug=1&cypress=1`);
    cy.viewport(1920, 1080);
    cy.UserIntent(userIntent, false, false, PM_PRODUCT_PREFIX.HD);
    cy.LogEmail(timestampedEmail, 51);
    cy.clickSubmit();
    cy.QuotesInputPrimary(birthdate, gender, false, PROVINCES[address.province], 'primary');
    cy.CheckInputBoxQuotesInput();
    cy.clickSubmit();
    cy.ExistingHdCov(existingHdCov);
    cy.GroupBenefits(groupBenefits);
    cy.CoverageFitFlag(coverageFitFlag);
    cy.hdSelectPlan(hdPlanType);
    cy.ClearAndType('firstName', firstName);
    cy.ClearAndType('lastName', lastName);
    cy.ClearAndType('email', timestampedEmail);
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@verifyEmail');
    cy.wait('@utm');
    cy.wait('@accounts');
    cy.wait('@patchHouseholdInfos');
    cy.wait('@rehydrateJourney', { timeout: 30000 });


    if (isSocialSignOnFeatureEnabled()) {
      cy.BasicDetails(
        firstName,
        lastName,
      );
    }

    cy.FullAddress(address);
    cy.AirmilesNumber(airmiles.hasAirmiles, airmiles.number);
    cy.LogHDPrimarySessionID(51);
    cy.Contact('11111111111');
    cy.Referrer(referrer.hasReferrer, referrer.referrerData);
    cy.Interest(interest.hasInterest, interest.interestData);
    cy.checkHDConsent(true);
    cy.hdSinglePageCheckout(payment, billing);
    cy.ApprovedThankYou(USER_TYPES.PRIMARY);
    cy.wait('@postEnrolHbmPlanMember');
  });
});

describe('validate test input data file exists', () => {
  it('should validate the primary test input data file exists', () => {
    cy.readFile('test51Primary.json').then((data) => {
      expect(data).to.exist;
    });
  });
});
