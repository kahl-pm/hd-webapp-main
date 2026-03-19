import { PROVINCES } from '../../../../src/utils/const';
import { emailCreator } from '../../../helper';
import { jointApprovedData } from './input';

let { birthdate, gender, firstName,
  desiredTermLength,
  desiredCoverageAmountSliderIndex,
  lastName, address,
  existingPolicies,
  pendingPolicy,
  referrer,
  annualIncome,
  partnerAnnualIncome, familyComposition, jointAppDetails,
  partnerFirstName, partnerLastName, secondaryAddress, partnerEmail } = jointApprovedData;

const primaryEmail = emailCreator(2, 'PM', 'approved'); // Testcase number can be changed

describe('Joint application, both approved', {
  requestTimeout: 10000,
}, () => {
  it('Goes through the no reccomendation pathway until the start of approved steps', () => {
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
    // cy.wait(2000); // For Cypress UI
    cy.get('[data-cy="submit"]').click({ force: true, timeout: 5000 });
    cy.wait('@startDisclosure');
    cy.wait('@nextQuestion');
    cy.SingleChoiceRadioJoint('Are you currently working?', 'primary', 'Yes');
    cy.SingleChoiceRadioJoint('Does your work involve any of the following?', 'primary', 'None of the above');
    cy.SingleChoiceRadioJoint('Are you currently working?', 'secondary', 'Yes');
    cy.SingleChoiceRadioJoint('Does your work involve any of the following?', 'secondary', 'None of the above');
    cy.DoubleSingleChoiceRadio('Are you currently going through bankruptcy?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('What is your status in Canada?', 'Citizen or have applied for citizenship', 'Citizen or have applied for citizenship');
    cy.AvailableUnitJoint('What is your height?', 'feet/inches', [6, 3]);
    // cy.wait(1000); // For Cypress UI
    cy.AvailableUnitJoint('What is your height?', 'feet/inches', [5, 3]);
    cy.AvailableUnitJoint('What is your weight?', 'pounds', [205]);
    cy.AvailableUnitJoint('What is your weight?', 'pounds', [135]);
    cy.DoubleSingleChoiceRadio('Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)', 'No', 'No');
    cy.DoubleSingleChoiceRadio('In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('On average, do you have 1 or more alcoholic drinks per day?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Have you ever been treated or professionally advised to reduce or stop drinking alcohol?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Have you used marijuana in the last 5 years?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding marijuana)?', 'No', 'No');
    cy.MultiChoiceJoint('Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)', ['None of the above']);

    cy.MultiChoiceJoint('Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)', ['None of these']);
    cy.DoubleSingleChoiceRadio('Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?', 'No', 'No');
    cy.DoubleSingleChoiceRadio('Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)', 'No', 'No');
    cy.CommonPrimaryBeneficiaries('chooseLater');
    cy.ContactJoint('2896809081', '6473397129');
    cy.PartnerEmail(partnerEmail);
    cy.Referrer(referrer.hasReferrer, referrer.referrerData);
    cy.AuthorizeJoint();
    cy.get('[data-cy=submit]:visible').click();

    // Continue doing approved steps with Cypress Studio
  });
});
