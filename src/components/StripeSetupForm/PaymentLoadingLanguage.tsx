import React from 'react';
import { Typography, Progress } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

interface PaymentLoadingLanguageProps {
  isDigitalConsent: boolean;
  isHD: boolean;
}

const PaymentLoadingLanguage = ({
  isDigitalConsent,
  isHD,
}: PaymentLoadingLanguageProps) => {
  return (
    <>
      {!isDigitalConsent && !isHD && <hr className="line" />}
      <Typography
        variant="h3"
        align={'center'}
        message={<FormattedMessage
          id="paymentForm.oneMoment.dqaokd"
        />}
      />
      <Progress variant="fullScreen" show name="payment-processing" onOverlay />
    </>
  );
};

export default PaymentLoadingLanguage;
