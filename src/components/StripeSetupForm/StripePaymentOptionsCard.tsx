import React from 'react';
import { Card } from '@policyme/global-libjs-designsystem';
import { useSelector } from 'react-redux';
import StripePaymentOptions from './StripePaymentOptions';
import { UserType } from '../../utils/const';

interface StripePaymentElementOptionsCardProps {
  applePay: boolean;
  googlePay: boolean;
  userType: UserType;
}

const StripePaymentElementOptionsCard = (
  {
    googlePay,
    applePay,
    userType,
  }: StripePaymentElementOptionsCardProps,
) => {
  return <Card
    cardVariant="empty"
    dense
    body={
      <StripePaymentOptions
        googlePay={googlePay}
        applePay={applePay}
        userType={userType}
      />
    }
  />;
};

export default StripePaymentElementOptionsCard;
