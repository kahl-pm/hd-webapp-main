import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
    showFinancialDifficulties: '',
    showResidencyAppliedPermRes: '',
    showResidencyDomesticWorker: '',
    showResidencyPhysician: '',
    showResidencySkilledWorker: '',
    showLicense: '',
    showLicenseSuspended: '',
    showSecondaryBeneficiaries: '',
    showTrustee: '',
    couple_beneficiaries_flag: '',
    user_partner_same_address_flag: '',
    user_partner_same_interview: false,
    user_partner_same_trustee: false,
    user_partner_same_secondary_beneficiary: false,
    has_done_blood_urine_height_weight: '',
  },
  [STATES_ENUM.DEV_INIT]: {
    showFinancialDifficulties: '',
    showResidencyAppliedPermRes: '',
    showResidencyDomesticWorker: '',
    showResidencyPhysician: '',
    showResidencySkilledWorker: '',
    showLicense: '',
    showLicenseSuspended: '',
    showSecondaryBeneficiaries: '',
    showTrustee: '',
    showPendingPolicies: '',
    showReplacingPolicies: '',
    couple_beneficiaries_flag: '',
    user_partner_same_address_flag: '',
    user_partner_same_interview: false,
    user_partner_same_trustee: false,
    user_partner_same_secondary_beneficiary: false,
    has_done_blood_urine_height_weight: false,
  },
  [STATES_ENUM.JOINT]: {
    showFinancialDifficulties: '',
    showResidencyAppliedPermRes: '',
    showResidencyDomesticWorker: '',
    showResidencyPhysician: '',
    showResidencySkilledWorker: '',
    showLicense: '',
    showLicenseSuspended: '',
    showSecondaryBeneficiaries: '',
    showTrustee: '',
    showPendingPolicies: 'N',
    showReplacingPolicies: '',
    couple_beneficiaries_flag: '',
    user_partner_same_address_flag: 'Y',
    user_partner_same_interview: false,
    user_partner_same_trustee: false,
    user_partner_same_secondary_beneficiary: false,
    has_done_blood_urine_height_weight: false,
  },
};

export class JointMetadata {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setJointMetadataProp(propName, val) {
    this[propName] = val;
    return this;
  }
}
