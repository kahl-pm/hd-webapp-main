import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStripe, useElements } from '@stripe/react-stripe-js';
import { segmentTrackEvent, sentryError } from '@policyme/global-libjs-utils';
import { getWithPricingFields } from '../HOC/WithPricing';
import { makeUpdatePaymentDetails } from '../../NewActions/payment';
import {
  handleDigitalConsentCheckout,
  handlePaymentForm,
  handlePostCreateStripeSubscriptionsAndFinalize,
  handlePostStripeCreateSetupIntent,
  handleMarketingCommunicationsConsent,
  handleSetAdvisorLedCheckout,
} from '../../NewActions/handle';
import { listResolvedAndRejectedPromises, getUserFromURL, getStripeBackendErrorMessage } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, STRIPE_ERROR_MAPPING, STRIPE_SUBSCRIPTION_STATUS, UserType } from '../../utils/const';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { SetupFormComponentProps } from './StripeSetupFormComponent';
import { isDigitalConsentJourney } from '../../Selectors/userControl';
import { authGetUserInfo } from '../../NewActions/auth';
import { updateMetadata } from '../../NewActions/metadata';
import { State } from '../../store/types/State';
import { isMarketingCheckboxEnabled } from '../../tenant/PaasConfigOverrides/helpers';
import { SetupFormCardComponentProps } from '../StripeSinglePagePayments/StripeSetupFormCardComponent';

// ANY CHANGES MADE TO THE SUBMISSION OF
// THE FORM SHOULD ALSO BE DONE IN AGPSetupForm/index.tsx BOTH FILES
// HANDLE PAYMENT SUBMISSIONS FOR DIFFERENT PAYMENT METHODS

export interface SetupFormProps {
  setError: (arg0: boolean) => void;
  setErrorMessage: (arg: any) => void;
  setClientSecret: (arg0: string) => void;
  SetupFormComponent: React.JSXElementConstructor<SetupFormCardComponentProps>;
  onCompleted: () => void;
  // needed to support bottom nav ref button for docusign journey pages
  setIsLoadingRefButton?: (boolean) => void;
  showPaymentSummary: boolean;
}

const StripeSetupForm = (props: SetupFormProps) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { SetupFormComponent, setIsLoadingRefButton, showPaymentSummary } = props;
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const isCypressStripeForm = useSelector<any, boolean>(
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

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (event) => {
    // ANY CHANGES MADE HERE SHOULD ALSO BE DONE IN
    // AGPSetupForm/index.tsx AS BOTH FILES HANDLE PAYMENT SUBMISSIONS
    // FOR DIFFERENT PAYMENT METHODS

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
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

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Making sure to disable form submission until Stripe.js has loaded.
      return null;
    }

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
    if (setupIntent && setupIntent.status === 'succeeded' && setupIntent.payment_method) {
      dispatch(makeUpdatePaymentDetails(userType)('stripePaymentMethodID', setupIntent.payment_method));
      let finalizedSubscriptionPromises;

      try {
        await dispatch(handleSetAdvisorLedCheckout(userType));
      } catch (err) {
        err && sentryError(`Error setting advisor led checkout - ${err}`);
      }
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
  };

  return (
    <SetupFormComponent
      userType={userType as UserType}
      isAfterSellCI={false}
      isLoadingButton={isLoadingButton}
      handleSubmit={handleSubmit}
      stripe={stripe}
      totalAmtDiscountedDisplay={totalAmtDiscountedDisplay}
      totalAmtFinalDisplay={totalAmtFinalDisplay}
      showPaymentSummary={showPaymentSummary}
    />
  );
};

export default StripeSetupForm;
