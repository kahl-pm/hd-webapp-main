import FacebookPixel from 'react-facebook-pixel';
import jsCookie from 'js-cookie';

import { FACEBOOK_PIXEL } from '../config';
import { initFbFlag, queueFbEvent, clearFbQueue } from '../NewActions/metadata';
import { formatDate, hasValue } from './helpers';
import store from '../store';
import { postFacebookTrackEvent } from '../NewActions/fetch';

export function facebookInitPixel(advancedMatchingData) {
  if (FACEBOOK_PIXEL && process.env.BROWSER) {
    let advancedMatching = {};
    if (advancedMatchingData) {
      // delayed initialization of facebook pixel because cookies were disabled
      // therefore, we need to use advanced matching to correctly attribute the
      // events
      Object.keys(advancedMatchingData).forEach(key => {
        let val = advancedMatchingData[key];

        if (hasValue(val)) {
          // see: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
          // for formatting criteria of each field
          switch (key) {
            case 'email':
              advancedMatching.em = val.toLowerCase();
              break;
            case 'firstName':
              advancedMatching.fn = val.toLowerCase();
              break;
            case 'userGender':
              advancedMatching.ge = val[0].toLowerCase();
              break;
            case 'birthdate':
              advancedMatching.db = formatDate(val);
              break;
            default:
              break;
          }
        }
      });
    }

    const options = {
      autoConfig: true,
      debug: false,
    };

    FacebookPixel.init(FACEBOOK_PIXEL, advancedMatching, options);

    store.dispatch(initFbFlag());

    // drain the queue
    let state = store.getState();
    state.metadata.fbEventQueue.forEach((event) => {
      facebookTrackCustom(event.eventName, event.data);
    });

    store.dispatch(clearFbQueue());
  }
}

export function facebookPageView() {
  if (FACEBOOK_PIXEL && process.env.BROWSER) {
    // TODO: NP2-2314 conditionally use secondary email
    let householdState = store.getState().primary.household;
    postFacebookTrackEvent(getFacebookTrackEventPayload('PageView', {}, householdState.email, householdState.phone));
  }
}

export function facebookTrackCustom(eventName, data = {}, reducerState = undefined) {
  if (FACEBOOK_PIXEL && process.env.BROWSER) {
    let state = reducerState;
    let email = '';
    let phone = '';
    if (state === undefined) {
      state = store.getState().metadata;
      // TODO: NP2-2314 conditionally use secondary email
      let householdState = store.getState().primary.household;
      if (householdState !== undefined) {
        email = householdState.email;
        phone = householdState.phone;
      }
    }

    if (!state.backPressed) {
      if (state.fbInitFlag) {
        postFacebookTrackEvent(getFacebookTrackEventPayload(
          eventName,
          data,
          email,
          phone,
        ));
      } else {
        // disable for now, until we've figured out if this is an anti-pattern
        // queue and send later when the fb pixel is initialized
        // store.dispatch(queueFbEvent({ eventName, data }));
      }
    }
  }
}

function getFacebookTrackEventPayload(eventName, extraData, email, phone) {
  // let state = state = store.getState()
  let fbc = jsCookie.get('_fbc');
  let fbp = jsCookie.get('_fbp');
  let event_source_url = `${window.location.protocol}${window.location.host}${window.location.pathname}`;

  let payload = {
    event_name: eventName,
    user_agent: navigator.userAgent,
    event_source_url,
    extra_data: extraData,
    email,
    phone,
  };

  if (fbc !== undefined) {
    payload.fbc = fbc;
  }

  if (fbp !== undefined) {
    payload.fbp = fbp;
  }

  return payload;
}

export function initFbPixel() {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.metadata.fbInitFlag) {
      let advancedMatchingData = {
        firstName: state.primary.household.firstName,
        email: state.primary.household.email,
        userGender: state.primary.household.userGender,
        birthdate: state.primary.household.birthdate,
      };

      facebookInitPixel(advancedMatchingData);
    }
  };
}
