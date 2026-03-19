import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography, PageContainer, Progress, MaxWidthContainer } from '@policyme/global-libjs-designsystem';

function PaymentReceived() {
  return (
    <PageContainer>
      <Typography
        variant="h1"
        mb="1rem"
        message={<FormattedMessage id="paymentReceived.heading.NsB0Tw" />}
      />
      <MaxWidthContainer width="sm">
        <Progress show name="Your payment has been received" variant="indeterminate" />
      </MaxWidthContainer>
    </PageContainer>
  );
}

export default PaymentReceived;
