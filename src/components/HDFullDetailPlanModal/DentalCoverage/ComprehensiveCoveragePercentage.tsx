import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseComprehensiveCoveragePercentage = ({ value, id }:
  {
    value: string,
    id: string
  }) => (value ? <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.comprehensiveServicesHeading.wwnN06" />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        id={`comprehensive-services-details-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.comprehensiveServicesDetails.fItSWa"
            values={{
              coveragePercentage: value,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
      />
    </SectionDetails>
  </> : <></>
);

export const ComprehensiveCoveragePercentage = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage
  }) => (plan?.dentalCoverage &&
    renderFunctions && renderFunctions?.comprehensiveCoveragePercentage(
  plan?.dentalCoverage?.comprehensiveCoveragePercentage,
  plan.planType,
));
