import Cookie from 'js-cookie';
import { State } from '../store/types/State';
import { ProductType } from '../utils/const';
import { getProductFromCurrRoute } from './helpers/productApp';
import { isLoggedInUser } from './userControl';

/**
 * The retrieval for the main product for the external advisor flow varies
 * depending on the route and the metadata. This function will return the
 * main product for the external advisor flow.
 * Priority: 1. Current Route 2. Post App Main Product 3. Pre App Main Product
 * @param state State
 * @returns ProductType -> 'life' | 'hd' | 'ci' | ''
 */
export const getMainProductExternalAdvisor = (state: State): ProductType | '' => {
  const mainProduct = getProductFromCurrRoute(state) ||
    state.metadata.postAppMainProduct ||
    state.metadata.preAppMainProduct;

  return mainProduct;
};

const getExternalAdvisorId = (state: State): string => {
  const mainProduct = getMainProductExternalAdvisor(state);

  return state.primary[`${mainProduct}App`]?.external_advisor_id || '';
};

const hasExternalAdvisor = (state: State): boolean => {
  return !!getExternalAdvisorId(state);
};

const isInExternalAdvisorMode = (state: State): boolean => {
  return hasExternalAdvisor(state) && state.metadata.externalAdvisorMode;
};

const isPurchaseMode = (state: State): boolean => {
  return state.metadata.externalAdvisorMode && state.metadata.purchaseMode;
};

const isInBackdoorMode = (state: State): boolean => {
  return (
    Cookie.get('backdoor_flag') === 'true' &&
    isLoggedInUser(state) &&
    Cookie.get('portal_owner_id') !== undefined
  );
};

export {
  getExternalAdvisorId,
  isInExternalAdvisorMode,
  isPurchaseMode,
  hasExternalAdvisor,
  isInBackdoorMode,
};
