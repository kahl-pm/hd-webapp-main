import _ from 'lodash';
import { STATES_ENUM } from '../../ReduxStateMother/const';

const _emptyState = {
  firstPaymentDate: '',
};

const states = {
  [STATES_ENUM.JOURNEY_1_INDIV_APPROVED]: {
    firstPaymentDate: 'Dec 02',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: {
    firstPaymentDate: 'Dec 05',
  },
  [STATES_ENUM.JOURNEY_1_POLICYME_PARTNER]: {
    firstPaymentDate: 'Feb 05',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER]: {
    firstPaymentDate: 'Feb 05',
  },
  [STATES_ENUM.JOURNEY_3_INDIV_APPROVED]: {
    firstPaymentDate: 'Dec 05',
  },
};

const getPaymentDatesObj = (strategy) => {
  return states[strategy] ? _.cloneDeep(states[strategy]) : _emptyState;
};

export default getPaymentDatesObj;
