import { PROVINCES } from '../../../../src/utils/const';
import { emailCreator } from '../../../helper';
import { jointApprovedData } from './input';

let {
  birthdate, gender, firstName,
  desiredTermLength,
  desiredCoverageAmountSliderIndex,
  lastName, address,
  existingPolicies,
  pendingPolicy, annualIncome,
  partnerAnnualIncome, familyComposition, jointAppDetails,
  partnerFirstName, partnerLastName, secondaryAddress,
} = jointApprovedData;

const primaryEmail = emailCreator(2, 'PM', 'approved'); // Testcase number can be changed

describe('Joint application to Aura', {
  requestTimeout: 10000,
}, () => {
  it('Should be a joint application, and go to the start of the Aura question', () => {
    cy.on('window:before:load', win => {
      win.fetch = null;
    });

    cy.linkRoutes();
    cy.visit(`${Cypress.env('baseURL')}/life?debug=1&cypress=1`);
    cy.viewport(1920, 1080);

    cy.LogEmail(primaryEmail, 2); // Testcase number can be changed
    cy.get('[data-cy=triage-expert]')
      .click();

    cy.get('[data-cy=submit]:visible')
      .click();
    cy.ExpertQuotesJoint(birthdate, gender, false, PROVINCES[address.province],
      jointAppDetails.birthdate, jointAppDetails.gender, jointAppDetails.smoker,
      PROVINCES[secondaryAddress.province]);

    cy.DesiredCoverage(desiredCoverageAmountSliderIndex, desiredTermLength);
    cy.JointStartApp(
      firstName,
      lastName,
      primaryEmail,
      partnerFirstName,
      partnerLastName,
    );

    cy.FullAddress(address);
    cy.FullAddressJoint('Y', secondaryAddress);

    cy.BirthLocationJoint('CA', 'OLI_CAN_ON', 'CA', 'OLI_CAN_ON');
    cy.EmploymentIncomeAnnualJoint(annualIncome, partnerAnnualIncome);
    cy.ExistingPoliciesJoint(existingPolicies.hasExistingPolicies);
    cy.PMPendingPolicies(pendingPolicy.hasPendingPolicies);
    // cy.wait(2000); //For Cypress UI
    cy.get('[data-cy="submit"]').click({ force: true, timeout: 5000 });
    cy.wait('@startDisclosure');
    cy.wait('@nextQuestion');

    // Continue with Cypress Studio here
  });
});
