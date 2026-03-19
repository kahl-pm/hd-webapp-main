import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { encodeEnvVar, getPublicKey, sentryError } from '@policyme/global-libjs-utils';
import { useTheme } from '@emotion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { push } from 'connected-react-router';
import { PageContainer, Typography, Progress, MaxWidthContainer, Spacer } from '@policyme/global-libjs-designsystem';

import StripeSetupForm from '../StripeSetupForm';
import PAYMENT_ERROR from '../../static/images/Payment-error.svg';
import { PUBLIC_KEYS } from '../../tenant/consts';
import { getPaymentCardAppearanceRules, getRouteWithUserType } from '../../utils/helpers';
import SetupFormComponent from '../StripeSetupForm/StripeSetupFormComponent';
import { ROUTES } from '../../utils/const';
import { getCurrentUser } from '../../Selectors/userControl';
import BottomNavigation from '../BottomNavigation';
import { usePayments } from '../../providers/PaymentProvider';

interface Props {
  children: React.ReactNode;
  userType: string;
  clientSecret: string;
  setClientSecret: (clientSecret: string) => void;
}

const StripePaymentPageFrame = ({
  userType,
  clientSecret,
  setClientSecret,
  children,
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();
  const {
    errorMessage,
    hasError,
    setError,
    setErrorMessage,
  } = usePayments();

  const RenderElements = useCallback(() => {
    return (
      <StripeSetupForm
        setClientSecret={setClientSecret}
        setError={setError}
        setErrorMessage={setErrorMessage}
        SetupFormComponent={(props_) => (
          <SetupFormComponent
            ref={buttonRef}
            {...props_}
          />
        )}
        showPaymentSummary
        onCompleted={() => {
          dispatch(push(getRouteWithUserType(ROUTES.PAYMENT_RECEIVED, userType)));
        }}
      />
    );
  }, [clientSecret, userType]);

  return (
    <>
      {!clientSecret ? (<Progress name="loading-client-data" show />) : (
        <>
          <PageContainer hasFixedBanner>
            <MaxWidthContainer width="md">
              <Typography
                variant="h1"
                message={<FormattedMessage id="paymentForm.heading.wobtSq" />}
              />
              <Spacer size="spaceMedium" />
              {children}
              <Spacer size="spaceMedium" />
              <Typography
                variant="h1"
                mb="1.5rem"
                message={<FormattedMessage id="paymentForm.subheading.iYylYf" />}
              />
              {hasError
                && <div className="payment-error">
                  <img alt="error" src={PAYMENT_ERROR} className="error-image" />
                  <p>{errorMessage}</p>
                </div>}
              <RenderElements />
            </MaxWidthContainer>
          </PageContainer>
          <BottomNavigation
            buttonRef={buttonRef}
            position="sticky"
          />
        </>
      )}
    </>
  );
};

export default StripePaymentPageFrame;
