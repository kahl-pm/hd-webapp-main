import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { encodeEnvVar, getPublicKey, sentryError } from '@policyme/global-libjs-utils';
import { getDashboardUser } from '../Selectors/userControl';
import { PUBLIC_KEYS } from '../tenant/consts';
import { getPaymentCardAppearanceRules, withRetryNoPrompt } from '../utils/helpers';
import { handleStripeErrorSetup } from '../NewActions/handle';

interface Props {
  children: React.ReactNode;
}

interface Values {
  clientSecret: any;
  hasError: boolean;
  errorMessage: string;
  setClientSecret: React.Dispatch<any>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<any>;
}

const PaymentsContext = React.createContext<Values>(undefined);

// see links below:
// https://stackoverflow.com/questions/64693509/unsupported-prop-change-on-elements-you-cannot-change-the-stripe-prop-after-s
// https://stackoverflow.com/questions/70864433/integration-of-stripe-paymentelement-warning-unsupported-prop-change-options-c
// https://github.com/stripe/react-stripe-js/issues/246

let stripePromise: Promise<Stripe | null> | null = null;

// Only initialize Stripe on client-side (not during SSR)
if (typeof window !== 'undefined') {
  const stripeKey = getPublicKey(encodeEnvVar(PUBLIC_KEYS.STRIPE));
  
  if (!stripeKey) {
    sentryError('Stripe key not found');
  } else {
    const loadStripeWithRetry = withRetryNoPrompt(async (key: string) => {
      const stripe = await loadStripe(key);
      if (!stripe) {
        throw new Error('loadStripe returned null');
      }
      return stripe;
    });

    stripePromise = loadStripeWithRetry(stripeKey);

  }
}


const PaymentsProvider = (props: Props) => {
  const muiTheme = useTheme();
  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const dispatch = useDispatch();
  // const state_ = useSelector(state => state);

  const [clientSecret, setClientSecret] = useState(undefined);
  const dashboardUser = useSelector(state => getDashboardUser(state));
  const application_language = useSelector(
    state => state[dashboardUser].household.application_language,
  );

  const stripeCustomerID = useSelector((state) => state[dashboardUser]?.payment?.stripeCustomerID);
  const setupIntentClientSecret =
    useSelector((state) => state[dashboardUser]?.payment?.setupIntentClientSecret);
  const appearance = getPaymentCardAppearanceRules(muiTheme);

  useEffect(() => {
    if (stripeCustomerID) {
      // If stripeCustomerID is present, set the client secret from the redux state
      if (setupIntentClientSecret && setupIntentClientSecret !== clientSecret) {
        setClientSecret(setupIntentClientSecret);
      }
    } else {
      // stripeCustomerID is different for each user type, so we need to ensure
      // that we have the stripeCustomerID for the user type which is currently being used
      dispatch(handleStripeErrorSetup(dashboardUser, setClientSecret));
    }
  }, [dashboardUser, stripeCustomerID, setupIntentClientSecret]);

  useEffect(() => {
    // reset any payment errors when the userType or stripe data changes
    setError(false);
    setErrorMessage(null);
  }, [dashboardUser, stripeCustomerID]);

  const paymentsContextValue = useMemo(() => ({
    clientSecret,
    hasError,
    errorMessage,
    setClientSecret,
    setError,
    setErrorMessage,
  }), [clientSecret, hasError, errorMessage, setClientSecret, setError, setErrorMessage]);

  return <PaymentsContext.Provider value={paymentsContextValue}>
    {/* key={clientSecret} is used to force a re-render of the Elements component when the clientSecret changes. See here: https://github.com/stripe/react-stripe-js/issues/246 */}
    {clientSecret ? <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale: application_language === 'fr-CA' ? 'fr-CA' : 'en' }} key={clientSecret}>
      {props.children}
    </Elements> : null}
  </PaymentsContext.Provider>;
};

const usePayments = () => {
  const context = React.useContext(PaymentsContext);

  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentsContext');
  }

  return context;
};

export { PaymentsProvider, usePayments };
