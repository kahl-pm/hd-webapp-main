import { sentryError } from '@policyme/global-libjs-utils';
import { doCrmSyncUpsertContactAndDeal } from './crm';
import {
  postAuraDecisionCalc, postOverallAuraDecisionCalc, getAuthUserInfo,
} from './fetch';
import { makeUpdateDecisionProp, populateDependentDecision, populateProductDecision } from './helpers/productDecision';
import {
  CRM_LIFE_SESSION_FIELDS, USER_TYPES, PM_PRODUCT_PREFIX,
} from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { allProducts, allUsers, allUsersParallel, fromNullToStr, isEmptyObj } from '../utils/helpers';
import { updateDependentDecision } from './dependents';
import { getHDAuraDecisionAnalyticsText } from '../Selectors/hdDecision';
import { getUserSlice } from '../Selectors/userControl';
import { hydrateUserPolicyInfo } from './auth';
import { updateMetadata } from './metadata';

export const startAuraOverallDecisionCalc = allProducts((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policy_id = state[userType].session[`${product}_policy_id`];

    try {
      const { overall_decision } = await postOverallAuraDecisionCalc({
        policy_id,
      });

      dispatch(makeUpdateDecisionProp(userType, product)('overall_decision', overall_decision));
    } catch (error) {
      console.log(error);
      sentryError(error, { tags: { rootCause: 'aura_overall_decision_calc' } });
    }
  };
});

// handleGIHydration removed: Life/CI GI hydration not needed for HD-only flow

// No-op: Life/CI decision calc removed for HD-only flow.
// HD uses startAuraHDDecisionCalc instead.
export const startAuraDecisionCalc = (userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
};

export const _handleAuraHDDecisionCalc = (userType, dependentKey) => {
  return async (dispatch, getState) => {
    let state = getState();
    let hd_has_any_debits;

    const userSlice = getUserSlice(state, userType, dependentKey);
    // INFO: for HD we have a single policy so we use the primary policy id
    const { hd_policy_id } = state.primary.session;
    const household_id = userSlice.session.household_id;

    try {
      const res = await postAuraDecisionCalc(hd_policy_id, {
        hh_info_id: household_id,
      });

      const { health_dental } = res;
      hd_has_any_debits = health_dental?.has_any_debits;

      if (health_dental) {
        if (userType === USER_TYPES.DEPENDENT) {
          dispatch(populateDependentDecision(dependentKey, health_dental));
        } else {
          dispatch(populateProductDecision(userType, PM_PRODUCT_PREFIX.HD, health_dental));
        }
      }
    } catch (error) {
      if (userType === USER_TYPES.DEPENDENT) {
        dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'Y'));
      } else {
        dispatch(makeUpdateDecisionProp(userType, PM_PRODUCT_PREFIX.HD)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'Y'));
      }
      return Promise.reject(error);
    }

    if (userType === USER_TYPES.PRIMARY) {
      state = getState();

      const risk_state = state[userType].hdDecision.risks;

      if (risk_state) {
        const risksDisplayed = risk_state.filter((riskObj) => riskObj.customerFriendlyReason !== '')
          .slice(undefined, 3);
        const risks_selected_for_display = risksDisplayed.map((riskObj) => riskObj.risk);
        const reasons = risksDisplayed.map((riskObj) => riskObj.customerFriendlyReason);
        const payload = {
          [CRM_LIFE_SESSION_FIELDS.AURA_RISKS_SELECTED_FOR_DISPLAY]: risks_selected_for_display.join(' | '),
          [CRM_LIFE_SESSION_FIELDS.CUSTOMER_FRIENDLY_AURA_REASONS_DISPLAYED]: reasons.join(' | '),
        };
        // sync aura risks info
        return dispatch(doCrmSyncUpsertContactAndDeal(userType, payload));
      }
    }
    return Promise.resolve();
  };
};

export const startAuraHDDecisionCalc = allUsersParallel(_handleAuraHDDecisionCalc);

export const updateUserDecision = (property, value, userType, key = null, product = null) => {
  return (dispatch, getState) => {
    if (userType === USER_TYPES.DEPENDENT) {
      return dispatch(updateDependentDecision(key, property, value));
    }
    return dispatch(makeUpdateDecisionProp(userType, product)(property, value));
  };
};
