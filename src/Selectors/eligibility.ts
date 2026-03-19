import { PM_PRODUCT_PREFIX, USER_TYPES, UserType } from '../utils/const';

// Life/CI eligibility logic removed for HD-only webapp.
// Functions are stubbed to maintain export compatibility.

const getIncomeMultiple = (_state) => {
  return 0;
};

const getCIIncomeMultiple = (_userType, _state) => {
  return 0;
};

const isEligible1 = (_state: any): boolean => {
  return true;
};

const isEligible2 = (_state: any): boolean => {
  return true;
};

const isEligible3 = (_state) => {
  return true;
};

export const getJointMaxEligibilityCI = (_state) => {
  return 0;
};

const isEligibleCI = (_state: any, _userType: UserType): boolean => {
  return false;
};

const getPreDecisionProductEligibleCoverage = (product, _state) => {
  // Only HD is relevant; Life/CI return empty defaults
  return {};
};

const getLifeEligibleCoverage = (_state) => {
  return 0;
};

const getCIEligibleCoverage = (_userType, _state) => {
  return 0;
};

const getMaxEligibleCoverage = (_state) => {
  return 0;
};

const getCIAcceleratedCoverage = (_ageNearest) => {
  return 0;
};

const isEligible = (_state: any, _income: number, _mortgage: number, _netWorth: number): boolean => {
  return true;
};

const getMaxEligibleTerm = (_state, _product) => {
  return undefined;
};

export {
  getLifeEligibleCoverage,
  getPreDecisionProductEligibleCoverage,
  getMaxEligibleCoverage,
  getCIEligibleCoverage,
  getCIAcceleratedCoverage,
  getIncomeMultiple,
  isEligible1,
  isEligible2,
  isEligible3,
  isEligible,
  isEligibleCI,
  getMaxEligibleTerm,
};
