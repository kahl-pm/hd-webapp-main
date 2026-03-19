import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { APPROVED_MONTHLY_PREM_TOOLTIP } from './const';

export default ({
  mainProductEventPrefix,
  product,
  isJoint,
  hasProductJointDiscount,
  approvedFirstMonthlyPaymentCurrency,
  approvedLastMonthlyPayment,
  approvedLastMonthlyPaymentCurrency,
  preDecisionLastPaymentCurrency,
  rateText,
}) => {
  return (
    <UniformSpacingLayout flexDirection="row" fullWidth alignItems="center" justifyContent="space-between">
      <Typography variant="h3" message={rateText} />
      <div data-testid="approved-rate-price">
        <div data-cy="approved-rate-price">
          <UniformSpacingLayout flexDirection="row" alignItems="baseline">
            {
            isJoint && hasProductJointDiscount ?
              <Typography variant="h3" component="p" message={approvedFirstMonthlyPaymentCurrency} />
              : <span>
                {
                  approvedLastMonthlyPayment ?
                    (<Typography variant="h3" component="p" message={approvedLastMonthlyPaymentCurrency} />)
                    : (<Typography variant="h3" component="p" message={preDecisionLastPaymentCurrency} />)
                }
              </span>
          }
            <Typography variant="body4" message={<FormattedMessage id="global.perMonth.1GGl5v" />} />
            <Tooltip
              segmentPayload={{
                name: `${mainProductEventPrefix} - TOOLTIP Monthly Premium`,
                product_type: product,
              }}
              ariaDescribedBy="monthly-premium-tooltip"
              ariaLabel="monthly premium tooltip"
              variant="icon-only-without-heading"
              tooltipButtonName="Monthly Premium"
            >
              {APPROVED_MONTHLY_PREM_TOOLTIP}
            </Tooltip>
          </UniformSpacingLayout>
        </div>
      </div>
    </UniformSpacingLayout>
  );
};
