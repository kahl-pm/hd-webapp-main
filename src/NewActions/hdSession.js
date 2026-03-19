import { sentryError } from '@policyme/global-libjs-utils';
import { getSessionQuotesInputs, getSessionSelectedQuotes } from '../Selectors/hdSession';
import { PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, USER_TYPES } from '../utils/const';
import { allUsers, getUserQuoteIdentifier, hasValue, makeUpdateProductSessionProp, withErrorModalOnFail } from '../utils/helpers';
import { fetchSessionQuotes, patchSessionQuotes, postSessionQuotes } from './fetch';
import { updateMetadata } from './metadata';
import { updateUserQuotes } from './quotes';
import { updateUserControlProp } from './userControl';
import { updateDependentQuotes, updateDependentSelectedHealthDentalPlan } from './dependents';
import { getDependent, getDependentKeys } from '../Selectors/dependents';
import { getPlansByTenant } from '../pages/health-and-dental/plans';

const updateSelectedHealthDentalPlan = (userType, planType) => {
  return {
    type: `@@${userType}/quotes/${PM_PRODUCT_PREFIX.HD}/select_hd_plan`,
    plan_type: planType,
  };
};

const getHealthDentalIndividualSessionQuotes = ({ userType, dependentKey, plansQuotes, state }) => {
  const userSlice = dependentKey ? getDependent(state, dependentKey) : state[userType];

  const userQuoteIdentifier = getUserQuoteIdentifier(userSlice.session, userSlice.household);

  if (!plansQuotes) {
    return null;
  }
  const individual = Object.entries(plansQuotes).reduce((quotes, [, planQuote]) => {
    const { individual: individual_quotes } = planQuote;
    const individual_price = individual_quotes.find(p => p.quote_id === userQuoteIdentifier);

    quotes.push({
      mn_prems: individual_price?.mn_prems,
      plan_type: individual_price?.plan_type,
      is_discounted: individual_price?.is_discounted || false,
    });

    return quotes;
  }, []);

  return individual;
};

export const setUserHealthDentalIndividualSessionQuotes = (userType, dependentKey, plansQuotes) => {
  return (dispatch, getState) => {
    if (userType === USER_TYPES.PRIMARY || userType === USER_TYPES.SECONDARY) {
      const state = getState();
      const individual = getHealthDentalIndividualSessionQuotes({
        userType,
        plansQuotes,
        state,
      });

      if (!hasValue(individual)) {
        return;
      }

      // Set individual quotes
      dispatch(updateUserQuotes(userType, PM_PRODUCT_PREFIX.HD)({
        individual,
      }));
    }
  };
};

export const setHealthDentalIndividualSessionQuotes =
  allUsers(setUserHealthDentalIndividualSessionQuotes);

export const setHealthDentalDependentSessionQuotes = (dependentKey, plansQuotes) => {
  return (dispatch, getState) => {
    const state = getState();
    const individual = getHealthDentalIndividualSessionQuotes({
      dependentKey,
      plansQuotes,
      state,
    });

    if (!hasValue(individual)) {
      return;
    }

    // Set individual quotes
    dispatch(
      updateDependentQuotes(dependentKey, PM_PRODUCT_PREFIX.HD, { userQuotes: { individual } }),
    );
  };
};

export const setHealthDentalOverallSessionQuotes = (plansQuotes) => {
  return (dispatch, getState) => {
    if (!plansQuotes) {
      return;
    }
    const overall = Object.entries(plansQuotes).reduce((quotes, [planType, planQuote]) => {
      const { overall: overall_quotes } = planQuote;

      // eslint-disable-next-line no-param-reassign
      quotes[planType] = {
        ...overall_quotes,
        has_add_on: false,
        selected: false,
      };

      return quotes;
    }, {});

    dispatch(updateUserControlProp('hd_quotes', overall));
  };
};

export const getHealthDentalSessionQuotes = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const quotes_input = getSessionQuotesInputs(state);
    const plansToFetch = getPlansByTenant(
      state.primary?.hdApp?.underwriting_method || UNDERWRITING_METHODS.GUARANTEED_ISSUE,
    );
    const session_plan_type = state.primary?.hdSession?.plan_type;

    if (quotes_input?.length) {
      const { data } = await withErrorModalOnFail(fetchSessionQuotes, dispatch)(
        { quotes_input, plans: plansToFetch },
      );
      let plans = data.plans;
      if (plans) {
        // set primary and secondary individual quotes for each plan
        dispatch(setHealthDentalIndividualSessionQuotes(plans));

        // set dependents individual quotes for each plan
        const dependents = getDependentKeys(state);
        dependents.forEach(dependentKey => {
          dispatch(setHealthDentalDependentSessionQuotes(dependentKey, plans));
        });

        // set overall quotes for each plan
        dispatch(setHealthDentalOverallSessionQuotes(plans));

        // If this is a refetch
        /// We have to make sure the plan we selected is the same after we fetch new quotes
        if (session_plan_type) {
          // set selected quote
          dispatch(updateHealthDentalSessionSelectedQuote(session_plan_type));
        }
      }
    }
  };
};

const updateHealthDentalSessionSelectedQuoteIndividual =
  allUsers((userType, dependentKey, planType) => {
    return (dispatch, getState) => {
      if (userType === USER_TYPES.PRIMARY || userType === USER_TYPES.SECONDARY) {
        dispatch(updateSelectedHealthDentalPlan(userType, planType));
        dispatch(makeUpdateProductSessionProp(userType, PM_PRODUCT_PREFIX.HD)('plan_type', planType));
      } else {
        dispatch(updateDependentSelectedHealthDentalPlan(dependentKey, planType));
      }
    };
  });

export const updateHealthDentalSessionSelectedQuote =
  (planType) => {
    return async (dispatch, getState) => {
      // Update individual selected quote
      await dispatch(
        updateHealthDentalSessionSelectedQuoteIndividual(planType),
      );

      // Update overall selected quote
      const { hd_quotes } = getState().userControl;

      dispatch(updateUserControlProp('hd_quotes', {
        ...Object.keys(hd_quotes).reduce((quotes, plan) => {
          // eslint-disable-next-line no-param-reassign
          quotes[plan] = {
            ...hd_quotes[plan],
            selected: plan === planType,
          };
          return quotes;
        }, {}),
      }));
    };
  };

export const upsertHealthDentalSessionQuotes = () => {
  return async (dispatch, getState) => {
    // INFO: we get session and family id from primary
    const { primary, metadata } = getState();
    const { hd_session_id, hd_family_id } = primary.session;
    const { hd_quotes_inserted } = metadata;

    // INFO: Get the selected quotes from the recently updated session
    const selectedQuotes = getSessionSelectedQuotes(getState());

    try {
      if (!hd_quotes_inserted) {
        const { data: inserted_quotes } = await postSessionQuotes(hd_session_id, {
          family_id: hd_family_id,
          quotes: selectedQuotes,
        });

        if (inserted_quotes?.length) {
          dispatch(updateMetadata('hd_quotes_inserted', true));
        }
      } else {
        // INFO: if quotes are already inserted we update them
        await patchSessionQuotes(hd_session_id, {
          family_id: hd_family_id,
          quotes: selectedQuotes,
        });
      }
    } catch (e) {
      sentryError(e, { tags: { rootCause: 'upsertSessionQuotes' } });
    }
  };
};
