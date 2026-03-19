import { emailCreator } from '../../../helper';
import { jointApprovedData1 } from './input';

let {
    hasKids, birthdate, gender,
    smoker, healthIssues,
    income, partnerIncome,
    residence, existingCoverage,
    savings, debts,
    expenses, firstName,
    desiredTermLength,
    desiredCoverageAmountSliderIndex,
    lastName, address,
    existingPolicies, pendingPolicy, childrenAges, payKidsEducation, annualIncome, partnerAnnualIncome,
    jointAppDetails, partnerFirstName, partnerLastName, secondaryAddress} = jointApprovedData1

const primaryEmail = emailCreator(2, 'PM', 'approved');  //Testcase number can be changed


describe('Joint app reccomendation pathway to start of Aura', {
    requestTimeout: 10000,
  }, () => {
    it('Approved joint application reccomendation pathway to start of Aura', () => {
      cy.on('window:before:load', win => {
        win.fetch = null; 
      });


    cy.linkRoutes();
    cy.setABTest();
    cy.visit(`${Cypress.env('baseURL')}/life/`);
    cy.viewport(1920, 1080); 

    cy.LogEmail(primaryEmail, 2);
    cy.get('[data-cy=triage-novice]')
    .click();

    cy.get('[data-cy=submit]:visible')
    .click();

      
    cy.advicePartner('Y', 30)
    cy.adviceKids(hasKids, childrenAges)
    cy.adviceKidsEducation(payKidsEducation)
    cy.adviceBirthdate(birthdate);
    cy.adviceGender(gender);
    cy.adviceSmoker(smoker); 
    cy.adviceHealth(healthIssues);
    cy.adviceIncome(income, partnerIncome )
    cy.adviceResidence(residence.ownership, residence.monthly, residence.mortgageBalance);
    cy.adviceExistingCoverage(existingCoverage.hasExistingCoverage)
    cy.adviceSavings(savings.hasSavings, savings.retirementSavings, savings.nonRetirementSavings)
    cy.adviceDebts(debts.hasDebts, debts.debtData);
    cy.adviceExpenses(expenses);
    cy.adviceEmail(firstName, primaryEmail);
    cy.RecommendationNoCoverage();
    cy.toggleOnJoint(jointAppDetails.birthdate, jointAppDetails.gender, jointAppDetails.smoker);
    cy.DesiredCoverage(desiredCoverageAmountSliderIndex, desiredTermLength);
    cy.JointStartApp(
      firstName,
      lastName,
      primaryEmail,
      partnerFirstName,
      partnerLastName
    );
    
    cy.FullAddress(address);
      cy.FullAddressJoint('Y', secondaryAddress);

      cy.BirthLocationJoint('CA', 'OLI_CAN_ON', 'CA', 'OLI_CAN_ON');
      cy.EmploymentIncomeAnnualJoint(annualIncome, partnerAnnualIncome)
      cy.ExistingPoliciesJoint(existingPolicies.hasExistingPolicies);
      cy.PMPendingPolicies(pendingPolicy.hasPendingPolicies);
      // cy.wait(2000); //For Cypress UI
      cy.get('[data-cy="submit"]').click({force: true, timeout: 5000});
      cy.wait('@startDisclosure')
      cy.wait('@nextQuestion');

    });
   
});