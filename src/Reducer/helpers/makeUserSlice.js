import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import household from '../household';
import session from '../session';
import payment from '../payment';
import disclosure from '../disclosure';
import quotes from './makeQuotesSlice';
import hdSession from '../hdSession';
import hdDecision from '../hdDecision';
import hdPolicy from '../hdPolicy';
import hdApp from '../hdApp';

export const makeUserSlice = (user) => (combineReducers({
  household: household(user),
  session: session(user),
  disclosure: disclosure(user),
  payment: payment(user),
  quotes: quotes(user),
  hdSession: hdSession(user),
  hdDecision: hdDecision(user),
  hdApp: hdApp(user),
  hdPolicy: hdPolicy(user),
}));
