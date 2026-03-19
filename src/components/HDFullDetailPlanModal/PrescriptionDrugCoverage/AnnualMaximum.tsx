import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import type { PrescriptionDrugCoverage } from '../../HDPlanBaseFields';

export const BaseAnnualMaximum = ({ value, id, formatPrice }:
  {
    value: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (<>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.annualMaximumHeading.Mv8EPn" />
        }
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`annual-max-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.perYear.0ZmJwe"
            values={{
              coverage: formatPrice(
                value,
              ),
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
          <FormattedMessage id="planDetailsModalContent.annualMaximumDetails.PDDrHA" />
        }
      />
    </SectionDetails>
  </>);

export const AnnualMaximum = ({ plan, formatPrice, renderFunctions }:
  {
    plan: HD_Plan,
    formatPrice: (val: number) => string,
    renderFunctions: PrescriptionDrugCoverage
  }) => {
  return plan?.prescriptionDrugCoverage && renderFunctions && renderFunctions?.annualMax(
    plan?.prescriptionDrugCoverage?.annualMax,
    plan.planType,
    { formatPrice },
  );
};
