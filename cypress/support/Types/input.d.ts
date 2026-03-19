import { COVERAGE_FIT_OPTIONS } from '../../../src/utils/const';
import type { FamilyComposition } from '../../helper';
import type { Disclosure } from './disclosures';

export type TestInput = {
  product_type: ProductType;
  primary: Person;
  dependents?: Person[];
  tenantId?: string;
};

type Person = {
  hdTriage?: hdTriage;
  hasPartner?: string;
  userIntent?: string;
  hasKids?: string;
  familyComposition?: FamilyComposition;
  kidsAges?: number[];
  kidsHousing?: string;
  kidsEducation?: string;
  birthdate?: string;
  gender?: string;
  smoker?: string;
  healthIssues?: string;
  income?: string;
  residence?: Residence;
  existingCoverage?: ExistingCoverage;
  savings?: Savings;
  debts?: Debts;
  expenses?: Expenses;
  firstName?: string;
  email?: string;
  partnerEmail?: string;
  partnerFirstName?: string;
  partnerLastName?: string;
  secondaryAddress?: Address;
  recommendationAmount?: number;
  recommendationYears?: string;
  desiredTermLength?: string;
  editedDesiredTermLength?: string;
  desiredCoverageAmountSliderIndex?: number;
  editedDesiredCoverageAmountSliderIndex?: number;
  desiredCoverageAmountSliderValue?: number;
  editedDesiredCoverageAmountSliderValue?: number;
  jointPolicy?: JointPolicy;
  lastName?: string;
  address?: Address;
  yearsAtAddress?: number;
  employmentIncome?: EmploymentIncome;
  existingPolicies?: ExistingPoliciesData;
  replacingPolicies?: ReplacePolicies;
  pendingPolicy?: PendingPolicies;
  finances?: Finances;
  license?: {
    requiresLicense?: string;
  };
  crossSell?: { desiredCoverageAmountSliderValue: number; desiredTermLength: string; };
  hasFinancialDifficulties?: string;
  willBorrow?: string;
  beenBankrupt?: string;
  usedSubstances?: string;
  trusteeName?: string;
  cancelBeneficiaryChanges?: boolean;
  beneficiaries?: Beneficiary[];
  secondaryBeneficiaries?: SecondaryBeneficiarys;
  phoneNumber?: string;
  referrer?: Reffer;
  interest?: Interest;
  airmiles?: {
    hasAirmiles?: 'Y' | 'N';
    number?: string;
  };
  jointAppDetails?: JointApp;
  isJoint?: string;
  paymentFrequency?: string;
  payment?: Payment;
  paymentSecondary?: Payment;
  billing?: Billing;
  id?: string;
  seeMyBeneficiaries?: boolean;
  editBeneficiaries?: EditBeneficiaries;
  disclosure?: Disclosure;
  annualIncome?: number;
  partnerAnnualIncome?: number;
  networth?: Networth;
  renewals?: { age_nearest: number; mn_prems: number; yr_prems: number; }[];
};

type ProductType = 'health_dental' | 'standard_ci' | 'term_life';

type hdTriage = {
  underwritingMethod: UnderwritingMethods;
  hdPlanType: HDPlanTypes;
  hdPrescriptionDrugs: YesNoChoiceString;
  hdPrescriptionDrugOptions?: hdPrescriptionDrugOptions;
  groupBenefits: YesNoChoiceString;
  existingHdCov: YesNoChoiceString;
  existingHdCovOptions?: ExistingHdCovOptions;
  caaMember?: YesNoChoiceString;
  coverageFitFlag: CoverageFitOption;
}

type ExistingHdCovOptions = 'manulife' |' surehealth' |
                            'group_benefits_employer'| 'group_benefits_college' |
                            'other' | 'not_sure'

type CoverageFitOption = typeof COVERAGE_FIT_OPTIONS[keyof typeof COVERAGE_FIT_OPTIONS];

type YesNoChoiceString = 'Y' | 'N';

