import moment from 'moment';

import {
  AURA_DISCLOSURE_TYPES, AURA_DISCLOSURE_DATE_TYPES, PM_DATE_FORMAT,
  AURA_EXACT_DATE_FORMAT, PM_MONTH_YEAR_FORMAT, AURA_MONTH_YEAR_FORMAT,
} from '../../utils/const';

export const getDisclosureAnswerPayload = (question, answer) => {
  let transformedAnswer;
  let restOfAnswer;
  let value;
  let choices;

  switch (answer.questionType) {
    case AURA_DISCLOSURE_TYPES.UNITIZED:
      ({ value, ...restOfAnswer } = answer);
      transformedAnswer = {
        ...restOfAnswer,
        ...value,
      };
      break;
    case AURA_DISCLOSURE_TYPES.DATE:
      ({ value, ...restOfAnswer } = answer);
      transformedAnswer = {
        ...restOfAnswer,
        ...value,
      };
      if (transformedAnswer.dateFormat === AURA_DISCLOSURE_DATE_TYPES.EXACT_DATE) {
        const dateTime = moment(transformedAnswer.value, PM_DATE_FORMAT)
          .format(AURA_EXACT_DATE_FORMAT);
        transformedAnswer.value = dateTime;
      } else if (transformedAnswer.dateFormat === AURA_DISCLOSURE_DATE_TYPES.MONTH_YEAR) {
        const dateTime = moment(transformedAnswer.value, PM_MONTH_YEAR_FORMAT)
          .format(AURA_MONTH_YEAR_FORMAT);
        transformedAnswer.value = dateTime;
      }
      break;
    case AURA_DISCLOSURE_TYPES.MULTIPLE_CHOICE:
      ({ value, ...restOfAnswer } = answer);
      choices = question.constraints.choices;
      transformedAnswer = {
        ...restOfAnswer,
        answers: [
          ...value.map(v => choices.find(c => c.value === v)),
        ],
      };
      break;
    case AURA_DISCLOSURE_TYPES.BLOOD_PRESSURE:
      ({ value, ...restOfAnswer } = answer);
      choices = question.constraints.choices;
      transformedAnswer = {
        ...restOfAnswer,
        readings: value,
      };
      break;
    case AURA_DISCLOSURE_TYPES.SEARCH:
      ({ value, ...restOfAnswer } = answer);
      value = value.map(choice => {
        const { label, ...restOfChoice } = choice;
        return {
          ...restOfChoice,
        };
      });
      transformedAnswer = {
        ...restOfAnswer,
        answers: value,
      };
      break;
    case AURA_DISCLOSURE_TYPES.NUMERIC:
      ({ value, ...restOfAnswer } = answer);
      transformedAnswer = {
        ...restOfAnswer,
        value: value.toString(),
      };
      break;
    default:
      transformedAnswer = answer;
      break;
  }

  const payload = {
    answer: {
      ...transformedAnswer,
    },
  };

  return payload;
};
