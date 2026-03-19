export const testCase1Data = {
  hasPartner: 'N',
  hasKids: 'Y',
  kidsAges: [5],
  kidsHousing: 'N',
  kidsEducation: 'Y',
  birthdate: '1 January 1990',
  gender: 'Male',
  smoker: 'Y',
  healthIssues: 'N',
  income: '100000',
  residence: {
    ownership: 'own',
    monthly: 500,
    mortgageBalance: 100000,
  },
  existingCoverage: {
    hasExistingCoverage: 'N',
    employerCoverage: 2000,
    selfCoverage: 1000,
  },
  savings: {
    hasSavings: 'Y',
    retirementSavings: 5000,
    nonRetirementSavings: 5000,
  },
  debts: {
    hasDebts: 'Y',
    debtData: {
      creditCardDebt: 111,
      studentLoans: 222,
      homeEquityLoans: 333,
      linesOfCredit: 444,
      otherDebt: 555,
    },
  },
  expenses: {
    rentMortgage: 500,
    utilities: 111,
    telecom: 111,
    food: 111,
    shopping: 111,
    transportation: 111,
    childcare: 111,
    discretionary: 111,
    other: 111,
  },
  firstName: 'Scottie',
  email: 'jinwen.tay@policyme.com',
  recommendationAmount: 325000,
  recommendationYears: '15 years',
  desiredTermLength: '10',
  desiredCoverageAmountSliderIndex: 9, // 325,000
  jointPolicy: {
    policy: 'Just Me',
    partnerBirthdate: '',
    partnerGender: '',
    partnerSmoke: '',
  },
  lastName: 'Pippen',
  address: {
    address: '325 Front Street',
    apartment: 'Suite 400',
    city: 'Toronto',
    province: 'AB',
    country: 'CA',
    postalCode: 'M5V2Y1',
  },
  yearsAtAddress: 3,
  employmentIncome: {
    isEmployed: 'Y',
    income: 1000,
  },
  existingPolicies: {
    hasExistingPolicies: 'Y',
    existingPoliciesData: [
      {
        insurer: 'BMO',
        coverageAmount: '1000',
        year: '2019',
        type: 'Term Life Insurance',
        myself: false,
        partner: false,
      },
    ],
  },
  replacingPolicies: {
    willReplacePolicies: 'N',
    replacePolicies: [
      {
        insurer: '',
        coverageAmount: '',
        replaceReasons: [],
      },
    ],
  },
  pendingPolicy: {
    hasPendingPolicies: 'Y',
    willKeepPolicies: 'Y',
    pendingPolicies: [
      {
        insurer: 'Wawanesa',
        coverageAmount: '200000',
        type: 'Other',
        other: 'Other type of policy',
      },
    ],
  },
  finances: {
    savings: 90000,
    homeValue: 2500000,
    mortgage: 2000000,
    debts: 75000,
    total: '$515,000',
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
