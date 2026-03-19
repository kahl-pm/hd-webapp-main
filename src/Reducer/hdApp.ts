import cloneDeep from 'lodash/cloneDeep';
import { productAppInitialState } from './helpers/productApp';
import { UNDERWRITING_METHODS } from '../utils/const';
import { HdApp } from '../store/types/State';

const appInitialState = cloneDeep(productAppInitialState);
const initialState: HdApp = {
  birthplace: '',
  birthplace_provstate: '',
  ...appInitialState,
  underwriting_method: UNDERWRITING_METHODS.GUARANTEED_ISSUE,
};

const makeHdAppReducer = (slice) => (state = initialState, action) => {
  switch (action.type) {
    case `@@${slice}/update`:
    case `@@all/hdApp/update`:
      return {
        ...state,
        [action.property]: action.value,
      };
    case `@@${slice}/debug`:
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
};

export default (user) => (state = initialState, action) => (
  makeHdAppReducer(`${user}/hdApp`)(state, action));
