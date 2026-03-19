import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Alert, CircleAlertIcon, Spacer, UniformSpacingLayout, Progress, Row } from '@policyme/global-libjs-designsystem';
import { segmentTrackEvent } from '@policyme/global-libjs-utils';

import StripeSetupForm from '../StripeSetupForm';
import { isDigitalConsentJourney } from '../../Selectors/userControl';
import { LEGACY_SEGMENT_EVENTS, PM_PRODUCT_PREFIX, ROUTES, SEGMENT_EVENTS, UserType } from '../../utils/const';
import { getRouteWithUserType } from '../../utils/helpers';
import SetupFormCardComponent from './StripeSetupFormCardComponent';
import { syncPaymentReceived } from '../../NewActions/handle';
import { navigateToThankYou } from '../../NewActions/session';
import { isAppProductAdded } from '../../Selectors/helpers/productApp';
import { sendSegmentTrackEvent } from '../../NewActions/analytics';
import { usePayments } from '../../providers/PaymentProvider';
import { sendSegmentTrackEventLegacy } from '../../NewActions/legacyAnalytics';
import { isPMEnvironment } from '../../tenant/helpers';

interface Props {
  userType: UserType;
  showPaymentSummary: boolean;
}

function sendTrackEvents(state: any, userType: UserType, dispatch) {
  isAppProductAdded(state, userType, PM_PRODUCT_PREFIX.HD) && dispatch(
    isPMEnvironment() ?
    sendSegmentTrackEvent(
      SEGMENT_EVENTS.PAYMENT_RECEIVED, userType, PM_PRODUCT_PREFIX.HD,
    ) : sendSegmentTrackEventLegacy(
      LEGACY_SEGMENT_EVENTS.PAYMENT_RECEIVED, userType, PM_PRODUCT_PREFIX.HD
    ),
  );
}

const StripePaymentCardFrame = ({
  userType,
  showPaymentSummary,
}: Props) => {
  const dispatch = useDispatch();
  const state_ = useSelector(state => state);

  const {
    clientSecret,
    errorMessage,
    hasError,
    setClientSecret,
    setError,
    setErrorMessage,
  } = usePayments();

  const isDigitalConsent = useSelector(state => isDigitalConsentJourney(state));

  const RenderElements = useCallback(() => {
    return (
      // Stripe Elements components are rendered in context provider
      <StripeSetupForm
        setClientSecret={setClientSecret}
        setError={setError}
        setErrorMessage={setErrorMessage}
        SetupFormComponent={SetupFormCardComponent}
        showPaymentSummary={showPaymentSummary}
        onCompleted={() => {
          if (isDigitalConsent) {
            segmentTrackEvent(isPMEnvironment() ? SEGMENT_EVENTS.PAYMENT_COMPLETED : LEGACY_SEGMENT_EVENTS.PAYMENT_COMPLETED, {});
            sendTrackEvents(state_, userType, dispatch);
            dispatch(syncPaymentReceived(userType));
            dispatch(navigateToThankYou());
          } else {
            // for HD flow
            dispatch(push(getRouteWithUserType(ROUTES.PAYMENT_RECEIVED, userType)));
          }
        }}
      />
    );
  }, [clientSecret, userType]);

  return (
    !clientSecret ? <Row sx={{ justifyContent: 'center' }}>
      <Progress variant="indeterminate" name="payment-section-loading" show />
    </Row> : (
      <>
        {hasError && (
          <>
            <Spacer size="spaceSmall" />
            <UniformSpacingLayout dense>
              <Alert
                type="high"
                icon={<CircleAlertIcon variant="transparent" />}
                text={errorMessage}
              />
              <Spacer size="spaceSmall" />
            </UniformSpacingLayout>
          </>
        )}
        <RenderElements />
      </>
    )
  );
};

export default StripePaymentCardFrame;
