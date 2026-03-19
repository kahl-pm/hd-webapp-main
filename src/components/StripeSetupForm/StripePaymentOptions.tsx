import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Spacer, Typography, UniformSpacingLayout, ResponsiveImage } from '@policyme/global-libjs-designsystem';
import RadioButton from '@policyme/global-libjs-designsystem/RadioButton';
import CARDS from '../../static/images/payments/cards.png';
import GOOGLE_PAY from '../../static/images/payments/google-pay.png';
import APPLE_PAY from '../../static/images/payments/apple-pay.png';
import StripePaymentCardFrame from '../StripeSinglePagePayments/StripePaymentCardFrame';
import { PMPaymentMethod, UserType } from '../../utils/const';
import AGPPaymentFrame from '../AGPSetupForm/AGPPaymentFrame';
import { usePayments } from '../../providers/PaymentProvider';
import { updatePaymentMethod } from '../../NewActions/payment';

interface Props {
  userType: UserType,
  applePay: boolean;
  googlePay: boolean;
}

const StripePaymentOptions = (
  { userType, applePay, googlePay }: Props,
) => {
  const [paymentType, setPaymentType] = useState<PMPaymentMethod | ''>('');
  const dispatch = useDispatch();
  const { setError, setErrorMessage } = usePayments();

  const handlePaymentTypeChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: PMPaymentMethod,
  ) => {
    // if Stripe returns an error, we want to reset the error/error message state back to
    // undefined so it doesn't display the same message for a different payment type
    dispatch(updatePaymentMethod(userType)(value));
    setError(null);
    setErrorMessage(null);
    setPaymentType(value);
  };

  return <UniformSpacingLayout flexDirection="column">
    <Typography variant="h3" message={<FormattedMessage id="stripeSetupForm.choosePaymentMethod.83nEo0" />} id="stripeSetupForm.choosePaymentMethod.83nEo0" px="8px" />
    <RadioGroup name="stripe-payment-type" value={paymentType} onChange={handlePaymentTypeChange}>
      <Spacer size="space3XS" />
      <PaymentOption label={<FormattedMessage id="stripeSetupForm.creditCardPayment.1zd293" />} value="credit_card" imgSrc={CARDS} />
      {paymentType === 'credit_card' && <>
        <StripePaymentCardFrame
          userType={userType}
          showPaymentSummary={false}
        />
        <Spacer size="spaceMedium" />
      </>}
      {googlePay ? <>
        <UniformSpacingLayout fullWidth sx={{ paddingLeft: '8px' }}>
          <Divider />
        </UniformSpacingLayout>
        <Spacer size="space3XS" />
        <PaymentOption label={<FormattedMessage id="stripeSetupForm.googlePay.Dpvu6b" />} value="google_pay" imgSrc={GOOGLE_PAY} />
        <Spacer size="space3XS" />
        {paymentType === 'google_pay' ? <>
          <AGPPaymentFrame
            userType={userType}
            wallet="googlePay"
          />
          <Spacer size="spaceXS" />
        </> : null}
      </> : null}
      {applePay ? <>
        <UniformSpacingLayout fullWidth sx={{ paddingLeft: '8px' }}>
          <Divider />
        </UniformSpacingLayout>
        <Spacer size="space3XS" />
        <PaymentOption label={<FormattedMessage id="stripeSetupForm.applePay.KdIUa4" />} value="apple_pay" imgSrc={APPLE_PAY} />
        <Spacer size="space3XS" />
        {paymentType === 'apple_pay' ? <>
          <AGPPaymentFrame
            userType={userType}
            wallet="applePay"
          />
          <Spacer size="spaceXS" />
        </> : null}
      </> : null}
    </RadioGroup>
  </UniformSpacingLayout>;
};

const PaymentOption = (props: {
  label: React.ReactNode,
  value: string,
  imgSrc: string,
}) => {
  return <UniformSpacingLayout fullWidth justifyContent="space-between" alignItems="center">
    <RadioButton
      label={<Typography variant="body2Bold" message={props.label} />}
      value={props.value}
    />
    <UniformSpacingLayout justifyContent="flex-end" sx={{ minWidth: '0', minHeight: '0' }}>
      {/* min width and min height prevents overflow on the image */}
      <ResponsiveImage src={props.imgSrc} alt="cards" height="24px" width="auto" />
    </UniformSpacingLayout>
  </UniformSpacingLayout>;
};

export default StripePaymentOptions;
