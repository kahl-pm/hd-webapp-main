import { CRM_LIFE_SESSION_FIELDS, PM_PRODUCT_PREFIX, USER_TYPES } from '../utils/const';
import { fromNullToStr } from '../utils/helpers';
import { addDependent, updateDependentDecision, updateDependentHousehold, updateDependentSession } from './dependents';
import { initialState as sessionState } from '../Reducer/session';
import { initialState as hdDecisionState } from '../Reducer/hdDecision';
import { initialState as hdPolicyState } from '../Reducer/hdPolicy';
import { setHealthDentalDependentSessionQuotes } from './hdSession';
import { getDependentKeys } from '../Selectors/dependents';

const sessionStateKeys = Object.keys(sessionState);
const hdDecisionStateKeys = Object.keys(hdDecisionState);
const hdPolicyStateKeys = Object.keys(hdPolicyState);

export const hydrateDependentPolicyInfo = (data) => {
  return async (dispatch, getState) => {
    const { health_dental } = fromNullToStr(data);
    const hasHDPremiums = health_dental.annual_premium || health_dental.monthly_premium;

    if (data.hh_info_id || hasHDPremiums) {
      // Add the dependent
      dispatch(addDependent());

      const dependents_keys = getDependentKeys(getState());

      // Get added dependent
      const dependent_key = dependents_keys[dependents_keys.length - 1];

      dispatch(updateDependentSession(dependent_key, 'household_id', data.hh_info_id));
      dispatch(updateDependentSession(dependent_key, 'household_id_vers', 0));

      dispatch(updateDependentHousehold(dependent_key, 'email', data.email));
      dispatch(updateDependentHousehold(dependent_key, 'firstName', data.user_first_name));
      dispatch(updateDependentHousehold(dependent_key, 'lastName', data.user_last_name));
      dispatch(updateDependentHousehold(dependent_key, 'userGender', data.user_gender));
      dispatch(updateDependentHousehold(dependent_key, 'smoke', data.user_smoker));
      dispatch(updateDependentHousehold(dependent_key, 'birthdate', data.user_birthdate));
      dispatch(updateDependentHousehold(dependent_key, 'address_line1', data.address_line1));
      dispatch(updateDependentHousehold(dependent_key, 'address_line2', data.address_line2));
      dispatch(updateDependentHousehold(dependent_key, 'province', data.province));
      dispatch(updateDependentHousehold(dependent_key, 'healthcard_province', data.healthcard_province));
      dispatch(updateDependentHousehold(dependent_key, 'city', data.city));
      dispatch(updateDependentHousehold(dependent_key, 'country', data.country));
      dispatch(updateDependentHousehold(dependent_key, 'postal_code', data.postal_code));
      dispatch(updateDependentHousehold(dependent_key, 'application_language', data.application_language));
      dispatch(updateDependentHousehold(dependent_key, 'user_family_composition', data.user_family_composition));

      if (hasHDPremiums) {
        dispatch(hydrateDependentProductInfo(dependent_key, health_dental));
        if (health_dental.plan_type) {
          // TODO: check if needed for dependent
          // Rehydrate plan_type for after payment drop journey
          // dispatch(
          //  makeUpdatePaymentDetails(USER_TYPES.DEPENDENT)('planType', health_dental.plan_type)
          // );
        }
      } else {
        // hydrate without post decision related info
        dispatch(
          hydrateDependentAppInfo(dependent_key, health_dental),
        );
      }
    }
  };
};

const hydrateDependentProductInfo = (dependentKey, hdProduct) => {
  return async (dispatch, getState) => {
    Object.keys(hdProduct).forEach(key => {
      if (key === 'risks') {
        dispatch(updateDependentDecision(dependentKey, 'risks', hdProduct[key]));
      } else if (sessionStateKeys.includes(key)) {
        // hydrate session related states (including completed status of approved steps)
        dispatch(updateDependentSession(dependentKey, key, hdProduct[key]));
      } else if (sessionStateKeys.includes(`${PM_PRODUCT_PREFIX.HD}_${key}`)) {
        // hydrate session fields that has product prefix e.g. hd_policy_id
        dispatch(updateDependentSession(dependentKey, `${PM_PRODUCT_PREFIX.HD}_${key}`, hdProduct[key]));
      } else if (hdDecisionStateKeys.includes(key)) {
        // hydrate decision related states (active_decision, risks, policy_status)
        dispatch(updateDependentDecision(dependentKey, key, hdProduct[key]));
      }
    });

    // update error flag
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, hdProduct.error_flag ? 'Y' : 'N'));

    // update selected quote for health and dental
    dispatch(setHealthDentalDependentSessionQuotes(dependentKey, hdProduct.quote_breakdown));
  };
};

const hydrateDependentAppInfo = (dependentKey, hdProduct) => {
  return async (dispatch, getState) => {
    Object.keys(hdProduct).forEach(key => {
      if (sessionStateKeys.includes(key)) {
        // hydrate session related states (including completed status of approved steps)
        dispatch(updateDependentSession(dependentKey, key, hdProduct[key]));
      } else if (sessionStateKeys.includes(`${PM_PRODUCT_PREFIX.HD}_${key}`)) {
        // hydrate session fields that has product prefix e.g. hd_policy_id
        dispatch(updateDependentSession(dependentKey, `${PM_PRODUCT_PREFIX.HD}_${key}`, hdProduct[key]));
      }
    });

    // update selected quote for health and dental
    dispatch(setHealthDentalDependentSessionQuotes(dependentKey, hdProduct.quote_breakdown));
  };
};
