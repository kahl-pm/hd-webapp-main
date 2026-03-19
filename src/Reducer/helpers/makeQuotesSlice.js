import { combineReducers } from 'redux';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import quotes from '../quotes';

const makeQuotesSlice = (user) => (combineReducers({
  [PM_PRODUCT_PREFIX.HD]: quotes(user, PM_PRODUCT_PREFIX.HD),
}));

export default makeQuotesSlice;
