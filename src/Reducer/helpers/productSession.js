import { CUSTOM_QUOTE_ID, QUOTE_TYPES, JOINT_ROLES } from '../../utils/const';

export const productSessionState = {
  selected_quote: '',
  selected_term: '',
  term: '',
  override_amt: '', // TODO: this is being used for life and ci, but we will change it to make more sense later
  selected_quote_type: QUOTE_TYPES.PRIMARY,
  joint_role: JOINT_ROLES.NONE,
  max_eligible_coverage: '',
};

export const makeProductSessionReducer = (userType, product) => {
  return (state, action) => {
    let updates = {};
    let updatedOption;
    switch (action.type) {
      case `@@${userType}/${product}/session/update_options`:
      case `@@all/${product}/session/update_options`:
        return {
          ...state,
          options: action.value,
        };
      case `@@${userType}/${product}/session/bulk_update`:
      case `@@all/${product}/session/bulk_update`:
        return {
          ...state,
          ...action.value,
        };
      case `@@${userType}/${product}/session/update`:
      case `@@all/${product}/session/update`:
        return {
          ...state,
          [action.property]: action.value,
        };
      case `@@${userType}/${product}/session/update_term`:
      case `@@all/${product}/session/update_term`:
        return {
          ...state,
          selected_quote: '',
          selected_term: action.value,
        };
      case `@@${userType}/${product}/session/update_custom_coverage`:
      case `@@all/${product}/session/update_custom_coverage`:
        return {
          ...state,
          override_amt: action.value,
        };
      case `@@${userType}/${product}/session/reset_quote_selection`:
      case `@@all/${product}/session/reset_quote_selection`:
        return {
          ...state,
          selected_quote: '',
        };
      case `@@${userType}/${product}/session/debug`:
      case `@@all/${product}/session/debug`:
        return {
          ...state,
          ...action.value,
        };
      case `@@${userType}/${product}/session/update_custom_selected_quote`: // select custom quote from query params
      case `@@all/${product}/session/update_custom_selected_quote`:
        return {
          ...state,
          selected_quote: CUSTOM_QUOTE_ID,
        };
      default:
        return state;
    }
  };
};
