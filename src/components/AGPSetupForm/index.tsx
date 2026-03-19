import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStripe, useElements } from '@stripe/react-stripe-js';
import { segmentTrackEvent, sentryError } from '@policyme/global-libjs-utils';
import { StripeExpressCheckoutElementClickEvent } from '@stripe/stripe-js';
import { getWithPricingFields } from '../HOC/WithPricing';
import { makeUpdatePaymentDetails } from '../../NewActions/payment';
import { handleDigitalConsentCheckout, handlePaymentForm, handlePostCreateStripeSubscriptionsAndFinalize, handlePostStripeCreateSetupIntent, handleMarketingCommunicationsConsent } from '../../NewActions/handle';
import { listResolvedAndRejectedPromises, getUserFromURL, getStripeBackendErrorMessage } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, STRIPE_ERROR_MAPPING, STRIPE_SUBSCRIPTION_STATUS, STRIPE_WALLETS, UserType } from '../../utils/const';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { isDigitalConsentJourney } from '../../Selectors/userControl';
import { authGetUserInfo } from '../../NewActions/auth';
import { updateMetadata } from '../../NewActions/metadata';
import { State } from '../../store/types/State';
import { isMarketingCheckboxEnabled } from '../../tenant/PaasConfigOverrides/helpers';
import AGPSetupFormCardComponent from './AGPSetupFormCardComponent';
import { usePayments } from '../../providers/PaymentProvider';

// ANY CHANGES MADE TO THE SUBMISSION OF
// THE FORM SHOULD ALSO BE DONE IN StripeSetupForm/index.tsx AS BOTH FILES
// HANDLE PAYMENT SUBMISSIONS FOR DIFFERENT PAYMENT METHODS

interface AGPSetupFormProps {
  setError: (arg0: boolean) => void;
  setErrorMessage: (arg: any) => void;
  setClientSecret: (arg0: string) => void;
  onCompleted: () => void;
  setIsLoadingRefButton?: (boolean) => void;
  wallet: STRIPE_WALLETS;
}

