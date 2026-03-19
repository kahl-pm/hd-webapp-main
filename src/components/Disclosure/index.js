import BLOOD_PRESSURE from './BloodPressure';
import TEXT from './TextQuestion';
// import PERCENT from './Percent';
// import AMOUNT from './AmountQuestion';
import SINGLE_CHOICE from './SingleChoice';
import MULTIPLE_CHOICE from './MultipleChoice';
import NUMERIC_CHOICE from './NumericChoice';
import SEARCH from './SearchQuestion';
import NUMERIC from './Numeric';
import UNITIZED from './Unitized';
import DATE from './DateQuestion';

export default {
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  NUMERIC_CHOICE,
  DATE,
  UNITIZED,
  BLOOD_PRESSURE,
  NUMERIC,
  TEXT,
  // PERCENT, // We do not support PERCENT, a sentry error will be raised if this is encountered
  // AMOUNT, // We do not support AMOUNT, a sentry error will be raised if this is encountered
  SEARCH,
};
