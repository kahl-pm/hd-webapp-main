import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@policyme/global-libjs-designsystem';

export const APPROVED_MONTHLY_PREM_TOOLTIP = (
  <Typography
    variant="body1"
    message={
      <FormattedMessage
        id="decisionCardConst.approvedMonthlyPremTooltip.0DLD2T"
        values={{ br: <br /> }}
      />
    }
  />
);

export const MONTHLY_PREM_TOOLTIP = (
  <Typography
    variant="body1"
    message={
      <FormattedMessage
        id="decisionCardConst.monthlyPremTooltip.SCA9Oh"
        values={{
          br: <br />,
        }}
      />
    }
  />
);
