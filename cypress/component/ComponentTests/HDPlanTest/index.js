import React from 'react';
import { HD_PLANS_DATA, test, THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import HealthAndDentalPlanCard from '../../../../src/components/HealthAndDentalPlanCard';
import { createTestStore } from '../../../../tests/util';

// Importing the test data for each plan type
import PM_GI from './testData/PM/guaranteedIssue.ts';
import PM_PC from './testData/PM/portableCoverage.ts';
import PM_FUW from './testData/PM/fullyUnderwritten.ts';
import CAA_GI from './testData/CAA/guaranteedIssue.ts';
import CAA_PC from './testData/CAA/portableCoverage.ts';
import CAA_FUW from './testData/CAA/fullyUnderwritten.ts';
import BMOI_GI from './testData/BMOI/guaranteedIssue.ts';
import BMOI_PC from './testData/BMOI/portableCoverage.ts';

const tenantDataMapping = {
  [THEMES.policyme_original]: {
    guaranteed_issue: PM_GI,
    portable_coverage: PM_PC,
    fully_underwritten: PM_FUW,
  },
  [THEMES.CAA]: {
    guaranteed_issue: CAA_GI,
    portable_coverage: CAA_PC,
    fully_underwritten: CAA_FUW,
  },
  [THEMES.BMOI]: {
    guaranteed_issue: BMOI_GI,
    portable_coverage: BMOI_PC,
  },
};

const initializeStoreAndTheme = (journeyEnum, theme, plan) => {
  const { store } = createTestStore(journeyEnum);
  cy.setTenantConfigByTheme(theme);
  cy.setResolution('macbook-13');
  cy.mount(<HealthAndDentalPlanCard noButton isHDFullyUW={false} plan={plan} />, { reduxStore: store, theme });
  return { store };
};

describe('HD Plans', () => {
  const themesToTest = [THEMES.policyme_original, THEMES.CAA, THEMES.BMOI];

  themesToTest.forEach((theme) => {
    const tenant = test.getTenantFromTheme(theme);
    const planTypes = Object.keys(tenantDataMapping[theme]);

    // Loop through each plan name (e.g., guaranteed_issue, portable_coverage)
    planTypes.forEach((planType) => {
      const testDataForPlanType = tenantDataMapping[theme][planType];

      // Loop through each plan name (e.g., economic, classic)
      Object.keys(testDataForPlanType).forEach((planName) => {
        it(`${theme} - should show plan card text - ${planType} - ${planName}`, () => {
          const testData = testDataForPlanType[planName];

          initializeStoreAndTheme(
            STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI,
            theme,
            HD_PLANS_DATA[tenant.code][planType][planName]
          );

          const { card: cardAssertions, modal: modalAssertions } = testData;

          cy.window().then(() => {
            cardAssertions.forEach((text) => {
              cy.contains(text).should('be.visible');
            });
          });

          cy.contains('See full plan details here').click();
          Object.keys(modalAssertions).forEach((id) => {
            if (modalAssertions[id] === "") {
              cy.get(`#${id}`).should('not.exist');
            } else {
              cy.get(`#${id}`).invoke('text').then((text) => {
                // Replace multiple spaces/newlines with a single space
                const trimmedText = text.trim().replace(/\s+/g, ' ');
                // Normalize the expected text
                const expectedText = modalAssertions[id].trim().replace(/\s+/g, ' ');

                cy.wrap(trimmedText).should('eq', expectedText);
              });
            }
          });
        });
      });
    });
  });
});
