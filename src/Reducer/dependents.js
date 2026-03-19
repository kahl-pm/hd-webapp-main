import shortid from 'shortid';
import { AURA_DISCLOSURE_TYPES } from '../utils/const';
import { filterInvalidDisclosureAnswer, emptyDisclosureAnswer } from './disclosure';

const initialState = {
  // Needed to order the rows correctly cross-browsr on the UI since JavaScript objects don't
  // guarantee order
  // dependent_keys keeps track of the creation order of the dependents
  dependent_keys: [],
  dependents: {}, // nested object
};

export const emptyDependent = (session, household, quotes, decision, disclosure) => {
  return {
    session,
    household,
    quotes,
    decision,
    disclosure,
  };
};

const dependentReducer = (state = initialState, action) => {
  let updateddependentsObject;
  let discard;
  let dependent_key;
  let currentQuestion;
  let currentQuestionID;
  let updatedAnswer;
  let updatedObject;
  let disclosure;
  switch (action.type) {
    // clears the Dependent field
    case `@@dependents/clear_dependents`:
      return {
        ...state,
        dependent_keys: [],
        dependents: {},
      };
    case `@@dependents/update_dependent`:
      if (!state.dependents[action.key]) return state;
      updateddependentsObject = {
        ...state.dependents[action.key],
        [action.property]: action.value,
      };
      return {
        ...state,
        dependents: {
          ...state.dependents,
          [action.key]: updateddependentsObject,
        },
      };
      // should add Dependent & Dependent_key
    case `@@dependents/add_dependent`:
      dependent_key = shortid.generate();
      return {
        ...state,
        dependent_keys: (
          [...state.dependent_keys, dependent_key]
        ),
        dependents: {
          ...state.dependents,
          [dependent_key]: emptyDependent(
            action.session,
            action.household,
            action.quotes,
            action.decision,
            action.disclosure,
          ),
        },
      };
      // should remove Dependent & Dependent_key
    case `@@dependents/remove_dependent`:
      if (!state.dependents[action.key]) return state;
      ({
        [action.key]: discard, // use destructuring to remove specified key/value from object
        ...updateddependentsObject
      } = state.dependents);
      return {
        ...state,
        dependent_keys:
            state.dependent_keys.filter(key => key !== action.key),
        dependents: {
          ...updateddependentsObject, // store object except the one with given key
        },
      };
    case `@@dependents/add_disclosure`:
      if (!state.dependents[action.key]) return state;
      disclosure = state.dependents[action.key].disclosure;
      currentQuestionID = disclosure.order.indexOf(action.currentQuestionID) + 1;
      if (action.submitted) {
        return {
          ...state,
          dependents: {
            ...state.dependents,
            [action.key]: { ...state.dependents[action.key],
              submitted: action.submitted },
          },
        };
      }
      updatedAnswer = {};
      if (disclosure.disclosures[action.id]) {
        updatedAnswer = disclosure.disclosures[action.id].answer;
        updatedAnswer = filterInvalidDisclosureAnswer(action.data, updatedAnswer);
      }
      return {
        ...state,
        dependents: {
          ...state.dependents,
          [action.key]: {
            ...state.dependents[action.key],
            disclosure: {
              ...disclosure,
              disclosures: {
                ...disclosure.disclosures,
                [action.id]: {
                  ...disclosure.disclosures[action.id],
                  question: {
                    ...action.data,
                  },
                  answer: {
                    ...emptyDisclosureAnswer(action.data),
                    ...updatedAnswer,
                  },
                  section_id: action.section_id,
                },
              },
              order: [
                ...disclosure.order.slice(0, currentQuestionID),
                ...(disclosure.order.indexOf(action.id) === -1 ? [action.id] : []),
                ...disclosure.order.slice(currentQuestionID),
              ],
            },
          },
        },
      };
    case `@@dependents/update_disclosure_search`:
      if (!state.dependents[action.key]) return state;
      disclosure = state.dependents[action.key].disclosure;
      currentQuestionID = disclosure.order.indexOf(action.currentQuestionID) + 1;
      return {
        ...state,
        dependents: {
          ...state.dependents,
          [action.key]: {
            ...state.dependents[action.key],
            disclosure: {
              ...disclosure,
              disclosures: {
                ...disclosure.disclosures,
                [action.id]: {
                  ...disclosure.disclosures[action.id],
                  question: {
                    ...disclosure.disclosures[action.id].question,
                    constraints: action.data.constraints,
                  },
                },
              },
            },
          },
        },
      };
    case `@@dependents/answer_current_disclosure`:
      if (!state.dependents[action.key]) return state;
      disclosure = state.dependents[action.key].disclosure;
      currentQuestion = disclosure.disclosures[action.questionId];
      if (typeof action.value === 'object') {
        switch (currentQuestion.answer.questionType) {
          case AURA_DISCLOSURE_TYPES.UNITIZED:
          case AURA_DISCLOSURE_TYPES.DATE:
            return {
              ...state,
              dependents: {
                ...state.dependents,
                [action.key]: {
                  ...state.dependents[action.key],
                  disclosure: {
                    ...disclosure,
                    disclosures: {
                      ...disclosure.disclosures,
                      [action.questionId]: {
                        ...disclosure.disclosures[action.questionId],
                        answer: {
                          ...disclosure.disclosures[action.questionId].answer,
                          value: {
                            ...disclosure.disclosures[action.questionId].answer.value,
                            ...action.value,
                          },
                        },
                      },
                    },
                  },
                },
              },
            };
          case AURA_DISCLOSURE_TYPES.MULTIPLE_CHOICE:
          case AURA_DISCLOSURE_TYPES.BLOOD_PRESSURE:
          case AURA_DISCLOSURE_TYPES.SEARCH:
            if (!state.dependents[action.key]) return state;
            return {
              ...state,
              dependents: {
                ...state.dependents,
                [action.key]: {
                  ...state.dependents[action.key],
                  disclosure: {
                    ...disclosure,
                    disclosures: {
                      ...disclosure.disclosures,
                      [action.questionId]: {
                        ...disclosure.disclosures[action.questionId],
                        answer: {
                          ...disclosure.disclosures[action.questionId].answer,
                          value: [
                            ...action.value,
                          ],
                        },
                      },
                    },
                  },
                },
              },
            };
          default:
            return state;
        }
      } else {
        return {
          ...state,
          dependents: {
            ...state.dependents,
            [action.key]: {
              ...state.dependents[action.key],
              disclosure: {
                ...disclosure,
                disclosures: {
                  ...disclosure.disclosures,
                  [action.questionId]: {
                    ...disclosure.disclosures[action.questionId],
                    answer: {
                      ...disclosure.disclosures[action.questionId].answer,
                      value: action.value,
                    },
                  },
                },
              },
            },
          },
        };
      }
    case `@@dependents/remove_disclosure`:
      if (!state.dependents[action.key]) return state;
      disclosure = state.dependents[action.key].disclosure;
      ({
        [action.id]: discard, // use destructuring to remove specified key/value from object
        ...updatedObject
      } = disclosure.disclosures);
      return {
        ...state,
        dependents: {
          ...state.dependents,
          [action.key]: {
            ...state.dependents[action.key],
            disclosures: {
              ...updatedObject,
            },
            order: state.order.filter(o => o !== action.id),
          },
        },
      };
    case `@@dependents/update_disclosure_sections`:
      if (!state.dependents[action.key]) return state;
      disclosure = state.dependents[action.key].disclosure;
      return {
        ...state,
        dependents: {
          ...state.dependents,
          [action.key]: {
            ...state.dependents[action.key],
            disclosure: {
              ...disclosure,
              sections: action.value,
            },
          },
        },
      };
    case `@@dependents/debug`:
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
};

export default dependentReducer;
