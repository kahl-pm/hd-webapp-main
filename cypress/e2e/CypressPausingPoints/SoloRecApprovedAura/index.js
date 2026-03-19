import { emailCreator } from '../../../helper';
import { testCase1Data } from './input';

let {
  hasPartner,
  hasKids, kidsAges,
  kidsHousing, kidsEducation,
  birthdate, gender,
  smoker, healthIssues,
  income,
  residence, existingCoverage,
  savings, debts,
  expenses, firstName,
  recommendationAmount,
  recommendationYears,
  desiredTermLength,
  desiredCoverageAmountSliderIndex,
  lastName, address,
  existingPolicies, replacingPolicies,
  pendingPolicy, phoneNumber,
  referrer,
} = testCase1Data;

const primaryEmail = emailCreator(2, 'PM', 'approved'); //change testcase number if needed

describe('Solo Recommendation Pathway to Approved Steps', {
  requestTimeout: 10000,
}, () => {
  it('Goes through the recommendation pathway and goes until the approved decision steps', () => {
    cy.on('window:before:load', win => {
      win.fetch = null;
    });
 
    cy.linkRoutes();
    cy.visit(`${Cypress.env('baseURL')}/life?debug=1&cypress=1`);
    cy.viewport(1920, 1080); 

    
    cy.LogEmail(primaryEmail, 2); //change testcase number if needed

    cy.get('[data-cy=triage-novice]')
      .click();

    cy.get('[data-cy=submit]:visible')
      .click();

    cy.advicePartner(hasPartner);
    cy.LogSessionID(1);
    cy.adviceKids(hasKids, kidsAges);
    cy.adviceKidsHousing(kidsHousing);
    cy.adviceKidsEducation(kidsEducation);
    cy.adviceBirthdate(birthdate);
    cy.adviceGender(gender);
    cy.adviceSmoker(smoker);
    cy.adviceHealth(healthIssues);
    cy.adviceIncome(income);
    cy.LogSessionID(1);
    cy.adviceResidence(residence.ownership, residence.monthly, residence.mortgageBalance);
    cy.adviceExistingCoverage(
      existingCoverage.hasExistingCoverage,
      existingCoverage.employerExistingCoverage,
      existingCoverage.personalExistingCoverage,
    );
    cy.adviceSavings(savings.hasSavings, savings.retirementSavings, savings.nonRetirementSavings);
    cy.adviceDebts(debts.hasDebts, debts.debtData);
    cy.adviceExpenses(expenses);
    cy.adviceEmail(firstName, primaryEmail);
    cy.RecommendationJoint(recommendationAmount, recommendationYears);
    cy.DesiredCoverage(desiredCoverageAmountSliderIndex, desiredTermLength);
    cy.StartApp(
      firstName,
      lastName,
      primaryEmail,
    );
    cy.FullAddress(address);
    cy.BirthLocation('CA', 'OLI_CAN_ON');
    cy.EmploymentIncomeAnnualJoint(income);

    cy.ExistingPoliciesJoint(
      existingPolicies.hasExistingPolicies,
      existingPolicies.existingPoliciesData,
    );
    cy.ReplacingPoliciesJoint(
      replacingPolicies.willReplacePolicies,
      replacingPolicies.replacePolicies,
    );
    cy.PMPendingPolicies(
      pendingPolicy.hasPendingPolicies,
      pendingPolicy.willKeepPolicies,
      pendingPolicy.pendingPolicies,
    );
    cy.wait('@startDisclosure'); // needs time to load aura disclosures
    cy.wait('@nextQuestion');
    cy.wait('@patchHouseholdInfos'); // put request takes 700ms to load
    cy.wait('@utm');
    cy.SingleChoiceRadio('Are you currently working?', 'Yes');
    cy.SingleChoiceRadio('Does your work involve any of the following?', 'None of the above');
    cy.SingleChoiceRadio('Are you currently going through bankruptcy?', 'No');
    cy.SingleChoiceRadio('What is your status in Canada?', 'Citizen or have applied for citizenship');
    cy.AvailableUnit('What is your height?', 'feet/inches', [5, 4]);
    cy.AvailableUnit('What is your weight?', 'pounds', [120]);
    cy.SingleChoiceRadio('Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?', 'No');
    cy.SingleChoiceRadio('Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?', 'No');
    cy.SingleChoiceRadio('In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?', 'No');
    cy.SingleChoiceRadio('Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?', 'No');
    cy.SingleChoiceRadio('Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?', 'No');
    cy.SingleChoiceRadio('Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)', 'No');

    cy.SingleChoiceRadio('In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?', 'No');
    cy.SingleChoiceRadio('On average, do you have 1 or more alcoholic drinks per day?', 'No');
    cy.SingleChoiceRadio('Have you ever been treated or professionally advised to reduce or stop drinking alcohol?', 'No');
    cy.SingleChoiceRadio('Have you used marijuana in the last 5 years?', 'No');
    cy.SingleChoiceRadio('Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding marijuana)?', 'No');
    cy.MultiChoice('Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)', ['None of the above']);

    cy.MultiChoice('Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)', ['None of these']);
    cy.SingleChoiceRadio('Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?', 'No');
    cy.SingleChoiceRadio('Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)', 'No');
    cy.CommonPrimaryBeneficiaries('chooseLater');
    cy.Contact(phoneNumber);
    cy.Referrer(referrer.hasReferrer, referrer.referrerData);
    cy.Authorize();
    // Approved steps

    
  });
});
