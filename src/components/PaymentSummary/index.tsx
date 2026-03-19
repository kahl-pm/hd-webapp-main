import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { USER_TYPES } from '../../utils/const';
import { getUserPaymentSummary } from '../../Selectors/helpers/paymentSummary';
import NewPaymentSummaryFrame from './NewPaymentSummaryFrame';

const PaymentSummary = ({ userType }) => {
  const priUserPaymentSummary = useSelector(
    state => getUserPaymentSummary(state, USER_TYPES.PRIMARY),
  );
  const secUserPaymentSummary = useSelector(
    state => getUserPaymentSummary(state, USER_TYPES.SECONDARY),
  );

  const usersSummary = {
    primary: priUserPaymentSummary,
    secondary: secUserPaymentSummary,
  };

  const {
    showPartnerDiscountUI,
    caaMemberDiscountApplied,
    jointDiscountApplied,
    septemberTLDiscountApplied,
    familyDiscountApplied,
    firstPaymentDate,
    totalPrice,
    totalLastPayment,
    savings,
    hdOptedIn,
    hdOverallPlanAmountCurrency,
    hdOverallPlanAmount,
  } = usersSummary[userType];

  return (
    <NewPaymentSummaryFrame
      caaMemberDiscountApplied={caaMemberDiscountApplied}
      jointDiscountApplied={jointDiscountApplied}
      septemberTLDiscountApplied={septemberTLDiscountApplied}
      familyDiscountApplied={familyDiscountApplied}
      savings={savings}
      hdOptedIn={hdOptedIn}
      hdPlanAmountCurrency={hdOverallPlanAmountCurrency}
      hdPlanAmount={hdOverallPlanAmount || 0}
      firstPaymentDate={firstPaymentDate}
      totalPrice={totalPrice}
      showPartnerDiscountUI={showPartnerDiscountUI}
      totalLastPayment={totalLastPayment}
    />
  );
};

PaymentSummary.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default PaymentSummary;
