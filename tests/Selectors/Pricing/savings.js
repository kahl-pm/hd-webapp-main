import _ from 'lodash';
import { STATES_ENUM } from '../../ReduxStateMother/const';

const _emptyState = {
  life: {
    discountSavings: '0',
    discountSavingsCurrency: '$0.00',
    discountBreakdown: {
      caaMember: 0,
      employee: 0,
      joint: 0,
      caaHd: 0,
      family: 0,
      septemberTL: 0,
    },
  },
  ci: {
    discountSavings: '0',
    discountSavingsCurrency: '$0.00',
    discountBreakdown: {
      caaMember: 0,
      employee: 0,
      joint: 0,
      caaHd: 0,
      family: 0,
      septemberTL: 0,
    },
  },
  hd: {
    discountBreakdown: {
      caaHd: 0,
      caaMember: 0,
      employee: 0,
      family: 0,
      joint: 0,
      septemberTL: 0,
    },
    discountSavings: '0',
    discountSavingsCurrency: '$0.00',
  },
};

const states = {
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: {
    life: {
      discountSavings: '2.40',
      discountSavingsCurrency: '$2.40',
      discountBreakdown: {
        caaMember: 0,
        employee: 0,
        joint: 2.4030000000000005,
        caaHd: 0,
        family: 0,
        septemberTL: 0,
      },
    },
    ci: {
      discountSavings: '0',
      discountSavingsCurrency: '$0.00',
      discountBreakdown: {
        caaMember: 0,
        employee: 0,
        joint: 0,
        caaHd: 0,
        family: 0,
        septemberTL: 0,
      },
    },
    hd: {
      discountBreakdown: {
        caaHd: 0,
        caaMember: 0,
        employee: 0,
        family: 0,
        joint: 0,
        septemberTL: 0,
      },
      discountSavings: '0',
      discountSavingsCurrency: '$0.00',
    },
  },
  [STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER]: {
    life: {
      discountSavings: '3.19',
      discountSavingsCurrency: '$3.19',
      discountBreakdown: {
        caaMember: 0,
        employee: 0,
        joint: 3.1940000000000004,
        caaHd: 0,
        family: 0,
        septemberTL: 0,
      },
    },
    ci: {
      discountSavings: '0',
      discountSavingsCurrency: '$0.00',
      discountBreakdown: {
        caaMember: 0,
        employee: 0,
        joint: 0,
        caaHd: 0,
        family: 0,
        septemberTL: 0,
      },
    },
    hd: {
      discountBreakdown: {
        caaHd: 0,
        caaMember: 0,
        employee: 0,
        family: 0,
        joint: 0,
        septemberTL: 0,
      },
      discountSavings: '0',
      discountSavingsCurrency: '$0.00',
    },
  },
};

const getSavingsObj = (strategy) => {
  return states[strategy] ? _.cloneDeep(states[strategy]) : _emptyState;
};

export default getSavingsObj;
