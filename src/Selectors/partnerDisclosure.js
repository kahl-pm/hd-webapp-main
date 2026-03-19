import { createMatchSelector } from 'connected-react-router';

import {
  ROUTES, ROUTE_REGEX,
  DISCLOSURE_STATUS_CODES,
  USER_TYPES,
} from '../utils/const';
import { isEmptyObj } from '../utils/helpers';
import { getMainProductEventPrefix } from './helpers/productApp';

const partnerMatchSelector = createMatchSelector(
  { path: ROUTES.APPLICATION_PARTNER_DISCLOSURE_INTEGRATION },
);

const getPartnerCurrentDisclosureID = (state) => {
  const match = partnerMatchSelector(state);
  if (match) {
    const currentQuestionIndex = match.params.id;
    return parseInt(currentQuestionIndex, 10);
  }
  return -1;
};

const getPartnerCurrentDisclosure = (state) => {
  const {
    disclosures,
  } = state.secondary.disclosure;
  return disclosures[getPartnerCurrentDisclosureID(state)] || {};
};

const getPartnerNextDisclosureID = (state) => {
  const {
    order,
  } = state.secondary.disclosure;
  const { pathname } = state.router.location;
  if (pathname.match(ROUTE_REGEX.APPLICATION_PARTNER_DISCLOSURE_INTEGRATION)) {
    const currentQuestionID = getPartnerCurrentDisclosureID(state);
    const currentQuestionIndex = order.indexOf(currentQuestionID);
    if (currentQuestionID === -1) {
      return order[0];
    } else if (currentQuestionIndex === order.length - 1) {
      return DISCLOSURE_STATUS_CODES.NO_MORE_QUESTIONS;
    }
    return order[order.indexOf(currentQuestionID) + 1];
  }
  return DISCLOSURE_STATUS_CODES.NOT_IN_DISCLOSURE_SECTION;
};

// used to check if the next disclosure is a base question
const isPartnerNextDisclosureABaseDisclosure = (state) => {
  const {
    partnerDisclosure: { disclosures },
    disclosure: { sections },
  } = state;

  const nextDisclosureID = getPartnerNextDisclosureID(state);
  if (nextDisclosureID > 0) {
    const nextDisclosure = disclosures[nextDisclosureID] || {};

    if (!isEmptyObj(nextDisclosure)) {
      return sections[nextDisclosure.section_id].question_ids.includes(nextDisclosureID);
    }
  }
  return false;
};

export {
  getPartnerCurrentDisclosureID,
  getPartnerCurrentDisclosure,
  getPartnerNextDisclosureID,
  isPartnerNextDisclosureABaseDisclosure,
};
