import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';

import { AURA_DISCLOSURE_TYPES } from '../../utils/const';

export const disclosureState = {
  disclosures: {},
  order: [],
  sections: [],
  submitted: false,
};

const emptyDisclosureAnswer = (data) => {
  switch (data.type) {
    case AURA_DISCLOSURE_TYPES.UNITIZED:
    case AURA_DISCLOSURE_TYPES.DATE:
      return {
        id: data.id,
        questionType: data.type,
        value: {},
      };
    case AURA_DISCLOSURE_TYPES.MULTIPLE_CHOICE:
      return {
        id: data.id,
        questionType: data.type,
        value: [],
      };
    case AURA_DISCLOSURE_TYPES.BLOOD_PRESSURE:
      return {
        id: data.id,
        questionType: data.type,
        value: [{
          systolic: '',
          diastolic: '',
        }],
      };
    default:
      return {
        id: data.id,
        questionType: data.type,
        value: '',
      };
  }
};

// updates any disclosure answers that are no longer valid.
// invalid criteria example:
// User answers a question and then goes back to change their information.
// When they get back to the same question, it can have different choices.
// the answer that they have previously saved may not be valid, so we should fix that
const filterInvalidDisclosureAnswer = (data, answer) => {
  if (
    answer.value === '' ||
    Object.keys(answer.value).length === 0 ||
    answer.value.length === 0
  ) {
    return answer;
  }
  let newValue = cloneDeep(answer.value);
  let choices;

  switch (answer.questionType) {
    case AURA_DISCLOSURE_TYPES.MULTIPLE_CHOICE:
      choices = data.constraints.choices;
      // removes value that are no longer in the list of choices
      // note this would mutate newValue by removing appropriate values from the list
      remove(newValue, val => {
        // returns true if we find any value that isn't in the list of choices
        return !choices.some(choice => choice.value === val);
      });
      break;
    case AURA_DISCLOSURE_TYPES.SINGLE_CHOICE:
      choices = data.constraints.choices;
      // if the answer is not in the choice list, we should reset it
      if (!choices.some(choice => choice.value === newValue)) {
        newValue = '';
      }
      break;
    default:
      break;
  }

  return {
    ...answer,
    value: newValue,
  };
};

export const makeDisclosureHelper = (slice) => {
  return (state, action) => {
    let currentQuestion;
    let currentQuestionID;
    let discard;
    let updatedAnswer;
    let updatedObject;
    switch (action.type) {
      case `@@${slice}/add_disclosure`:
        currentQuestionID = state.order.indexOf(action.currentQuestionID) + 1;
        if (action.submitted) {
          return {
            ...state,
            submitted: action.submitted,
          };
        }
        updatedAnswer = {};
        if (state.primary.disclosures[action.id]) {
          updatedAnswer = state.primary.disclosures[action.id].answer;
          updatedAnswer = filterInvalidDisclosureAnswer(action.data, updatedAnswer);
        }
        return {
          ...state,
          disclosures: {
            ...state.primary.disclosures,
            [action.id]: {
              ...state.primary.disclosures[action.id],
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
            ...state.order.slice(0, currentQuestionID),
            ...(state.order.indexOf(action.id) === -1 ? [action.id] : []),
            ...state.order.slice(currentQuestionID),
          ],
        };
      case `@@${slice}/update_disclosure_search`:
        currentQuestionID = state.order.indexOf(action.currentQuestionID) + 1;
        return {
          ...state,
          disclosures: {
            ...state.primary.disclosures,
            [action.id]: {
              ...state.primary.disclosures[action.id],
              question: {
                ...state.primary.disclosures[action.id].question,
                constraints: action.data.constraints,
              },
            },
          },
        };
      case `@@${slice}/answer_current_disclosure`:
        currentQuestion = state.primary.disclosures[action.questionId];
        if (typeof action.value === 'object') {
          switch (currentQuestion.answer.questionType) {
            case AURA_DISCLOSURE_TYPES.UNITIZED:
            case AURA_DISCLOSURE_TYPES.DATE:
              return {
                ...state,
                disclosures: {
                  ...state.primary.disclosures,
                  [action.questionId]: {
                    ...state.primary.disclosures[action.questionId],
                    answer: {
                      ...state.primary.disclosures[action.questionId].answer,
                      value: {
                        ...state.primary.disclosures[action.questionId].answer.value,
                        ...action.value,
                      },
                    },
                  },
                },
              };
            case AURA_DISCLOSURE_TYPES.MULTIPLE_CHOICE:
            case AURA_DISCLOSURE_TYPES.BLOOD_PRESSURE:
            case AURA_DISCLOSURE_TYPES.SEARCH:
              return {
                ...state,
                disclosures: {
                  ...state.primary.disclosures,
                  [action.questionId]: {
                    ...state.primary.disclosures[action.questionId],
                    answer: {
                      ...state.primary.disclosures[action.questionId].answer,
                      value: [
                        ...action.value,
                      ],
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
            disclosures: {
              ...state.primary.disclosures,
              [action.questionId]: {
                ...state.primary.disclosures[action.questionId],
                answer: {
                  ...state.primary.disclosures[action.questionId].answer,
                  value: action.value,
                },
              },
            },
          };
        }
      case `@@${slice}/remove_disclosure`:
        ({
          [action.id]: discard, // use destructuring to remove specified key/value from object
          ...updatedObject
        } = state.primary.disclosures);
        return {
          ...state,
          disclosures: {
            ...updatedObject,
          },
          order: state.order.filter(o => o !== action.id),
        };
      case `@@${slice}/update_disclosure_sections`:
        return {
          ...state,
          sections: action.value,
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
};
