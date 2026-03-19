import { TENANTS_NAME_CODES_MAPPING } from '@policyme/global-libjs-utils';
import { PROVINCES, SEGMENT_EVENTS, USER_TYPES, PM_PRODUCT_PREFIX } from '../../../../src/utils/const';
import { convertNormalEmailToTimestampedEmail } from '../../../helper';
import { testCaseData } from './input';


let {
  familyComposition,
  birthdate, billing,
  gender, firstName,
  lastName, address,
  payment,
  referrer, interest,
  email,
  hdTriage,
  userIntent,
} = testCaseData.primary;

let { hdPlanType, hdPrescriptionDrugs,
  groupBenefits, existingHdCov,
  caaMember, underwritingMethod, coverageFitFlag } = hdTriage;

const TEST_CASE = 37;

describe('Store test input data', {
  requestTimeout: 1000,
}, () => {
  it('Store test input data', () => {
    cy.writeFile('test37Primary.json', JSON.stringify(testCaseData, null, 2));
  });
});

describe('H&D GI single', {
  requestTimeout: 10000,
}, () => {

  it('Approved joint application reccomendation pathway to start of Aura', () => {
    const timestampedEmail = convertNormalEmailToTimestampedEmail(email);
    const tenantCode = Cypress.env('tenantCode');
    cy.TestCase(TEST_CASE);
    cy.linkRoutes();
    cy.setABTest(Cypress.env('baseURL').includes('caa'));
    cy.visit(`${Cypress.env('baseURL')}/life/hd/family?debug=1&cypress=1`);
    cy.viewport(1920, 1080);
    cy.LogEmail(timestampedEmail, 37);
    cy.QuotesInputPrimary(birthdate, gender, false, PROVINCES[address.province], 'primary');
    cy.CheckInputBoxQuotesInput();
    // cy.checkProvidedDocumentConfirmation();
    cy.clickSubmit();
    if (tenantCode === TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL) {
      cy.CaaMember(caaMember);
    }
    cy.ExistingHdCov(existingHdCov);
    cy.GroupBenefits(groupBenefits);
    cy.CoverageFitFlag(coverageFitFlag);
    cy.wait(2000); // add a cy wait after quotes info comes back to allow js/page to hydrate.
    // Without this, we had POST hd_apps being 400s due to missing plan_type in the payload
    cy.hdSelectPlan(hdPlanType);
    cy.ClearAndType('firstName', firstName);
    cy.ClearAndType('lastName', lastName);
    cy.ClearAndType('email', timestampedEmail);
    cy.get('[data-cy=submit]:visible')
      .click({ force: true });
    cy.wait('@verifyEmail');
    cy.wait('@utm');
    cy.wait('@accounts');
    cy.wait('@patchHouseholdInfos');
    cy.wait('@rehydrateJourney', { timeout: 30000 });
    cy.SegmentTrack(SEGMENT_EVENTS.LOGIN_INITIATED, {});
    cy.FullAddress(address);
    cy.LogHDPrimarySessionID(37);
    cy.Contact('11111111111');
    cy.Referrer(referrer.hasReferrer, referrer.referrerData);
    cy.Interest(interest.hasInterest, interest.interestData);
    cy.checkHDConsent(true);
    cy.hdSinglePageCheckout(payment, billing);
    cy.ApprovedThankYou(USER_TYPES.PRIMARY);
    cy.wait('@postEnrolHbmPlanMember', { timeout: 120000 });
  });
});

describe('validate test input data file exists', () => {
  it('should validate the test input data file exists', () => {
    cy.readFile('test37Primary.json').then((data) => {
      expect(data).to.exist;
    });
  });
});
