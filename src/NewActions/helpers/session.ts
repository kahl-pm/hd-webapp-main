import { getRouteABTestOverride } from '../../components/Customisation/helpers';
import { getDisclosureRoute, getNextDisclosureID } from '../../Selectors/disclosure';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { getABTestBand } from '../../Selectors/metadata';
import { isJoint, isMortgageBroker } from '../../Selectors/userControl';
import {
  DISCLOSURE_STATUS_CODES,
  PM_PRODUCT_PREFIX,
  ROUTES,
} from '../../utils/const';
import { hasValue, stripTrailingSlash } from '../../utils/helpers';
import { ACTIVE_TESTS } from '../../ABTests';

const skipPhoneNumberPage = (state) => {
  const skipPrimaryPhone = state.metadata.primary.hasPreExistingPhoneNumber
    || hasValue(state.primary.household.phone);
  const skipSecondaryPhone = state.metadata.secondary.hasPreExistingPhoneNumber
    || hasValue(state.secondary.household.phone);
  if (!isJoint(state)) {
    return skipPrimaryPhone;
  }
  return skipPrimaryPhone && skipSecondaryPhone;
};

export function getDisclosureNextQuestionPathName(state, userType) {
  const disclosureId = getNextDisclosureID(state, userType);
  const mainProduct = getMainProduct(state, userType);
  if (disclosureId === DISCLOSURE_STATUS_CODES.NO_MORE_QUESTIONS) {
    const testBand = getABTestBand(state);
    const pathname = stripTrailingSlash(state.router.location.pathname);
    const generalizedPathname = pathname
      .split('/')
      .map((part, index, arr) => (index === arr.length - 1 ? ':id' : part))
      .join('/')
      .replace('/primary/', '/:userType/')
      .replace('/secondary/', '/:userType/');

    const routeOverride = getRouteABTestOverride(
      generalizedPathname, state, ACTIVE_TESTS, testBand,
    );
    if (routeOverride) {
      return routeOverride;
    }

    if (isMortgageBroker(state) && !isJoint(state) && hasValue(state.primary.household.phone)) {
      if (hasValue(state.metadata.user_lead_source)) {
        return ROUTES.APPLICATION_CONSENT;
      }
      return ROUTES.APPLICATION_REFERRER;
    }
    // Life/CI referrer redirect removed for HD-only flow
    if (skipPhoneNumberPage(state)) {
      if (isMortgageBroker(state) && state.metadata.user_lead_source !== '') {
        return ROUTES.APPLICATION_CONSENT;
      }
      return ROUTES.APPLICATION_REFERRER;
    }
    return ROUTES.APPLICATION_REFERRER;
  }
  return getDisclosureRoute(userType, disclosureId);
}