export const AGPSetupForm = (props: AGPSetupFormProps) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { wallet, setIsLoadingRefButton } = props;
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showError, setShowError] = useState(false);
  const stripePaymentFlowStarted = useRef(false);
  const stripeContinuePaymentButtonClicked = useRef(false);
  const isDifferentPaymentMethodErrorMessage = useRef(false);

  const { hasError } = usePayments();

  const isCypressStripeForm = useSelector<State, boolean>(
    state => state.metadata.isCypressStripeForm,
  );

  const isDigitalConsent = useSelector(state => isDigitalConsentJourney(state));
  const userType = useSelector<State, string>(state => {
    if (isDigitalConsent) {
      return state.userControl.dashboardUser;
    }
    return getUserFromURL(state.router.location.pathname) ?? state.userControl.currentUser;
  });
  const { pricing } = useSelector((state: State) => getWithPricingFields(state));

  let mainProduct = useSelector(state => getMainProduct(state, userType));
  const totalAmtDiscountedDisplay =
    mainProduct === PM_PRODUCT_PREFIX.HD ?
      pricing.overall.hd.totalFirstPaymentCurrency :
      pricing[userType].allProducts.totalFirstPaymentCurrency;
  const totalAmtFinalDisplay =
    pricing[userType].allProducts.totalLastPaymentDisplay;

  const handleClose = async () => {
    // Case 1: Stripe flow not started, continue button has not been clicked
    // Stop loading and reset state
    if (!stripePaymentFlowStarted.current && !stripeContinuePaymentButtonClicked.current) {
      if (setIsLoadingRefButton) setIsLoadingRefButton(false);
      setShowError(false);
      setIsLoadingButton(false);
      setIsAcknowledged(false);
    }
    if (!stripePaymentFlowStarted.current && stripeContinuePaymentButtonClicked.current) {
      if (!hasError) {
        // Case 2: Stripe flow not started, button clicked, but no payment error
        props.setErrorMessage(STRIPE_ERROR_MAPPING.different_payment_method);
        isDifferentPaymentMethodErrorMessage.current = true;
        props.setError(true);
      }

      // Case 3: Stripe flow not started, button clicked, and there is a payment error
      if (setIsLoadingRefButton) setIsLoadingRefButton(false);
      setIsLoadingButton(false);
      setIsAcknowledged(false);
    }
    //  Case 4: Stripe flow has started, so we let it finish and
    // block more interactions by continuing to load
    stripePaymentFlowStarted.current = false;
    stripeContinuePaymentButtonClicked.current = false;
  };

  // eslint-disable-next-line consistent-return
  const handleOpenModal = (event) => {
    if (!isAcknowledged && mainProduct !== PM_PRODUCT_PREFIX.HD) {
      setShowError(true);
      event.reject();
      return null;
    }
    if (setIsLoadingRefButton) setIsLoadingRefButton(true);
    setIsLoadingButton(true);
    event.resolve();
  };

  // eslint-disable-next-line consistent-return
  const handleExpressCheckout = async (event: StripeExpressCheckoutElementClickEvent) => {
    stripeContinuePaymentButtonClicked.current = true;
    setIsLoadingButton(true);

    if (isDigitalConsent) {
      try {
        await dispatch(handleDigitalConsentCheckout(userType));
        if (isMarketingCheckboxEnabled()) {
          await dispatch(handleMarketingCommunicationsConsent(userType));
        }
      } catch (err) {
        err && sentryError(`Error with handleDigitalConsentCheckout on 'Accept and Checkout' button click in Digital Consent journey - ${err}`);
        return null;
      }
    } else {
      // needed to support bottom nav ref button for docusign journey pages
      // single page checkout payment pages don't have this since there is no bottom nav
      setIsLoadingRefButton && setIsLoadingRefButton(true);
    }
    if (!isDifferentPaymentMethodErrorMessage.current) {
      props.setError(false);
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Making sure to disable form submission until Stripe.js has loaded.
      return null;
    }

    const { error: elementsError } = await elements.submit();

    const confirmParams = isCypressStripeForm ? {
      return_url: window.location.href,
      // Hardcoding the postal code for cypress tests
      // See https://policyme.atlassian.net/wiki/spaces/EN/pages/3184230401/Crowdsourcing+solutions+for+ITT+-+Stripe+Form+Bug
      payment_method_data: {
        billing_details: {
          address: {
            postal_code: 'A1A 1A1',
          },
        },
      },
    } : {
      return_url: window.location.href,
    };

    stripePaymentFlowStarted.current = true;

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        // `Elements` instance that was used to create the Payment Element
        elements,
        confirmParams,
        // this ensures we don't always redirect -- mainly to avoid hard refreshes
        redirect: 'if_required',
      });

      if (error) {
        props.setError(true);
        if (error.code?.includes('incomplete') && error.type === 'validation_error') {
          props.setErrorMessage(STRIPE_ERROR_MAPPING.incomplete_fields);
        } else {
          props.setErrorMessage(
            STRIPE_ERROR_MAPPING[error.decline_code] ||
            STRIPE_ERROR_MAPPING[error.code] ||
            STRIPE_ERROR_MAPPING.default_message,
          );
        }
        setIsLoadingButton(false);
        if (!isDigitalConsent) {
          // needed to support bottom nav ref button for docusign journey pages
          // single page checkout payment pages don't have this since there is no bottom nav
          setIsLoadingRefButton && setIsLoadingRefButton(false);
        }
      }
      if (elementsError) {
        props.setError(true);
        if (elementsError.code?.includes('incomplete') && elementsError.type === 'validation_error') {
          props.setErrorMessage(STRIPE_ERROR_MAPPING.incomplete_fields);
        } else {
          props.setErrorMessage(
            STRIPE_ERROR_MAPPING[elementsError.decline_code] ||
            STRIPE_ERROR_MAPPING[elementsError.code] ||
            STRIPE_ERROR_MAPPING.default_message,
          );
        }
        setIsLoadingButton(false);
        if (!isDigitalConsent) {
          // needed to support bottom nav ref button for docusign journey pages
          // single page checkout payment pages don't have this since there is no bottom nav
          setIsLoadingRefButton && setIsLoadingRefButton(false);
        }
      }
      if (setupIntent && setupIntent.status === 'succeeded' && setupIntent.payment_method) {
        props.setError(false);
        dispatch(makeUpdatePaymentDetails(userType)('stripePaymentMethodID', setupIntent.payment_method));
        let finalizedSubscriptionPromises;
        try {
          finalizedSubscriptionPromises =
            await dispatch(handlePostCreateStripeSubscriptionsAndFinalize(userType));
        } catch (err) {
          err && sentryError(`Error finalizing stripe subscription - ${err}`);
          throw new Error('Stripe finalizing subscription failed, please check sentry');
        }
        const { resolved, rejected } =
          await listResolvedAndRejectedPromises(finalizedSubscriptionPromises);
        /**
         * A rejected promise represents a subscription that failed to finalize.
         * A resolved promise represents a subscription that was successfully finalized.
         * When there is a rejected promise:
         *  we refresh the component so we can retry to resolve the failed subscription.
         * handlePostCreateStripeSubscriptionsAndFinalize:
         *  only runs for products that are not paid for yet.
         */

        if (rejected.length > 0) {
          // one or more subscriptions failed to get finalized
          const rejectedProduct = rejected[0];
          if (rejectedProduct?.value?.error) {
            props.setError(true);
            props.setErrorMessage(getStripeBackendErrorMessage(rejectedProduct.value.error));
            stripePaymentFlowStarted.current = false;
            sentryError(`Stripe: some subscriptions were not finalized ${rejected}`);
            try {
              const ret: any = await dispatch(
                handlePostStripeCreateSetupIntent(userType),
              );
              props.setClientSecret(ret?.setup_intent_client_secret);
            } catch (err) {
              sentryError(`Error creating stripe setup intent ${err ? ` - ${err}` : ''}`);
            }
            setIsLoadingButton(false);
            if (!isDigitalConsent) {
              // needed to support bottom nav ref button for docusign journey pages
              // single page checkout payment pages don't have this since there is no bottom nav
              setIsLoadingRefButton && setIsLoadingRefButton(false);
            }
          }
        }
        if (resolved.length === finalizedSubscriptionPromises.length &&
          resolved[0]?.value && rejected.length === 0) {
          const firstResponse = resolved[0].value;
          if (
            firstResponse &&
            firstResponse.subscription_status &&
            (firstResponse.subscription_status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
            firstResponse.subscription_status === STRIPE_SUBSCRIPTION_STATUS.TRIALING)) {
            if (isDigitalConsent) {
              // authGetUserInfo helps get laest user info from DB and update the store
              dispatch(updateMetadata('finishedHydrating', false));
              await dispatch(authGetUserInfo());
            }
            await dispatch(handlePaymentForm(userType));
            props.onCompleted();
          }
        }
      }
    } catch (err) {
      sentryError(`Error with handleExpressCheckout on 'Accept and Checkout' button click in Digital Consent journey - ${err}`);
      stripePaymentFlowStarted.current = false;
    }
  };

  return <AGPSetupFormCardComponent
    userType={userType as UserType}
    isAfterSellCI={false}
    isLoadingButton={isLoadingButton}
    handleSubmit={handleExpressCheckout}
    stripe={stripe}
    totalAmtDiscountedDisplay={totalAmtDiscountedDisplay}
    totalAmtFinalDisplay={totalAmtFinalDisplay}
    wallet={wallet}
    setIsAcknowledged={setIsAcknowledged}
    isAcknowledged={isAcknowledged}
    showError={showError}
    showPaymentSummary={false}
    handleClose={handleClose}
    handleClick={handleOpenModal}
  />;
};
