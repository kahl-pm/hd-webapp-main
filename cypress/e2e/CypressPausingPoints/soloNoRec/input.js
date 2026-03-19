import { FAMILY_COMPOSITION } from '../../../helper';

export const testCaseData = {
  familyComposition: FAMILY_COMPOSITION.SELF,
  birthdate: '9 December 1995',
  gender: 'Female',
  smoker: 'N',
  income: '200000',
  existingCoverage: {
    hasExistingCoverage: 'N',
  },
  firstName: 'Trinity',
  email: 'gurveer.grewal@policyme.com',
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
  lastName: 'Collins',
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
};
