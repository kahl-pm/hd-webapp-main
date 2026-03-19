import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails, SectionHeader } from '../sharedComponents';
import { EyeWare } from '../../HDPlanBaseFields';

export const BaseAmountCovered = ({ amountCovered, id, formatPrice }:
{
  amountCovered: number,
  id: string,
  formatPrice: (priceString: number) => string
}) => (
  <>
    <SectionHeader>
      <FormattedMessage id="planDetailsModalContent.visionCareHeading.3jXtyB" />
    </SectionHeader>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.visionHeading.B5sfq6" />
      }
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`vision-coverage-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.everyNumberOfYears.beAUqJ"
            values={{
              coverage: formatPrice(amountCovered),
              numberOfYears: '2',
            }}
          />
      }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        message={
          <FormattedMessage id="planDetailsModalContent.visionDetails.mwjwff" />
      }
      />
    </SectionDetails>
  </>
);

export const AmountCovered = ({ plan, formatPrice, renderFunctions }:
{
  plan: HD_Plan,
  renderFunctions: EyeWare,
  formatPrice: (priceString: number) => string
}) => {
  return plan.eyeware?.amountCovered
    && renderFunctions.amountCovered(plan.eyeware?.amountCovered, plan.planType, { formatPrice });
};
