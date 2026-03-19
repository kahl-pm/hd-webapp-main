import React from 'react';
import { FormattedMessage } from 'react-intl';
import { sentryError, sentryWarning, sentryInfo, segmentTrackEvent, hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';

import { updateMetadata, showConfirmationModal, addVerifiedEmail } from './metadata';

import {
  getEmailVerification,
} from './fetch';

import { hasValue } from '../utils/helpers';
import {
  STANDARD_EMAIL_ERROR_TEXT,
  USER_TYPES,
} from '../utils/const';

function showEmailWarningModal(error_text, email) {
  return async (dispatch) => {
    dispatch(showConfirmationModal(
      <FormattedMessage id="emailVerification.invalidEmail.56q3o6" />,
      <FormattedMessage
        id="emailVerification.chooseAnotherEmail.jVIRaR"
        values={{ email, error_text }}
      />,
    ));
    return Promise.resolve({ success: false });
  };
}

function verifyEmailNoLoading(email) {
  return async (dispatch) => {
    if (!hasValue(email)) {
      return Promise.resolve({
        data: {
          result: 'undeliverable',
        },
        debug: {
          rootCause: 'not allowed to call kickbox with empty email',
        },
      });
    }
    return getEmailVerification(email);
  };
}

export function verifyEmailAndNext(
  email,
  userType,
  nextAction,
  error_text,
  showConfirmation = true,
) {
  return async (dispatch, getState) => {
    const shouldTrackEmailEvent = userType === USER_TYPES.PRIMARY;
    const trackEmailValidation = (validation_outcome, legacyEventName) => {
      if (!shouldTrackEmailEvent) {
        return;
      }
      if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
        segmentTrackEvent('email_validation_attempt', { validation_outcome });
      } else if (legacyEventName) {
        segmentTrackEvent(legacyEventName);
      }
    };

    return dispatch(verifyEmailNoLoading(
      email.replace('+', encodeURIComponent('+')),
    )).then(res => {
      const data = res.data;
      const result = data.result;

      if (result !== 'deliverable') {
        sentryInfo('Email Verification Result', {
          tags: { result, reason: data.reason, success: data.success, domain: data.domain },
        });
      }

      if (result === 'undeliverable') {
        trackEmailValidation('undeliverable_email', 'Email - Undeliverable Email');
        dispatch(updateMetadata('emailIsDeliverable', false));

        if (data.did_you_mean) {
          trackEmailValidation('got_suggestion', 'Email - Got Suggestion');
          dispatch(addVerifiedEmail(data.did_you_mean));
          dispatch(updateMetadata('suggestedEmail', data.did_you_mean));
          return Promise.reject(new Error('suggestedEmail'));
        }
        dispatch(showEmailWarningModal(error_text, email));
        return Promise.reject(new Error('emailWarning'));
      }
      dispatch(updateMetadata('emailIsDeliverable', true));
      if (result === 'unknown') {
        trackEmailValidation('unknown_email', 'Email - Unknown Email');
        sentryWarning('Kickbox - Unknown Email');
      } else if (result === 'deliverable') {
        trackEmailValidation('deliverable_email', 'Email - Deliverable Email');
      } else if (result === 'risky') {
        trackEmailValidation('risky_email', 'Email - Risky Email');
      }

      if (data.did_you_mean) {
        trackEmailValidation('got_suggestion', 'Email - Got Suggestion');
        dispatch(addVerifiedEmail(data.did_you_mean));
        dispatch(updateMetadata('suggestedEmail', data.did_you_mean));
        return Promise.reject(new Error('suggestedEmail'));
      }
      dispatch(addVerifiedEmail(email));
      return Promise.resolve();
    });
  };
}

export function verifyEmail(userType) {
  return async (dispatch, getState) => {
    const { verifiedEmails } = getState().metadata;
    const { email } = getState()[userType].household;

    // Partner-email flow currently does not run deliverability validation.
    if (userType !== USER_TYPES.PRIMARY) {
      if (verifiedEmails.indexOf(email) === -1) {
        dispatch(addVerifiedEmail(email));
      }
      return Promise.resolve();
    }

    try {
      if (verifiedEmails.indexOf(email) === -1) {
        return dispatch(verifyEmailAndNext(
          email,
          userType,
          verifyEmail,
          STANDARD_EMAIL_ERROR_TEXT,
        ));
      }
    } catch (error) {
      if (userType === USER_TYPES.PRIMARY) {
        if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
          segmentTrackEvent('error', { error_type: 'exception', error_details: error.message, error_source: 'email' });
        } else {
          segmentTrackEvent('Email - API Error');
        }
      }
      sentryError(error);
      console.log(error);
    }
    return Promise.resolve();
  };
}
