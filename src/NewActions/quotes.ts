import { sentryError } from '@policyme/global-libjs-utils';
import { incrementSeqNum, updateMetadata, getSeqNum } from './metadata';
import { fetchQuotes } from './helpers/productFetch';
import { doCrmSyncPatchContact, doCrmSyncPatchDeal } from './crm';
import { updateSelectedQuoteToInsurer } from './helpers/productSession';
import { getJointMaxEligibilityCI } from '../Selectors/eligibility';

import { withErrorModalOnFail, hasValue, debounceByKey } from '../utils/helpers';
import { saveCoverageAndTermCookies } from './cookies';
import { CRM_CONTACT_FIELDS, CRM_LIFE_SESSION_FIELDS, QUOTE_TYPES, USER_TYPES, INSURERS, PM_PRODUCT_PREFIX, UserType } from '../utils/const';
import { getPreDecisionFetchQuotesPayload, getPostDecisionFetchQuotesPayload, getFetchQuotesPrimaryData, getFetchQuotesSecondaryData } from './helpers/quotes';
import { updateDependentQuotes } from './dependents';
import { getHealthDentalSessionQuotes, updateHealthDentalSessionSelectedQuote } from './hdSession';

const DEBOUNCE_MILLIS = 300;

export const updateUserQuotes = (userType, product) => (value) => {
  return (dispatch, getState) => {
    dispatch(updateQuotesProp(userType, product)('userQuotes', value));
  };
};

export const updateRecmdQuotes = (userType, product) => (value) => {
  return (dispatch, getState) => {
    dispatch(updateQuotesProp(userType, product)('recmdQuotes', value));
  };
};

export const updateMaxCovQuotes = (userType, product) => (value) => {
  return (dispatch, getState) => {
    dispatch(updateQuotesProp(userType, product)('maxCovQuotes', value));
  };
};

export const replaceUserQuotesWithMaxCovQuotes = (userType, product) => {
  return (dispatch, getState) => {
    const state = getState();
    let { maxCovQuotes } = state[userType].quotes[product];
    if (maxCovQuotes) {
      return dispatch(updateUserQuotes(userType, product)(maxCovQuotes));
    }
    return sentryError('Max Coverage Quotes not found');
  };
};

export const updateQuotesProp = (user, product) => (property, value) => {
  return {
    type: `@@${user}/quotes/${product}/update`,
    property,
    value,
  };
};

export const updateQuotesCustom = (user, product) => (property, value, quote_type) => {
  return {
    type: `@@${user}/quotes/${product}/update_custom`,
    property,
    value,
    quote_type,
  };
};

export const addQuotesDiscount = (user, product) => (value) => {
  return {
    type: `@@${user}/quotes/${product}/addDiscount`,
    value,
  };
};

export const removeQuotesDiscount = (user, product) => (value) => {
  return {
    type: `@@${user}/quotes/${product}/removeDiscount`,
    value,
  };
};

export const updateSavings = (userType, product) => {
  return (dispatch, getState) => {
    // Savings comparison only applies to Life insurance quotes — no-op for HD-only webapp
  };
};

export type RequoteRequest = {
  type: 'predecision',
  userType: string,
  product: string,
  seq_num: number,
  recmdFlag: boolean,
  maxCovFlag: boolean,
} | {
  type: 'postdecision',
  userType: string,
  product: string,
  seq_num: number,
} | {
  type: 'preview',
  userType: string,
  product: string,
  seq_num: number,
  customCov: number,
  customTerm: number,
  setData: (data:any, userType?: UserType) => any,
  isPreDecision: boolean,
  enableQuotesCopilot?: boolean,
};

