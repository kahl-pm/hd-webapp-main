import { TENANTS_NAME_CODES_MAPPING } from '@policyme/global-libjs-utils';
import { PROVINCES, USER_TYPES } from '../../../../src/utils/const';
import { convertNormalEmailToTimestampedEmail } from '../../../helper';
import { testCaseData } from './input';

let {
  birthdate,
  gender, firstName,
  lastName, address,
  email,
  hdTriage,
} = testCaseData.primary;

let { hdPlanType,
  groupBenefits, existingHdCov,
  caaMember } = hdTriage;

const checkForFrenchToggle = () => {
  cy.get('[data-testid="language-toggle"]').should('be.visible');
};

describe('H&D GI Check for Language Toggle', {
  requestTimeout: 10000,
}, () => {
  it('Approved joint application reccomendation pathway to start of Aura', () => {
    const timestampedEmail = convertNormalEmailToTimestampedEmail(email);
    const tenantCode = Cypress.env('tenantCode');
    cy.on('window:before:load', win => {
      // eslint-disable-next-line no-param-reassign
      win.fetch = null;
    });

    cy.linkRoutes();
    cy.setABTest(Cypress.env('baseURL').includes('caa'));
    cy.visit(`https://dev.life-health.bcaa.policyme.com/life/hd/family?debug=1&cypress=1`);
    cy.viewport(1920, 1080);
    cy.LogEmail(timestampedEmail, 37);
    checkForFrenchToggle();
    cy.clickSubmit();
    checkForFrenchToggle();
    cy.QuotesInputPrimary(birthdate, gender, false, PROVINCES[address.province], 'primary');
    cy.CheckInputBoxQuotesInput();
    cy.clickSubmit();
    checkForFrenchToggle();
    if (tenantCode === TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL) {
      cy.CaaMember(caaMember, true);
    }
    cy.ExistingHdCov(existingHdCov, true);
    cy.GroupBenefits(groupBenefits, true);
    cy.hdSelectPlan(hdPlanType, true);
    cy.ClearAndType('firstName', firstName);
    cy.ClearAndType('lastName', lastName);
    cy.ClearAndType('email', timestampedEmail);
    checkForFrenchToggle();
  });
});
