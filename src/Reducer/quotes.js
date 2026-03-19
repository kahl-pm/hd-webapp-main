import { CUSTOM_QUOTE_ID, QUOTE_TYPES } from '../utils/const';

export const initialState = {
  userQuotes: {},
  recmdQuotes: {},
  maxCovQuotes: {},
  noMedicalQuotes: {},
  discountCodes: [],
};

const makeQuotesReducer = (user, product) => (state = initialState, action) => {
  let updates = {};
  let userQuotesTypeKey;
  let userQuotesData = [];
  let customQuoteIndex = -1;
  let value;

  switch (action.type) {
    case `@@${user}/quotes/${product}/update`:
    case `@@all/quotes/${product}/update`:
      return {
        ...state,
        [action.property]: action.value,
      };
    case `@@${user}/quotes/${product}/update_custom`:
    case `@@all/quotes/${product}/update_custom`:
      if (action.quote_type === QUOTE_TYPES.PRIMARY ||
          action.quote_type === QUOTE_TYPES.SECONDARY) {
        userQuotesTypeKey = 'individual';
        if (state.userQuotes.individual) {
          userQuotesData = state.userQuotes.individual;
        }
      } else if (action.quote_type === QUOTE_TYPES.JOINT) {
        userQuotesTypeKey = 'joint';
        if (state.userQuotes.joint) {
          userQuotesData = state.userQuotes.joint;
        }
      }
      customQuoteIndex = userQuotesData.findIndex(q => q.id === CUSTOM_QUOTE_ID);
      // a python None value can make its way to the front end here, replace it with
      // something JS-friendly
      if (action.value === 'None') {
        if (action.property === 'mn_prems' || action.property === 'yr_prems') {
          value = 0;
        } else {
          value = undefined;
        }
      } else {
        value = action.value;
      }

      // add a new custom quote and update the given key/value
      if (customQuoteIndex === -1) {
        return {
          ...state,
          userQuotes: {
            ...state.userQuotes,
            [userQuotesTypeKey]: [
              ...userQuotesData,
              {
                id: CUSTOM_QUOTE_ID,
                invalid: false,
                product_enum: 0,
                term: 0, // this may be overridden
                [action.property]: value,
              },
            ],
          },
        };
      }
      // custom quote already exists, just update the given key/value
      return {
        ...state,
        userQuotes: {
          ...state.userQuotes,
          [userQuotesTypeKey]: [
            ...userQuotesData.slice(0, customQuoteIndex),
            {
              ...userQuotesData[customQuoteIndex],
              invalid: false,
              product_enum: 0,
              [action.property]: value,
            },
            ...userQuotesData.slice(customQuoteIndex + 1),
          ],
        },
      };
    case `@@${user}/quotes/${product}/select_hd_plan`:
      return {
        ...state,
        userQuotes: {
          ...state.userQuotes,
          individual: state.userQuotes.individual.map(plan_quote => {
            if (plan_quote.plan_type === action.plan_type) {
              return {
                ...plan_quote,
                selected: true,
              };
            }
            return {
              ...plan_quote,
              selected: false,
            };
          }),
        },
      };
    case `@@${user}/quotes/${product}/addDiscount`:
    case `@@all/quotes/${product}/addDiscount`:
      if (state.discountCodes && state.discountCodes.includes(action.value)) {
        return state;
      }
      return {
        ...state,
        discountCodes: [...state.discountCodes, action.value],
      };
    case `@@${user}/quotes/${product}/removeDiscount`:
    case `@@all/quotes/${product}/removeDiscount`:
      return {
        ...state,
        discountCodes: state.discountCodes.filter(discount => discount !== action.value),
      };
    case `@@${user}/quotes/${product}/debug`:
    case `@@all/quotes/${product}/debug`:
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
};

export default (user, product) => (state = initialState, action) => (
  makeQuotesReducer(user, product)(state, action));
