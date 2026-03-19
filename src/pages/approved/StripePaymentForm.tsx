/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleStripeErrorSetup } from '../../NewActions/handle';
import { getCurrentUser } from '../../Selectors/userControl';
import { onComponentLoad } from '../../NewActions/session';
import PaymentSummary from '../../components/PaymentSummary';

import StripePaymentPageFrame from '../../components/StripePayments/StripePaymentPageFrame';

const StripePaymentForm = (props) => {
  const dispatch = useDispatch();
  const [clientSecret, setClientSecret] = useState(undefined);
  const userType = useSelector(state => (props.match && props.match.params.userType) || getCurrentUser(state));

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  useEffect(() => {
    dispatch(handleStripeErrorSetup(userType, setClientSecret));
  }, []);

  return (
    <>
      <StripePaymentPageFrame
        userType={userType}
        clientSecret={clientSecret}
        setClientSecret={setClientSecret}
      >
        <PaymentSummary userType={userType} />
      </StripePaymentPageFrame>
    </>);
};

export default StripePaymentForm;
