import { alwaysFail, sometimesFail, delayRandom } from '../utils';

import * as quoteActions from '../../src/Actions/quotes';
import * as householdActions from '../../src/Actions/household';
import * as fetch from '../../src/Actions/fetch';

// fetch.fetchQuotes = delayRandom(fetch.fetchQuotes, 2000);
// fetch.fetchQuotes = sometimesFail(fetch.fetchQuotes, 0.8);

// householdActions.updateHouseholdPropPrimary = () => {
// };
