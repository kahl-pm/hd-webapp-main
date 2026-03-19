import { TENANT_FLAGS, hasFlag, sentryError } from '@policyme/global-libjs-utils';
import { PM_PRODUCT_PREFIX, USER_TYPES } from '../utils/const';

const initialState = {
  currentUser: USER_TYPES.PRIMARY,
  hasPartnerApplication: false,
  availableProducts: [PM_PRODUCT_PREFIX.HD],
  dashboardUser: USER_TYPES.PRIMARY,
  affiliate: {},
  isHealthAndDental: false,
  theme: undefined,
  hd_quotes: {},
};

export default (state = initialState, action) => {
  let _action;
  switch (action.type) {
    case '@@user_control/init':
      return {
        ...state,
        currentUser: action.currentUser,
        hasPartnerApplication: action.hasPartnerApplication,
      };
    case '@@user_control/update_property':
      _action = action;
      if (action.property === 'hasPartnerApplication' && hasFlag(TENANT_FLAGS.DISABLE_JOINT_APPLICATION) && action.value) {
        sentryError('hasPartnerApplication is set to true even though joint is disabled.');
        return state;
      }
      return {
        ...state,
        [action.property]: _action.value,
      };
    case `@@user_control/debug`:
      return {
        ...state,
        ...action.value,
      };
    case `@@user_control/update_group_name`:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          group_name: action.value,
        },
      };
    default:
      return state;
  }
};
