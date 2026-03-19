import React from 'react';
import { Row, Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { hasValue, HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseAnnualCombinedMaximums = ({ value, id, formatPrice }:
  {
    value: number;
    id: string;
    formatPrice: (priceString: number) => string
  }) => (!value ? <></> : (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.annualCombinedMaxHeader.e2vH3i" />
        }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      <SectionDetails>
        <Typography
          variant="body1"
          id={`dental-annual-combined-max-value-${id}`}
          message={
            <>
              <FormattedMessage
                id="planDetailsModalContent.annualCombinedMaxDetails.FVUOG5"
                values={{
                  year1: formatPrice(value),
                  b: (chunks) => <strong>{chunks}</strong>,
                  br: <br />,
                }}
              />
            </>
        }
        />
      </SectionDetails>
    </>
));

export const AnnualCombinedMaximums = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage,
    formatPrice: (val: number) => string
  }) => plan?.dentalCoverage && renderFunctions && renderFunctions.annualCombinedMax(
  plan?.dentalCoverage.annualCombinedMax,
  plan.planType,
  {
    formatPrice: (val: number) => formatPrice(val),
  },
);
