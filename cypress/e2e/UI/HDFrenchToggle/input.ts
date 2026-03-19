import { CAA_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';
import { UNDERWRITING_METHODS, PM_PRODUCT_TYPE } from '../../../../src/utils/const';
import { FAMILY_COMPOSITION } from '../../../helper';
import type { TestInput } from '../../../support/Types/input';

const timestamp = new Date().getTime();
/**
 * Requiring timestamp in the input file to ensure we don't run into duplicate
 * member enrolment issues in HBM.
 */
export const testCaseData: TestInput = {
  product_type: PM_PRODUCT_TYPE.HEALTH_AND_DENTAL,
  primary: {
    familyComposition: FAMILY_COMPOSITION.SELF,
    hdTriage: {
      underwritingMethod: UNDERWRITING_METHODS.GUARANTEED_ISSUE,
      hdPlanType: CAA_HD_PLAN_TYPES.STANDARD,
      hdPrescriptionDrugs: 'N',
      groupBenefits: 'N',
      existingHdCov: 'N',
      caaMember: 'Y',
    },
    birthdate: '9 December 1995',
    gender: 'Female',
    smoker: 'N',
    income: '200000',
    existingCoverage: {
      hasExistingCoverage: 'N',
    },
    firstName: `Trinity-${timestamp}`,
    email: `gurveer.grewal@policyme.com`,
    recommendationAmount: 325000,
    recommendationYears: '10 years',
    desiredTermLength: '10',
    desiredCoverageAmountSliderIndex: 5, // 225,000
    jointPolicy: {
      policy: 'Just Me',
      partnerBirthdate: '',
      partnerGender: '',
      partnerSmoke: '',
    },
    lastName: `Colins-${timestamp}`,
    address: {
      address: '42 Curtis Crescent',
      apartment: '',
      city: 'King City',
      province: 'ON',
      country: 'CA',
      postalCode: 'L7B1C3',
    },
    employmentIncome: {
      isEmployed: 'Y',
      income: 1000,
    },
    pendingPolicy: {
      hasPendingPolicies: 'N',
    },
    existingPolicies: {
      hasExistingPolicies: 'N',
    },
    referrer: {
      hasReferrer: 'Y',
      referrerData: {
        source: 'Youtube',
      },
    },
    interest: {
      hasInterest: 'Y',
      interestData: {
        source: 'none',
      },
    },
    payment: {
      firstName: 'James',
      lastName: 'Harden',
      card: 4242424242424242,
      expiryMonth: 3,
      expiryYear: 28,
      cvv: 100,
    },
    billing: {
      address: '40 Bay Street',
      apartement: '177',
      city: 'Toronto',
      postalCode: 'M5J 2X2',
      province: 'Ontario',
      country: 'Canada',
      countryCode: 'CA',
    },
  },
};