export const sendPreDecisionRequote = async (
  dispatch,
  getState,
  seq_num,
  request:RequoteRequest,
) => {
  if (request.type !== 'predecision') {
    throw new TypeError('sendPreDecisionRequote called with non-predecision request');
  }
  const {
    userType,
    product,
    recmdFlag,
    maxCovFlag,
  } = request;
  const state = getState();
  if (product === PM_PRODUCT_PREFIX.HD) {
    return dispatch(getHealthDentalSessionQuotes());
  }
  let fetchArgs;
  if (maxCovFlag) {
    let maxCov = getJointMaxEligibilityCI(state);
    fetchArgs =
      getPreDecisionFetchQuotesPayload(userType, product)(state, seq_num, false, maxCov);
  } else {
    fetchArgs =
      getPreDecisionFetchQuotesPayload(userType, product)(state, seq_num, recmdFlag);
  }

  return fetchQuotes(product, fetchArgs)
    .then(async (fetchedData) => {
      // make sure we are handling current request
      let curr_seq_num = dispatch(getSeqNum(product));
      const selected_quote_type = getState()[userType][`${product}Session`].selected_quote_type;
      const primary_data = getFetchQuotesPrimaryData(fetchedData);
      const secondary_data = getFetchQuotesSecondaryData(fetchedData);
      if (seq_num === curr_seq_num) {
        await dispatch(updateMetadata('isQuoting', false));
        if (maxCovFlag) {
          dispatch(updateMaxCovQuotes(USER_TYPES.PRIMARY, product)(primary_data));
          if (secondary_data) {
            dispatch(updateMaxCovQuotes(USER_TYPES.SECONDARY, product)(secondary_data));
          }
        } else if (recmdFlag) {
          dispatch(updateRecmdQuotes(USER_TYPES.PRIMARY, product)(primary_data));
          if (secondary_data) {
            dispatch(updateRecmdQuotes(
              USER_TYPES.SECONDARY,
              product,
            )(secondary_data));
          }
        } else if (selected_quote_type === QUOTE_TYPES.SECONDARY
          && fetchedData.data.secondary === undefined) {
          // We made a request for secondary quotes, but the API returns them
          // under primary.  Since we expect secondary quotes in this role
          // move the quotes from primary to secondary
          dispatch(updateUserQuotes(USER_TYPES.SECONDARY, product)(primary_data));
        } else {
          dispatch(updateUserQuotes(USER_TYPES.PRIMARY, product)(primary_data));
          if (secondary_data) {
            dispatch(updateUserQuotes(USER_TYPES.SECONDARY, product)(secondary_data));
          }
        }
        return curr_seq_num;
      }

      // There is a newer request pending, shut this down
      return Promise.resolve();
    })
    .then((curr_seq_num) => {
      if (seq_num === curr_seq_num) {
        dispatch(updateSavings(userType, product));
        dispatch(saveCoverageAndTermCookies());
      }
    })
    .catch(async (err) => {
      sentryError(err, { extras: fetchArgs });

      // only reject if this request is part of the current request
      // (seq_num matches what's in state)
      // otherwise resolve since another request will recover from this error
      const curSeqNum = await dispatch(getSeqNum(product));
      if (seq_num === getSeqNum(product)) {
        return Promise.reject(err);
      }
      // Fail quotes request if tenant error to trigger error modal
      if (err?.message && err.message.includes('Tenant code not found')) {
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
};

export const sendPostDecisionRequote = async (
  dispatch,
  getState,
  seq_num,
  request:RequoteRequest,
) => {
  if (request.type !== 'postdecision') {
    throw new TypeError('sendPostDecisionRequote called with non-postdecision request');
  }
  const {
    userType,
    product,
  } = request;
  const state = getState();
  const fetchArgs = getPostDecisionFetchQuotesPayload(userType, product)(state, seq_num);

  return fetchQuotes(product, fetchArgs, true)
    .then(async (fetchedData) => {
      // make sure we are handling current request
      let curr_seq_num = dispatch(getSeqNum(product));
      const data = {
        individual: fetchedData.data[userType],
        joint: fetchedData.data.joint,
        seq_num: fetchedData.data.seq_num,
      };
      if (seq_num === curr_seq_num) {
        await dispatch(updateMetadata('isQuoting', false));
        dispatch(updateUserQuotes(userType, product)(data));
        return curr_seq_num;
      }

      // There is a newer request pending, shut this down
      return Promise.resolve();
    })
    .then((curr_seq_num) => {
      if (seq_num === curr_seq_num) {
        dispatch(updateSavings(userType, product));
        dispatch(saveCoverageAndTermCookies());
      }
    })
    .catch(async (err) => {
      // @ts-ignore sentryError type is Record<string,string> which throws error
      // when fetchArgs has values that are bools
      sentryError(err, { extras: fetchArgs });

      // only reject if this request is part of the current request
      // (seq_num matches what's in state)
      // otherwise resolve since another request will recover from this error
      const curSeqNum = await dispatch(getSeqNum(product));
      if (seq_num === getSeqNum(product)) {
        return Promise.reject(err);
      }
      // Fail quotes request if tenant error to trigger error modal
      if (err?.message && err.message.includes('Tenant code not found')) {
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
};

// Works like the above function but instead of setting state it takes a function to set the results
export const sendPreviewRequote = async (dispatch, getState, seq_num, request:RequoteRequest) => {
  if (request.type !== 'preview') {
    throw new TypeError('sendPreviewRequote called with non-preview request');
  }
  const {
    userType,
    product,
    customCov,
    customTerm,
    setData,
    isPreDecision,
    enableQuotesCopilot,
  } = request;
  const state = getState();
  let fetchArgs;
  if (isPreDecision) {
    fetchArgs = getPreDecisionFetchQuotesPayload(userType, product)(
      state, seq_num, false, customCov, customTerm,
    );
  } else {
    fetchArgs = getPostDecisionFetchQuotesPayload(userType, product)(
      state, seq_num, customCov, customTerm,
    );
  }
  const withDebits = !isPreDecision;
  return fetchQuotes(product, fetchArgs, withDebits)
    .then(async (fetchedData) => {
      // make sure we are handling current request
      const curr_seq_num = dispatch(getSeqNum(product));
      const primary_data = getFetchQuotesPrimaryData(fetchedData);
      const secondary_data = getFetchQuotesSecondaryData(fetchedData);
      if (seq_num === curr_seq_num) {
        await dispatch(updateMetadata('isQuoting', false));
        if (enableQuotesCopilot) {
          setData(primary_data, USER_TYPES.PRIMARY);
          if (secondary_data) {
            setData(secondary_data, USER_TYPES.SECONDARY);
          }
        } else {
          if (userType === USER_TYPES.PRIMARY) setData(primary_data);
          if (userType === USER_TYPES.SECONDARY) setData(secondary_data);
        }
        return curr_seq_num;
      }

      // There is a newer request pending, shut this down
      return Promise.resolve();
    })
    .then((curr_seq_num) => {
      if (seq_num === curr_seq_num) {
        dispatch(updateSavings(userType, product));
      }
    })
    .catch(async (err) => {
      sentryError(err, { extras: fetchArgs });

      // only reject if this request is part of the current request
      // (seq_num matches what's in state)
      // otherwise resolve since another request will recover from this error
      const curSeqNum = await dispatch(getSeqNum(product));
      if (seq_num === getSeqNum(product)) {
        return Promise.reject(err);
      }
      // Fail quotes request if tenant error to trigger error modal
      if (err?.message && err.message.includes('Tenant code not found')) {
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
};

export const debouncedRequote = debounceByKey(
  async (request, dispatch, getState) => {
    dispatch(incrementSeqNum(request.product));
    const seq_num = dispatch(getSeqNum(request.product));
    const doUpdates =
      request.type === 'postdecision' ||
      (request.type === 'predecision' && !request.maxCovFlag && !request.recmdFlag);

    let response;
    switch (request.type) {
      case 'predecision':
        response = await withErrorModalOnFail(sendPreDecisionRequote, dispatch)(
          dispatch, getState, seq_num, request,
        );
        break;
      case 'postdecision':
        response = await withErrorModalOnFail(sendPostDecisionRequote, dispatch)(
          dispatch, getState, seq_num, request,
        );
        break;
      case 'preview':
        response = await withErrorModalOnFail(sendPreviewRequote, dispatch)(
          dispatch, getState, seq_num, request,
        );
        break;
      default:
        break;
    }

    if (doUpdates) {
      // use PM as the selected quote
      dispatch(updateSelectedQuoteToInsurer(INSURERS.PM, request.product));
      if (request.type === 'predecision' && request.product === PM_PRODUCT_PREFIX.HD) {
        const planType = getState().metadata.planTypeStartApp;
        dispatch(updateHealthDentalSessionSelectedQuote(planType));
      }
    }

    return response;
  },
  (request) => `${request.userType}-${request.product}-${request.type}`,
  DEBOUNCE_MILLIS,
);

export function requoteMaxCov(userType, product) {
  return (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    return debouncedRequote({
      type: 'predecision',
      userType,
      product,
      recmdFlag: false,
      maxCovFlag: true,
    }, dispatch, getState);
  };
}

export function preDecisionRequoteActual(userType, product) {
  return async (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    debouncedRequote({
      type: 'predecision',
      userType,
      product,
      recmdFlag: false,
      maxCovFlag: false,
    }, dispatch, getState);
  };
}

export function postDecisionRequoteActual(userType, product) {
  return async (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    debouncedRequote({
      type: 'postdecision',
      userType,
      product,
    }, dispatch, getState);
  };
}

export function preDecisionRequotePreview(userType, product, customCov, customTerm, setData, enableQuotesCopilot = false) {
  return async (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    debouncedRequote({
      type: 'preview',
      userType,
      product,
      customCov,
      customTerm,
      setData,
      isPreDecision: true,
      enableQuotesCopilot,
    }, dispatch, getState);
  };
}

export function postDecisionRequotePreview(userType, product, customCov, customTerm, setData) {
  return async (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    debouncedRequote({
      type: 'preview',
      userType,
      product,
      customCov,
      customTerm,
      setData,
      isPreDecision: false,
    }, dispatch, getState);
  };
}

export function requoteRecmd(userType, product) {
  return (dispatch, getState) => {
    if (!getState().metadata.isQuoting) {
      dispatch(updateMetadata('isQuoting', true));
    }
    return debouncedRequote({
      type: 'predecision',
      userType,
      product,
      recmdFlag: true,
      maxCovFlag: false,
    }, dispatch, getState);
  };
}

export function patchQuotesToContactAndDeal(userType) {
  return (dispatch, getState) => {
    const { savings } = getState().metadata;
    let quoteComparisonSavings = 0;

    // replace all non digit by space, since savings has value of type string ex: $300.23 or $--
    quoteComparisonSavings = hasValue(savings) && Number(savings.replace(/[^0-9.]/g, ''));
    // if quoteComparisonSavings has value
    if (hasValue(quoteComparisonSavings)) {
      quoteComparisonSavings = parseFloat(String(quoteComparisonSavings));
    }

    const contactPayload = {
      [CRM_CONTACT_FIELDS.QUOTES_COMPARISON_SAVINGS]: quoteComparisonSavings,
    };

    dispatch(doCrmSyncPatchContact(userType, PM_PRODUCT_PREFIX.HD, contactPayload));

    const dealPayload = {
      [CRM_LIFE_SESSION_FIELDS.QUOTES_COMPARISON_SAVINGS]: quoteComparisonSavings,
    };

    return dispatch(doCrmSyncPatchDeal(userType, PM_PRODUCT_PREFIX.HD, dealPayload));
  };
}

export const updateUserQuotesProp = (property, value, userType, key = null, product = null) => {
  return (dispatch, getState) => {
    if (userType === USER_TYPES.DEPENDENT) {
      return dispatch(updateDependentQuotes(key, property, value));
    }
    return dispatch(updateQuotesProp(userType, product)(property, value));
  };
};
