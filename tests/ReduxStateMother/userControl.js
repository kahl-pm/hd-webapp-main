import _ from 'lodash';
import { STATES_ENUM } from './const';
import { AFFILIATE_CATEGORIES } from '../../src/utils/const';

const J1_INDIV_PRIMARY_USER = {
  currentUser: 'primary',
  hasPartnerApplication: false,
  availableProducts: [
    'life',
    'ci',
  ],
  dashboardUser: 'primary',
  affiliate: {},
};

const J1_JOINT_PRIMARY_USER = {
  currentUser: 'primary',
  hasPartnerApplication: true,
  availableProducts: [
    'life',
    'ci',
  ],
  dashboardUser: 'primary',
  affiliate: {},
};

const states = {
  [STATES_ENUM.DEFAULT]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.DEV_INIT]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOINT]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOURNEY_1_INDIV]: { ...(_.cloneDeep(J1_INDIV_PRIMARY_USER)) },
  [STATES_ENUM.JOURNEY_1_JOINT]: { ...(_.cloneDeep(J1_JOINT_PRIMARY_USER)) },
  [STATES_ENUM.JOURNEY_1_INDIV_APPROVED]: { ...(_.cloneDeep(J1_INDIV_PRIMARY_USER)) },
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: { ...(_.cloneDeep(J1_JOINT_PRIMARY_USER)) },
  [STATES_ENUM.JOURNEY_1_POLICYME_PARTNER]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateName: 'WorkPerks',
      affiliateCategory: 'policyme_partner',
    },
    affiliateId: 'M1466Bt6W5',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateName: 'LifeWorks',
      affiliateCategory: 'policyme_partner',
    },
    affiliateId: 'hT95Jj3zAw',
  },
  [STATES_ENUM.JOURNEY_3_INDIV_APPROVED]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOURNEY_1_INDIV_MORTGAGE]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateName: 'Nesto',
      affiliateCategory: 'mortgage_broker',
    },
    affiliateId: 'f2C2UOQwnk',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_MORTGAGE]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateName: 'Nesto',
      affiliateCategory: 'mortgage_broker',
    },
    affiliateId: 'f2C2UOQwnk',
  },
  [STATES_ENUM.JOURNEY_JOINT_IS_POLICY_ME_EMPLOYEE]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateCategory: AFFILIATE_CATEGORIES.POLICYME_EMPLOYEE,
    },
  },
  [STATES_ENUM.JOURNEY_INDIVIDUAL_IS_POLICY_ME_EMPLOYEE]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateCategory: AFFILIATE_CATEGORIES.POLICYME_EMPLOYEE,
    },
  },
  [STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]: {
    currentUser: 'primary',
    hasPartnerApplication: false,
    availableProducts: [
      'life',
      'hd',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOURNEY_JOINT_HD_GI]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
      'hd',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOURNEY_JOINT_CAA_MEMBERSHIP]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {},
  },
  [STATES_ENUM.JOURNEY_JOINT_HD_GI]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
      'hd',
    ],
    dashboardUser: 'primary',
    affiliate: {},
    hd_quotes: {
      dental_care: {
        mn_prems: 70,
        selected: true,
      },
      advanced: {
        mn_prems: 70,
        selected: false,
      },
      economic: {
        mn_prems: 70,
        selected: false,
      },
      classic: {
        mn_prems: 70,
        selected: false,
      },
      drug_care: {
        mn_prems: 70,
        selected: false,
      },
      no_dental_advanced: {
        mn_prems: 70,
        selected: false,
      },
    },
  },
  [STATES_ENUM.JOURNEY_HD_QUOTES]: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'life',
      'ci',
    ],
    dashboardUser: 'primary',
    affiliate: {},
    hd_quotes: {
      dental_care: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
      advanced: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
      economic: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
      classic: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
      drug_care: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
      no_dental_advanced: {
        has_add_on: false,
        is_discounted: false,
        mn_prems: 268.81,
        original_mn_prems: 268.81,
        selected: false,
      },
    },
  },
};

export class UserControl {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }
}
