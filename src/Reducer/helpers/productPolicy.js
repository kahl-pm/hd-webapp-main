export const productPolicyState = {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
  premium_class: '',
  coverage_amount: '',
  annual_premiums_issued: '',
  annual_premiums_applied: '',
  monthly_premiums_issued: '',
  monthly_premiums_applied: '',
  original_monthly_premiums_issued: '',
  original_annual_premiums_issued: '',
  discounts: [],
  coverageAmount: '',
  term: '',
  quote_breakdown: {},
  add_ons_completed: false,
  digital_consent_status: '',
};

const makePolicyGeneralReducer = (userType, product) => (state, action) => {
  let updates = {};
  let updatedOption;
  switch (action.type) {
    case `@@${userType}/${product}Policy/update`:
    case `@@all/${product}Policy/update`:
      return {
        ...state,
        [action.property]: action.value,
      };
    case `@@all/${product}Policy/debug`:
    case `@@${userType}/${product}Policy/debug`:
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
};

export default makePolicyGeneralReducer;
