import { Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

export default ({
  showPartnerDiscountUI,
  isJoint,
  hasProductJointDiscount,
  approvedLastMonthlyPayment,
  approvedLastMonthlyPaymentCurrency,
  preDecisionLastPaymentCurrency,
}) => {
  return (
    <>
      {
        showPartnerDiscountUI && (
        <UniformSpacingLayout flexDirection="row" fullWidth alignItems="center" justifyContent="space-between">
          <Typography
            variant="body1"
            component="p"
            message={<FormattedMessage id="ApprovedCard.rateBreakdown.B5UPKi" />}
            data-cy="exclusivePerkDiscountText"
          />
          <div data-cy="exclusivePerkDiscountValue">
            <Typography variant="h3" component="p" message={<FormattedMessage id="global.free.9WJe8V" />} />
          </div>
        </UniformSpacingLayout>
        )
      }
      {
        isJoint && hasProductJointDiscount &&
          <UniformSpacingLayout flexDirection="row" fullWidth alignItems="center" justifyContent="space-between">
            <Typography
              variant="body1"
              message={<FormattedMessage id="ApprovedCard.firstYear.cGoTqk" />}
            />
            <UniformSpacingLayout flexDirection="row" alignItems="baseline">
              {
                approvedLastMonthlyPayment ?
                  (<Typography variant="body1" message={approvedLastMonthlyPaymentCurrency} />)
                  : (<Typography variant="body1" message={preDecisionLastPaymentCurrency} />)
              }
              <Typography variant="body1" message={<FormattedMessage id="global.perMonth.1GGl5v" />} />
            </UniformSpacingLayout>
          </UniformSpacingLayout>
      }
    </>
  );
};
