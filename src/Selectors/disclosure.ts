import { createMatchSelector } from 'connected-react-router';

import {
  ROUTES, ROUTE_REGEX,
  DISCLOSURE_STATUS_CODES, USER_TYPES, UserType,
} from '../utils/const';
import { isEmpty, hasValue, isEmptyObj, transformUserKey } from '../utils/helpers';
import { getMainProductEventPrefix } from './helpers/productApp';
import { getUserSlice } from './userControl';

export interface DisclosureQuestion {
  id: number;
  text: string;
  context: string[];
  type: string;
  helpText: string;
}

export interface DisclosureAnswer {
  id: number;
  questionType: string;
  value: string;
}
export interface Disclosure {
  section_id?: number;
  question?: DisclosureQuestion;
  answer?: DisclosureAnswer;
}

export interface DisclosureSection {
  id?: number;
  question_ids?: number[];
  title?: string;
}

// used to translate parts of routes like /:id/ into actual values
type MatchParams = { userType: UserType, id: string };
const matchSelector = createMatchSelector<any, MatchParams>({
  path: ROUTES.APPLICATION_DISCLOSURE_INTEGRATION,
});

const getCurrentDisclosure = (state:any):Disclosure => {
  const userKey = getCurrentDisclosureUserType(state);
  if (!userKey) return {};
  const [userType, key] = transformUserKey(userKey);
  const userSlice = getUserSlice(state, userType, key);
  if (!userType) {
    return {};
  }
  const {
    disclosures,
  } = userSlice?.disclosure;
  return disclosures[getCurrentDisclosureID(state)] || {};
};

const getCurrentDisclosureUserType = (state:any):UserType => {
  const match = matchSelector(state);
  if (match) {
    return match.params.userType;
  }
  return undefined;
};

const getCurrentDisclosureID = (state:any):number => {
  const match = matchSelector(state);
  if (match) {
    const currentQuestionIndex = match.params.id;
    return parseInt(currentQuestionIndex, 10);
  }
  return -1;
};

export const getNextDisclosureIDFromCurrent = (currentQuestionID:number, order:number[]):number => {
  const currentQuestionIndex = order.indexOf(currentQuestionID);
  if (currentQuestionID === -1) {
    return order[0];
  } else if (currentQuestionIndex === order.length - 1) {
    return DISCLOSURE_STATUS_CODES.NO_MORE_QUESTIONS;
  }
  return order[order.indexOf(currentQuestionID) + 1];
};

const getNextDisclosureID = (state:any, userKey:UserType):number => {
  const [userType, key] = transformUserKey(userKey);
  const userSlice = getUserSlice(state, userType, key);
  const {
    order,
  } = userSlice.disclosure;
  const { pathname } = state.router.location;
  if (pathname === ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER ||
    pathname === ROUTES.APPLICATION_PENDING_POLICIES ||
    pathname === ROUTES.APPLICATION_PRIMARY_TRANSITION ||
    pathname === ROUTES.START_APP ||
    pathname === ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF
  ) {
    return order[0];
  } else if (pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION)) {
    return getNextDisclosureIDFromCurrent(getCurrentDisclosureID(state), order);
  }
  return DISCLOSURE_STATUS_CODES.NOT_IN_DISCLOSURE_SECTION;
};

const getDisclosureSections = (state:any):DisclosureSection[] => {
  const userKey = getCurrentDisclosureUserType(state);
  const [userType, key] = transformUserKey(userKey);
  const userSlice = getUserSlice(state, userType, key);
  return userSlice?.disclosure.sections ?? [];
};

const getCurrentDisclosureSectionID = (state:any):number => {
  const currentDisclosure = getCurrentDisclosure(state);
  if (isEmpty(currentDisclosure.section_id)) {
    return -1;
  }
  return currentDisclosure.section_id;
};

const getCurrentDisclosureSection = (state:any):DisclosureSection => {
  const { sections } = state.primary.disclosure;
  const sectionId = getCurrentDisclosureSectionID(state);
  const currentSection = sections.find(section => section.id === sectionId);
  if (isEmpty(currentSection)) {
    return {};
  }
  return currentSection;
};

const retrieveOrderSections = (state:any, userType:UserType) => {
  if (userType === USER_TYPES.PRIMARY || userType === USER_TYPES.SECONDARY) {
    const {
      order, sections,
    } = state[userType].disclosure;
    return { order, sections };
  }
  const {
    order, sections,
  } = state.dependents.dependents[userType].disclosure;
  return { order, sections };
};

// These will return the base question id that the primary was answering
// (even if they were in a reflective question)
const getCurrentBaseDisclosureID = (state:any, userKeyType:UserType):number => {
  const current_disclosure = getCurrentDisclosure(state);
  let [userType, key] = transformUserKey(userKeyType);
  if (!isEmptyObj(current_disclosure)) {
    const { order, sections } = retrieveOrderSections(state, userKeyType);
    let disclosure_id = current_disclosure.question.id;
    const index = order.indexOf(disclosure_id);
    for (let i = index; i >= 0; i--) {
      disclosure_id = order[i];
      if (sections[current_disclosure.section_id].question_ids.includes(disclosure_id)) {
        return disclosure_id;
      }
    }
  }
  return -1;
};

const isLastDisclosureID = (state:any, userType:UserType):boolean => {
  return getNextDisclosureID(state, userType) === DISCLOSURE_STATUS_CODES.NO_MORE_QUESTIONS;
};

// used to check if the next disclosure is a base question
const isNextDisclosureABaseDisclosure = (state:any, userKey:UserType):boolean => {
  const [userType, key] = transformUserKey(userKey);
  const userSlice = getUserSlice(state, userType, key);
  const {
    sections,
    disclosures,
  } = userSlice.disclosure;
  const nextDisclosureID = getNextDisclosureID(state, userKey);
  if (nextDisclosureID > 0) {
    const nextDisclosure = disclosures[nextDisclosureID] || {};
    if (!isEmptyObj(nextDisclosure)) {
      return sections[nextDisclosure.section_id].question_ids.includes(nextDisclosureID);
    }
  }
  return false;
};

const getDisclosureRoute = (userType:UserType, disclosureId:number):string => {
  return ROUTES.APPLICATION_DISCLOSURE_INTEGRATION
    .replace(':userType', userType)
    .replace(':id', String(disclosureId));
};

export {
  getCurrentDisclosure,
  getCurrentDisclosureID,
  getNextDisclosureID,
  getDisclosureSections,
  getCurrentDisclosureSectionID,
  getCurrentDisclosureSection,
  getCurrentBaseDisclosureID,
  isLastDisclosureID,
  isNextDisclosureABaseDisclosure,
  getCurrentDisclosureUserType,
  getDisclosureRoute,
};
