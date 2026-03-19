import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@policyme/global-libjs-designsystem';
import { DISABLE_JOINT_SLOTS } from '../../../utils/const';

export const QuotesInputHeader = () => {
  return (
    <Typography
      variant="h1"
      mb="1.25rem"
      message={
        <FormattedMessage
          id="quotesCompareInputs.tellUsABitAboutYourself.8oshPA"
        />
          }
      data-cy="quotesCompareInputsHeader"
    />
  );
};

export const QuotesCompareInputsAddPartnerBtn = () => {
  return null;
};

export const CoverageRedesignJointComponent = () => {
  return null;
};

export const EstimatedMonthlyRateJointDiscountLabel = () => {
  return null;
};

export default {
  [DISABLE_JOINT_SLOTS.REPLACE_QUOTES_INPUT_HEADER]: QuotesInputHeader,
  [DISABLE_JOINT_SLOTS.REPLACE_QUOTES_COMPARE_INPUT_ADD_PARTNER_BTN]:
    QuotesCompareInputsAddPartnerBtn,
  [DISABLE_JOINT_SLOTS.REPLACE_COVERAGE_REDESIGN_JOINT_COMPONENT]: CoverageRedesignJointComponent,
  [DISABLE_JOINT_SLOTS.REPLACE_ESTIMATED_MONTHLY_RATE_JOINT_DISCOUNT_LABEL]:
    EstimatedMonthlyRateJointDiscountLabel,
};
