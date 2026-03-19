import { PM_PRODUCT_PREFIX } from '../utils/const';
import { initialState as sessionInitialState } from '../Reducer/session';
import { initialState as hhInitialState } from '../Reducer/household';
import { initialState as quotesInitialState } from '../Reducer/quotes';
import { initialState as decisionInitialState } from '../Reducer/hdDecision';
import { initialState as disclosureInitialState } from '../Reducer/disclosure';

export const updateDependent = (key, property, value) => {
  return {
    type: `@@dependents/update_dependent`,
    key,
    property,
    value,
  };
};

const _updateDependentSubSlice = (slice) => (key, property, value) => {
  return (dispatch, getState) => {
    const obj = {
      ...getState().dependents.dependents[key][slice],
      [property]: value,
    };
    dispatch(updateDependent(key, slice, obj));
  };
};
export const updateDependentSubSliceWithKey = (slice, key) => (property, value) => {
  return (dispatch, getState) => {
    const obj = {
      ...getState().dependents.dependents[key].household,
      [property]: value,
    };
    dispatch(updateDependent(key, slice, obj));
  };
};

export const updateDependentHousehold = _updateDependentSubSlice('household');
export const updateDependentSession = _updateDependentSubSlice('session');
export const updateDependentQuotes = _updateDependentSubSlice('quotes');
export const updateDependentDecision = _updateDependentSubSlice('decision');

const updateSelectedPlanBooleanProp =
  (dependentKey, planType, property, value) => {
    return (dispatch, getState) => {
      const dependentHDQuotes = getState().dependents.dependents[dependentKey].quotes.hd;
      dispatch(updateDependentQuotes(dependentKey, PM_PRODUCT_PREFIX.HD, {
        userQuotes: {
          ...dependentHDQuotes.userQuotes,
          individual: dependentHDQuotes.userQuotes.individual.map(plan_quote => {
            if (plan_quote.plan_type === planType) {
              return {
                ...plan_quote,
                [property]: value ?? !plan_quote[property],
              };
            }
            return {
              ...plan_quote,
              [property]: false,
            };
          }),
        },
      }));
    };
  };

export const updateDependentSelectedHealthDentalPlan = (dependentKey, planType) => {
  return (dispatch, getState) => {
    dispatch(updateSelectedPlanBooleanProp(dependentKey, planType, 'selected', true));
  };
};

export const addDependent = () => {
  return {
    type: `@@dependents/add_dependent`,
    session: sessionInitialState,
    household: hhInitialState,
    quotes: {
      hd: quotesInitialState,
    },
    decision: decisionInitialState,
    disclosure: disclosureInitialState,
  };
};

export const removeDependent = (key) => {
  return {
    type: `@@dependents/remove_dependent`,
    key,
  };
};

export const clearDependents = () => {
  return {
    type: `@@dependents/clear_dependents`,
  };
};

export function extractDependentInfo(state) {
  const depKeys = state.dependents.dependent_keys;
  const depData = state.dependents.dependents;
  const res = {};

  depKeys.forEach(key => {
    const depHousehold = depData[key].household;
    res[key] = {
      userGender: depHousehold.userGender,
      birthdate: depHousehold.birthdate,
      healthcard_province: depHousehold.healthcard_province,
      app_lang: depHousehold.application_language,
    };
  });
  return JSON.stringify(res);
}

export function updateDepStateFromCookie(store, dependentStr) {
  const dependents = JSON.parse(dependentStr);
  Object.entries(dependents).forEach(([key, data]) => {
    store.dispatch(addDependent());
    const depKeyArr = store.getState().dependents.dependent_keys;
    const depKey = depKeyArr[depKeyArr.length - 1];
    store.dispatch(updateDependentHousehold(depKey, 'healthcard_province', data.healthcard_province));
    store.dispatch(updateDependentHousehold(depKey, 'birthdate', data.birthdate));
    store.dispatch(updateDependentHousehold(depKey, 'userGender', data.userGender));
    store.dispatch(updateDependentHousehold(depKey, 'application_language', data.app_lang));
  });
}
