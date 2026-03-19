import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Typography, PageContainer, Progress } from '@policyme/global-libjs-designsystem';
import { onComponentLoad, navigateToThankYou } from '../../NewActions/session';

const PaymentInProgress = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onComponentLoad(() => {
      setTimeout(() => {
        dispatch(navigateToThankYou());
      }, 3000);
    }));
  }, []);
  return (
    <PageContainer>
      <Typography
        variant="h1"
        mb="0.5rem"
        message={<FormattedMessage
          id="paymentInProgress.processingPayment.u19At1"
        />}
      />
      <Typography
        variant="h2"
        mb="1rem"
        message={<FormattedMessage
          id="paymentInProgress.takeAMoment.zb8qA5"
        />}
      />
      <center>
        <Progress variant="indeterminate" name="Processing your payment" show />
      </center>
    </PageContainer>
  );
};

export default PaymentInProgress;
