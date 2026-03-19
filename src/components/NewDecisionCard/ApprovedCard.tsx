import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
import { Typography } from '@policyme/global-libjs-designsystem';

import { isJoint as isJointSelector } from '../../Selectors/userControl';
import { getProductDiscountCodes } from '../../Selectors/helpers/productSession';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { getProductDecisionData } from '../../Selectors/decisionPage';

import { PM_PRODUCT_PREFIX, ProductType, UserType } from '../../utils/const';
import { DISCOUNT_CODES } from '../../utils/discounts';
import { APPROVED_MONTHLY_PREM_TOOLTIP } from './TextComponents';

import { usePricing } from '../HOC/WithPricing';
import { CustomisationSlot } from '../Customisation';

import PriceHeader from './PriceHeader';
import RatesChangedModal from '../RatesChangedModal';
import CardContent from './CardContent';

type ApprovedCardProps = {
  product: ProductType;
  userType: UserType;
  showEditButton: boolean;
}

const ApprovedCardBody = styled('div')(() => ({
  width: '100%',
}));

const ApprovedCard = (props: ApprovedCardProps): React.JSX.Element => {
  const { product, userType, showEditButton } = props;

  const { pricing } = usePricing();

  // Accessing the data from the Redux store
  const firstName = useSelector((state) => state[userType].household.firstName);
  const isJoint = useSelector(isJointSelector);
  const hdDiscountCodes = useSelector(
    (state) => getProductDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD),
  );
  const mainProductEventPrefix = useSelector((state) => getMainProductEventPrefix(state, userType));
  const {
    totalDebits,
    flatExtraDebits,
    smokingDiscrepancyFlag,
    hasRatingsOrSmokingDiscrepancy,
  } = useSelector((state) => getProductDecisionData(state, userType, product));

  const hasProductJointDiscount = hdDiscountCodes.includes(DISCOUNT_CODES.JOINT_DISCOUNT_V2);

  const { preDecisionLastPaymentCurrency, approvedLastMonthlyPayment,
    approvedLastMonthlyPaymentCurrency,
    approvedFirstMonthlyPaymentCurrency } = pricing[userType][product];

  const renderCurrency = () => {
    if (isJoint && hasProductJointDiscount) {
      return approvedFirstMonthlyPaymentCurrency;
    }
    return approvedLastMonthlyPayment ?
      approvedLastMonthlyPaymentCurrency : preDecisionLastPaymentCurrency;
  };

  const hasRateChanged = hasRatingsOrSmokingDiscrepancy;

  const defaultTooltipHeader = hasRateChanged
    ? (<span>
      {firstName
        ? <FormattedMessage
            id="ApprovedCard.headerText.1GYbaG"
            values={{ name: `${firstName}`, lineBreak: <br /> }}
        />
        : <FormattedMessage id="ApprovedCard.headerText.EfBZO0" values={{ lineBreak: <br /> }} />}
    </span>)
    : <span><FormattedMessage id="decisionCard.rateTooltipHeaderText.zSCfK9" values={{ name: `${firstName}` }} /></span>;

  const defaultTooltipModal = hasRateChanged ?
    <RatesChangedModal
      hasRatings={totalDebits || flatExtraDebits > 0}
      smokingDiscrepancyFlag={smokingDiscrepancyFlag}
    /> : <Typography
      variant="body1"
      message={APPROVED_MONTHLY_PREM_TOOLTIP}
    />;

  return (<ApprovedCardBody>
    <PriceHeader
      title={<FormattedMessage id="decisionCard.yourRate.jB7yLn" />}
      amount={renderCurrency()}
      frequency={<FormattedMessage id="global.monthly.q8Sv6g" />}
      segmentEventName={`${mainProductEventPrefix} - TOOLTIP Monthly Premium`}
      product={product}
      tooltipButtonName="open rate tooltip"
      tooltipHeader={
        <CustomisationSlot name="approvedCard.rateChanged.tooltipHeader">
          {defaultTooltipHeader}
        </CustomisationSlot>
      }
      tootltipModalText={
        <CustomisationSlot name="approvedCard.rateChanged.tooltipModal">
          {defaultTooltipModal}
        </CustomisationSlot>
      }
      dense
    />
    <CardContent product={product} userType={userType} showEditButton={showEditButton} />
  </ApprovedCardBody>);
};

export default ApprovedCard;
