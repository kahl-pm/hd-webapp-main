import { push } from 'connected-react-router';
import { sentryError, segmentTrackEvent, TENANT_FLAGS, hasFlag } from '@policyme/global-libjs-utils';
import { getCurrentDisclosureID, getCurrentDisclosure } from '../Selectors/disclosure';
import {
  getDisclosureNextQuestion, patchDisclosureAnswer, getDisclosureSearch,
  postDisclosureSession, patchDisclosureSession,
} from './fetch';
import { sendEventAll } from './analytics';
import { incrementSeqNum, updateMetadata } from './metadata';
import { getDisclosureAnswerPayload } from './helpers/disclosure';
import { updateUserSession } from './session';
import { withRedirectOnFail, isEmpty, transformUserKey } from '../utils/helpers';
import {
  USER_TYPES, ROUTES, CRM_LIFE_SESSION_FIELDS, PM_PRODUCT_PREFIX,
} from '../utils/const';
import { doCrmSyncPatchDealAllProducts } from './crm';
import { getMainProductEventPrefix } from '../Selectors/helpers/productApp';
import { getUserSlice } from '../Selectors/userControl';

export const makeAddDisclosure = (slice, key = null) => {
  return (
    currentQuestionID,
    { aura_response, question_id, submitted, section_id },
  ) => {
    if (slice === USER_TYPES.DEPENDENT) {
      return {
        type: `@@dependents/add_disclosure`,
        key,
        data: aura_response,
        id: question_id,
        section_id,
        currentQuestionID,
        submitted,
      };
    }
    return {
      type: `@@${slice}/disclosure/add_disclosure`,
      data: aura_response,
      id: question_id,
      section_id,
      currentQuestionID,
      submitted,
    };
  };
};

export const addDisclosurePrimary = makeAddDisclosure(USER_TYPES.PRIMARY);
export const addDisclosureSecondary = makeAddDisclosure(USER_TYPES.SECONDARY);

export const makeUpdateDisclosureSearch = (slice, key = null) => {
  return (currentQuestionID, { aura_response, question_id }) => {
    if (slice === USER_TYPES.DEPENDENT) {
      return {
        type: `@@dependents/update_disclosure_search`,
        key,
        data: aura_response,
        id: question_id,
        currentQuestionID,
      };
    }
    return {
      type: `@@${slice}/disclosure/update_disclosure_search`,
      data: aura_response,
      id: question_id,
      currentQuestionID,
    };
  };
};
export const updateDisclosureSearchPrimary = makeUpdateDisclosureSearch(USER_TYPES.PRIMARY);
export const updateDisclosureSearchSecondary = makeUpdateDisclosureSearch(USER_TYPES.SECONDARY);

export const makeAnswerDisclosure = (slice, key = null) => {
  return (questionId, value) => {
    if (slice === USER_TYPES.DEPENDENT) {
      return {
        type: `@@dependents/answer_current_disclosure`,
        key,
        value,
        questionId,
      };
    }
    return {
      type: `@@${slice}/disclosure/answer_current_disclosure`,
      value,
      questionId,
    };
  };
};
export const answerDisclosurePrimary = makeAnswerDisclosure(USER_TYPES.PRIMARY);
export const answerDisclosureSecondary = makeAnswerDisclosure(USER_TYPES.SECONDARY);

export const makeRemoveDeletedDisclosure = (slice, key = null) => {
  return (id) => {
    if (slice === USER_TYPES.DEPENDENT) {
      return {
        type: `@@dependents/remove_disclosure`,
        key,
        id,
      };
    }
    return {
      type: `@@${slice}/disclosure/remove_disclosure`,
      id,
    };
  };
};
export const removeDeletedDisclosurePrimary = makeRemoveDeletedDisclosure(USER_TYPES.PRIMARY);
export const removeDeletedDisclosureSecondary = makeRemoveDeletedDisclosure(USER_TYPES.SECONDARY);

export const makeUpdateDisclosureSections = (slice, key = null) => {
  return (value) => {
    if (slice === USER_TYPES.DEPENDENT) {
      return {
        type: `@@dependents/update_disclosure_sections`,
        key,
        value,
      };
    }
    return {
      type: `@@${slice}/disclosure/update_disclosure_sections`,
      value,
    };
  };
};
export const updateDisclosureSectionsPrimary = makeUpdateDisclosureSections(USER_TYPES.PRIMARY);
export const updateDisclosureSectionsSecondary = makeUpdateDisclosureSections(USER_TYPES.SECONDARY);

export const makeAnswerCurrentQuestion = (userKey) => (value) => {
  return (dispatch, getState) => {
    const [userType, key] = transformUserKey(userKey);
    const question_id = getCurrentDisclosureID(getState(), userType, key);
    return dispatch(makeAnswerDisclosure(userType, key)(question_id, value));
  };
};
export const answerCurrentQuestionPrimary = makeAnswerCurrentQuestion(USER_TYPES.PRIMARY);
export const answerCurrentQuestionSecondary = makeAnswerCurrentQuestion(USER_TYPES.SECONDARY);

/**
 *
 * @param {String} userKey
 * @returns Bool if the next question is a base question
 */
export const getNextAuraDisclosure = (userKey) => {
  return async (dispatch, getState) => {
    const state = getState();
    const [userType, key] = transformUserKey(userKey);
    const userSlice = getUserSlice(state, userType, key);
    const { aura_session_id } = userSlice.session;
    const current_question_id = getCurrentDisclosureID(state);
    const res = await withRedirectOnFail(getDisclosureNextQuestion,
      dispatch, ROUTES.AURA_START_ERROR)(aura_session_id,
      (current_question_id === -1) ? 0 : current_question_id);

    // res includes the details from the next question including the question id,
    // current_question_id is there only as reference for injecting sub-questions
    dispatch(makeAddDisclosure(userType, key)(current_question_id, res));
    if ('parent_id' in res) {
      return isEmpty(res.parent_id);
    }

    return true;
  };
};

