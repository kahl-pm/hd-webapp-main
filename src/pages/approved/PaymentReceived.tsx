import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { handlePaymentReceived } from '../../NewActions/handle';
import { onComponentLoad } from '../../NewActions/session';
import PaymentReceived from '../../components/StripePayments/PaymentReceived';
import { State } from '../../store/types/State';
import { getCurrentUser } from '../../Selectors/userControl';
import { ParamsProps } from '../types/StartApp.types';

function PaymentReceivedPage(props: ParamsProps) {
  const dispatch = useDispatch();
  const userType = useSelector<State, string>(
    (state) => (props.match && props.match.params.userType) || getCurrentUser(state),
  );
  useEffect(() => {
    dispatch(onComponentLoad(() => {
      // since we can arrive here via multiple routes sync on the thank you page
      // also good practice to ensure everything is up to date
      dispatch(handlePaymentReceived(userType));
    }));
  }, []);

  return <PaymentReceived />;
}

export default PaymentReceivedPage;
