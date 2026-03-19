export const initialState = {
  showFinancialDifficulties: '',
  showResidencyAppliedPermRes: '',
  showResidencyDomesticWorker: '',
  showResidencyPhysician: '',
  showResidencySkilledWorker: '',
  showLicense: '',
  showLicenseSuspended: '',
  showTrustee: '',
  user_partner_same_address_flag: '',
  user_partner_same_interview: false,
  user_partner_same_trustee: false,
  has_done_blood_urine_height_weight: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case '@@jointMetadata/update':
      return {
        ...state,
        [action.property]: action.value,
      };
    case '@@jointMetadata/reinit':
      return {
        ...initialState,
      };
    case '@@jointMetadata/debug':
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
};
