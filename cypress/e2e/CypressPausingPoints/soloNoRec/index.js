import { PROVINCES } from '../../../../src/utils/const';
import { emailCreator } from '../../../helper';
import { testCaseData } from './input';

let {
  familyComposition,
  birthdate, gender,
  income, firstName,
  desiredTermLength,
  desiredCoverageAmountSliderIndex,
  lastName, address,
  existingPolicies,
  pendingPolicy,
} = testCaseData;

const primaryEmail = emailCreator(2, 'PM', 'approved'); // change testcase number if needed

describe('Solo No Recommendation to Aura', {
  requestTimeout: 10000,
}, () => {
  it('Goes through start app to the beginning of Aura', () => {
    cy.on('window:before:load', win => {
      win.fetch = null;
    });

    cy.linkRoutes();
    cy.visit(`${Cypress.env('baseURL')}/life?debug=1&cypress=1`);
    cy.viewport(1920, 1080);

    cy.LogEmail(primaryEmail, 2); // change testcase number if needed

    cy.get('[data-cy=triage-expert]')
      .click();
    cy.task('log', 'expert');

    cy.ExpertQuotes(birthdate, gender, true, PROVINCES[address.province]);
    cy.DesiredCoverage(desiredCoverageAmountSliderIndex, desiredTermLength);
    cy.StartApp(
      firstName,
      lastName,
      primaryEmail,
      'expert',
    );
    cy.FullAddress(address);
    cy.BirthLocation('CA', 'OLI_CAN_ON');
    cy.EmploymentIncomeAnnualJoint(income);
    cy.ExistingPoliciesJoint(existingPolicies.hasExistingPolicies);
    cy.PMPendingPolicies(
      pendingPolicy.hasPendingPolicies,
      pendingPolicy.willKeepPolicies,
      pendingPolicy.pendingPolicies,
    );
    cy.LogSessionID(2);
    cy.wait('@startDisclosure'); // needs time to load aura disclosures
    cy.wait('@nextQuestion');
    cy.wait('@patchHouseholdInfos'); // put request takes 700ms to load
    cy.wait('@utm');

    // Continue with Cypress Studio.
  });
});