type HDPlanTypes = 'economic' | 'standard' |
                   'enhanced' | 'dental_secure';

type UnderwritingMethods = 'guaranteed_issue' |
                           'fully_underwritten' |
                           'portable_coverage';

type hdPrescriptionDrugOptions = 'both' | 'primary_only' | 'secondary_only';

type Networth = {
  savingsAndInvestments?: number;
  homeValue?: number;
  mortgage?: number;
  debts?: number;
};

type Reffer = {
  hasReferrer?: BooleanString;
  referrerData?: ReferrerData;
};

type Interest = {
  hasInterest?: BooleanString;
  interestData?: InterestData;
};

type Residence = {
  ownership?: string;
  monthly?: number;
  mortgageBalance?: number;
};

type ExistingCoverage = {
  hasExistingCoverage?: BooleanString;
  employerCoverage?: number;
  selfCoverage?: number;
};

type Savings = {
  hasSavings?: string;
  retirementSavings?: number;
  nonRetirementSavings?: number;
};

type DebtData = {
  creditCardDebt?: number;
  studentLoans?: number;
  homeEquityLoans?: number;
  linesOfCredit?: number;
  otherDebt?: number;
};

type Debts = {
  hasDebts?: string;
  debtData?: DebtData;
};

type Expenses = {
  rentMortgage?: number;
  utilities?: number;
  telecom?: number;
  food?: number;
  shopping?: number;
  transportation?: number;
  childcare?: number;
  discretionary?: number;
  other?: number;
};

type JointPolicy = {
  policy?: string;
  partnerBirthdate?: string;
  partnerGender?: string;
  partnerSmoke?: string;
};

type JointApp = {
  birthdate?: string,
  gender?: string,
  smoker?: string,
};

type Address = {
  address?: string;
  apartment?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
};

type EmploymentIncome = {
  isEmployed?: string;
  income?: number;
};

type ExistingPolicy = {
  insurer?: string;
  coverageAmount?: string;
  year?: string;
  type?: string;
  myself?: boolean;
  partner?: boolean;
};

type ExistingPoliciesData = {
  hasExistingPolicies?: BooleanString;
  existingPoliciesData?: ExistingPolicy[];
};

type ReplacePolicy = {
  insurer?: string;
  coverageAmount?: string;
  replaceReasons?: string[];
};

type ReplacePolicies = {
  willReplacePolicies?: string;
  replacePolicies?: ReplacePolicy[];
};

type PendingPolicies = {
  hasPendingPolicies?: BooleanString;
  willKeepPolicies?: BooleanString;
  pendingPolicies?: PendingPolicy[];
};

type PendingPolicy = {
  insurer?: string;
    coverageAmount?: string;
    type?: string;
    other?: string;
    myself?: boolean;
    partner?: boolean;
}

type Finances = {
  savings?: number;
  homeValue?: number;
  mortgage?: number;
  debts?: number;
  total?: string;
};

type Beneficiary = {
  name?: string;
  relationship?: string;
  percent?: string;
  is_minor?: boolean;
  trustee_name?: string;
};

type ReferrerData = {
  source?: string;
};

type InterestData = {
  source?: string;
};

type BeneficiaryList = Beneficiary[];

type EditBeneficiaries = {
  editOptions?: boolean;
  editPrimaryBeneficiaries?: boolean;
  primaryBeneficiaries?: BeneficiaryList;
  editSecondaryBeneficiaries?: boolean;
  secondaryBeneficiaries?: BeneficiaryList;
};

type SecondaryBeneficiarys = {
  sameAsPartner: string,
  wantSecondaryBeneficiaries?: boolean,
  beneficiaries: BeneficiaryList;
}

type Payment = {
  firstName?: string;
  lastName?: string;
  card?: number;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: number;
};

type Billing = {
  apartement?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  country?: string;
  countryCode?: string;
};

export type BooleanString = 'Y' | 'N';
