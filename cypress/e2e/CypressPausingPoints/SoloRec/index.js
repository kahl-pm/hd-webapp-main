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
  pendingPolicy
} = testCase1Data;

const primaryEmail = emailCreator(2, 'PM', 'approved'); //change testcase number if needed

describe('Solo Recommendation path to Aura', {
  requestTimeout: 10000,
}, () => {
  it('Goes therough recommendation pathway until the start of Aura questions', () => {
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
    
  });
});
