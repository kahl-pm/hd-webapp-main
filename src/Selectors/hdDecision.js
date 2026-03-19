import { PM_PRODUCT_PREFIX } from '../utils/const';
import { makeGetAuraDecisionAnalyticsText } from './helpers/decision';

export function getHDAuraDecisionAnalyticsText(state, userType) {
  return makeGetAuraDecisionAnalyticsText(userType, PM_PRODUCT_PREFIX.HD)(state);
}

export function getFamilyExclusions(state) {
  const primaryExclusions = state.primary.hdDecision.exclusions;
  const secondaryExclusions = state.secondary.hdDecision.exclusions;
  const dependentsExclusions = state.dependents.dependent_keys.reduce((acc, key) => {
    acc[key] = state.dependents.dependents[key].decision.exclusions;
    return acc;
  }, {});

  return {
    primary: primaryExclusions,
    secondary: secondaryExclusions,
    dependents: dependentsExclusions,
  };
}

export function familyHasExclusions(familyExclusions) {
  const { primary = [], secondary = [], dependents = {} } = familyExclusions ?? {};
  return primary?.length ||
    secondary?.length ||
    Object.values(dependents).some(exclusions => exclusions?.length);
}

export function getFamilyDecision(state) {
  return state.primary.hdDecision.overall_decision;
}