export function getAuraDisclosureSearch(userKey, search) {
  return (dispatch, getState) => {
    const [userType, key] = transformUserKey(userKey);
    const state = getState();
    const userSlice = getUserSlice(state, userType, key);
    const { aura_session_id } = userSlice.session;
    const question_id = getCurrentDisclosureID(getState());
    dispatch(updateMetadata('isSearchLoading', true));
    dispatch(incrementSeqNum(PM_PRODUCT_PREFIX.HD));
    const seq_num = getState().metadata.hd_seq_num;
    return getDisclosureSearch(
      aura_session_id, question_id, search,
    ).then(res => {
      // check if we are handling the latest request
      if (seq_num >= getState().metadata.hd_seq_num) {
        dispatch(makeUpdateDisclosureSearch(userType, key)(question_id, res));
        dispatch(updateMetadata('isSearchLoading', false));
      }
    });
  };
}

export function submitDisclosureAnswer(userKey) {
  return (dispatch, getState) => {
    const [userType, key] = transformUserKey(userKey);
    const userSlice = getUserSlice(getState(), userType, key);
    const { aura_session_id } = userSlice.session;
    const question_id = getCurrentDisclosureID(getState());
    const { question, answer } = getCurrentDisclosure(getState(), userType, key);
    const payload = getDisclosureAnswerPayload(question, answer);

    // aura_session_id, question_id, payload
    return withRedirectOnFail(
      patchDisclosureAnswer, dispatch, ROUTES.AURA_START_ERROR, sendAuraFailureStatus,
    )(
      aura_session_id, question_id, payload,
    ).then(res => {
      res.sub_questions.deleted.forEach(d => {
        dispatch(makeRemoveDeletedDisclosure(userType, key)(d));
      });
      return Promise.resolve();
    }).catch((err) => {
      sentryError(err, {
        extras: { source: 'submitDisclosureAnswer' },
        tags: { source: 'submitDisclosureAnswer' },
      });
      dispatch(push(ROUTES.AURA_START_ERROR));
      return Promise.reject(err);
    });
  };
}

export function unknownCurrentDisclosure(userKey) {
  return (dispatch, getState) => {
    const [userType, key] = transformUserKey(userKey);
    const userSlice = getUserSlice(getState(), userType, key);
    const { aura_session_id } = userSlice.session;

    const question_id = getCurrentDisclosureID(getState());
    const { answer, question } = getCurrentDisclosure(getState(), userType, key);
    const { questionType, ...restOfAnswer } = answer;
    const payload = {
      answer: {
        questionType,
        unknownAnswer: true,
      },
    };

    return patchDisclosureAnswer(
      aura_session_id, question_id, payload,
    ).then(res => {
      res.sub_questions.deleted.forEach(d => {
        dispatch(makeRemoveDeletedDisclosure(userType, key)(d));
      });
      return Promise.resolve();
    });
  };
}

export function getAuraDisclosureSession(userKey) {
  return async (dispatch, getState) => {
    const [userType, key] = transformUserKey(userKey);
    const state = getState();
    const userSlice = getUserSlice(state, userType, key);
    const {
      hd_application_id,
      aura_session_id, household_id: hh_info_id,
    } = userSlice.session;
    let auraSession;
    if (aura_session_id) {
      auraSession = await withRedirectOnFail(
        patchDisclosureSession,
        dispatch, ROUTES.AURA_START_ERROR, sendAuraFailureStatus,
      )(aura_session_id, { hh_info_id });
      dispatch(makeUpdateDisclosureSections(userType, key)(auraSession.sections));
    } else {
      auraSession = await withRedirectOnFail(
        postDisclosureSession,
        dispatch, ROUTES.AURA_START_ERROR, sendAuraFailureStatus,
      )(
        hd_application_id,
        hh_info_id,
      );
      dispatch(updateUserSession('aura_session_id', auraSession.session_id, userType, key));
      // NP2-2644
      // Let's only update sections when creating auraSession for now
      // there was a bug where the update sections return questions_ids that are reflective
      // questions if they've been answered before.
      // This screws up our primary <-> secondary switch logic & progress bar
      dispatch(makeUpdateDisclosureSections(userType, key)(auraSession.sections));
    }
    if ([USER_TYPES.PRIMARY, USER_TYPES.PARTNER].includes(userType)) {
      let productPrefix = getMainProductEventPrefix(getState(), userType);
      switch (true) {
        case hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED):
          // TODO: make this a TS file eventually; we want to use strict typing on event tracking
          segmentTrackEvent('eligible_for_coverage', { product_type: productPrefix, applicant_type: userType });
          break;
        case getState().userControl.hasPartnerApplication:
          dispatch(sendEventAll(`${productPrefix} - ${userType} Eligible For Coverage`));
          break;
        default:
          dispatch(sendEventAll(`${productPrefix} - Eligible For Coverage`));
          break;
      }
    }
  };
}

const sendAuraFailureStatus = () => {
  return (dispatch) => {
    const payload = {
      [CRM_LIFE_SESSION_FIELDS.AURA_SESSION_START_FLAG]: 'Y',
    };
    return dispatch(doCrmSyncPatchDealAllProducts(USER_TYPES.PRIMARY, payload));
  };
};

export const initializeAuraDisclosure = (key) => {
  return async (dispatch, getState) => {
    await dispatch(getAuraDisclosureSession(key));
    return dispatch(getNextAuraDisclosure(key));
  };
};
