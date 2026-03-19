import { useState, useEffect } from 'react';
import { sentryError } from '@policyme/global-libjs-utils';
import { useSelector } from 'react-redux';
import { PM_PRODUCT_PREFIX, ProductType } from '../../utils/const';
import { usePricing } from '../HOC/WithPricing';
import { State } from '../../store/types/State';

export function useAppleGooglePay(
  stripe: any,
  mainProduct: ProductType,
): { googlePay: boolean | undefined;
  applePay: boolean | undefined;
  paymentMethodsLoading: boolean;
} {
  const isCypressStripeForm = useSelector<State, boolean>(
    state => state.metadata.isCypressStripeForm,
  );

  const [googlePay, setGooglePay] = useState(undefined);
  const [applePay, setApplePay] = useState(undefined);
  const { pricing } = usePricing();

  const getAmount = () => {
    let paymentAmount = 0;

    if (mainProduct === PM_PRODUCT_PREFIX.HD) {
      paymentAmount = Number(
        pricing.overall[PM_PRODUCT_PREFIX.HD].totalFirstPaymentMonthlyAmount,
      );
    } else {
      paymentAmount = Number(pricing.primary[mainProduct].approvedFirstMonthlyPayment);
      // since we are only checking to see if AGP is available and the user is not charged,
      // checking the primary is enough
    }
    return paymentAmount > 0 ? Math.trunc(paymentAmount * 100) : 0.01;
  };

  const createPayload = () => {
    return {
      country: 'CA',
      currency: 'cad',
      total: {
        label: mainProduct,
        amount: getAmount(),
      },
      requestPayerName: false,
      requestPayerEmail: false,
    };
  };

  const getWalletReady = async () => {
    try {
      return stripe.paymentRequest(createPayload());
    } catch (error) {
      sentryError(`Error in stripePaymentRequest: ${error}`);
      throw error;
    }
  };

  const isStripeReady = !!stripe;

  useEffect(() => {
    const fetchAppleGooglePay = async () => {
      try {
        const paymentWalletReady = await getWalletReady();
        if (!paymentWalletReady) {
          setGooglePay(false);
          setApplePay(false);
          return;
        }
        const canMakePayments = await paymentWalletReady.canMakePayment();

        if (canMakePayments) {
          setGooglePay(canMakePayments.googlePay);
          setApplePay(canMakePayments.applePay);
        } else {
          setGooglePay(false);
          setApplePay(false);
        }
        // No return statement here to satisfy lint rule
      } catch (requestError) {
        sentryError(`Error creating payment request: ${requestError}`);
        setGooglePay(false);
        setApplePay(false);
      }
    };

    if (isCypressStripeForm) {
      setGooglePay(false);
      setApplePay(false);
    } else if (isStripeReady) {
        fetchAppleGooglePay();
    }
  }, [isStripeReady]);

  return { googlePay,
    applePay,
    paymentMethodsLoading: googlePay === undefined || applePay === undefined };
}
