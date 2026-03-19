import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import debug from './debug';
import quotes from './quotes';
import metadata from './metadata';
import userControl from './userControl';

import primary from './primary';
import secondary from './secondary';
import dependents from './dependents';

// partner state for joint applications
import jointMetadata from './jointMetadata';
import partnerDisclosure from './partnerDisclosure';

export default (history) => combineReducers({
  primary,
  secondary,
  dependents,

  partnerDisclosure,

  metadata,
  jointMetadata,
  debug,
  userControl,
  router: connectRouter(history),
});
