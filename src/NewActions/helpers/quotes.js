import { isPolicymePartner as isPolicymePartnerSelector, isPolicymeEmployee as isPolicymeEmployeeSelector, isJoint as isJointSelector, hasDependents as hasDependentsSelector } from '../../Selectors/userControl';
import { getQuotesDiscountCodes } from '../../Selectors/quotes';
import { USER_TYPES, POLICIES_IS_SMOKER } from '../../utils/const';
import { getProductSessionTerm, getProductTotalAmt, getProductApplicationDate, getProductDiscountCodes } from '../../Selectors/helpers/productSession';
import { isCAAEnvironment } from '../../tenant/helpers';
import { getAppInsuranceOwnershipType, getAppUnderwritingMethod } from '../../Selectors/helpers/productApp';

const _getQuotesPayloadCommonFields = (state, product) => {
  let isJoint = isJointSelector(state);
  let hasDependents = hasDependentsSelector(state);
  let application_date = getProductApplicationDate(state, USER_TYPES.PRIMARY, product);

  let {
    primary: {
      household: { birthdate, userGender }, [`${product}Decision`]: { uw_total_debits, uw_flat_extra_debits },
    }, secondary: {
      household: {
        birthdate: partnerBirthdate, userGender: partnerGender,
      }, [`${product}Decision`]: {
        uw_total_debits: partner_uw_total_debits,
        uw_flat_extra_debits: partner_uw_flat_extra_debits,
      },
    },
  } = state;
  let [day, mon, yr] = birthdate.split('/').map(x => parseInt(x, 10));
  let [partnerDay, partnerMon, partnerYr] = partnerBirthdate.split('/').map(x => parseInt(x, 10));

  return {
    isJoint,
    hasDependents,

    day,
    mon,
    yr,
    userGender,

    partnerDay,
    partnerMon,
    partnerYr,
    partnerGender,

    uw_total_debits,
    uw_flat_extra_debits,
    partner_uw_total_debits,
    partner_uw_flat_extra_debits,
    application_date,
  };
};

export const getPreDecisionFetchQuotesPayload = (userType, product) => (
  state, seq_num, recmdFlag = false, customCov = 0, customTerm = 0
) => {
  let amt;
  let term = customTerm || getProductSessionTerm(state, USER_TYPES.PRIMARY, product);
  let partnerAmt = getProductTotalAmt(state, USER_TYPES.SECONDARY, product);
  let partnerTerm = getProductSessionTerm(state, USER_TYPES.SECONDARY, product);
  let smoke = state.primary.household.smoke;
  let partnerSmoke = state.secondary.household.smoke;
  if (recmdFlag) {
    // For HD-only flow, use product session's recmd_cov_amt
    amt = state[userType][`${product}Session`]?.recmd_cov_amt || 0;
  } else {
    amt = customCov || getProductTotalAmt(state, USER_TYPES.PRIMARY, product);
  }

  let discount_codes = [];
  // add discount codes
  discount_codes = getQuotesDiscountCodes(state, userType, product);

  const insurance_ownership_type = getAppInsuranceOwnershipType(state, userType, product);
  const underwriting_method = getAppUnderwritingMethod(state, userType, product);
  return {
    ..._getQuotesPayloadCommonFields(state, product),
    amt,
    term,
    partnerAmt,
    partnerTerm,
    smoke,
    partnerSmoke,
    seq_num,
    discount_codes,
    insurance_ownership_type,
    underwriting_method,
  };
};

export const getPostDecisionFetchQuotesPayload = (userType, product) => (
  state, seq_num, customCov = 0, customTerm = 0,
) => {
  let amt = customCov || state.primary[`${product}Policy`].coverageAmount;
  let term = customTerm || state.primary[`${product}Policy`].term;
  let partnerAmt = state.secondary[`${product}Policy`].coverageAmount;
  let partnerTerm = state.secondary[`${product}Policy`].term;
  let smoke = POLICIES_IS_SMOKER[state.primary[`${product}Policy`].premium_class];
  let partnerSmoke = POLICIES_IS_SMOKER[state.secondary[`${product}Policy`].premium_class];

  let discount_codes = [];
  // add discount codes
  discount_codes = getProductDiscountCodes(state, userType, product);

  const insurance_ownership_type = getAppInsuranceOwnershipType(state, userType, product);
  const underwriting_method = getAppUnderwritingMethod(state, userType, product);
  return {
    ..._getQuotesPayloadCommonFields(state, product),
    amt,
    term,
    partnerAmt,
    partnerTerm,
    smoke,
    partnerSmoke,
    seq_num,
    discount_codes,
    insurance_ownership_type,
    underwriting_method,
  };
};

export const getFetchQuotesPrimaryData = (fetchedData) => {
  const primary_data = {
    individual: fetchedData.data.primary,
    joint: fetchedData.data.joint,
    seq_num: fetchedData.data.seq_num,
  };
  return primary_data;
};

export const getFetchQuotesSecondaryData = (fetchedData) => {
  const secondary_data = fetchedData.data.secondary ? {
    individual: fetchedData.data.secondary,
    joint: fetchedData.data.joint,
    seq_num: fetchedData.data.seq_num,
  } : null;
  return secondary_data;
};
