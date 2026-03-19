import { FAMILY_COMPOSITION } from '../../../helper';

export const testCaseData = {
  familyComposition: FAMILY_COMPOSITION.SELF,
  birthdate: '9 December 1995',
  gender: 'Male',
  smoker: 'N',
  income: '200000',
  existingCoverage: {
    hasExistingCoverage: 'N',
  },
  firstName: 'Alex',
  email: 'gurveer.grewal@policyme.com',
  desiredTermLength: '15',
  desiredCoverageAmountSliderIndex: 9, // 325,000
  jointPolicy: {
    policy: 'Just Me',
    partnerBirthdate: '',
    partnerGender: '',
    partnerSmoke: '',
  },
  lastName: 'Caruso',
  address: {
    address: '40 Bay St',
    apartment: '',
    city: 'Toronto',
    province: 'ON',
    country: 'CA',
    postalCode: 'M5J 2X2',
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
  phoneNumber: '4165500708',
  referrer: {
    hasReferrer: 'Y',
    referrerData: {
      source: 'TikTok',
    },
},
  interest: {
    hasInterest: 'Y',
    interestData: {
      source: 'none',
    },
  },
};
