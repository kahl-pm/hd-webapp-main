import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'followup';
const data = getStore(`primary/${storeName}`);
const initialState = data ? data : {
  timeSlots: [],
  advice: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
  teleinterview: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
  paramed: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary ? dataSecondary : {
  timeSlots: [],
  advice: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
  teleinterview: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
  paramed: {
    eventId: '', // the eventId from the Google event, re-use to change time during this session
    callDate: '',
    callTime: '',
    hasConflict: false,
  },
};

function reInitState(user, value) {
  return {
    type: `@@${user}/followup/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
