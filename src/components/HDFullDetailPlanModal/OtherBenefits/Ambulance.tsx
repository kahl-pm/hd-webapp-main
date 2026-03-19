import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails } from '../sharedComponents';
import { OtherBenefits } from '../../HDPlanBaseFields';

export const BaseAmbulance = ({ ambulance, id }:
{
  ambulance: boolean,
  id: string
}) => (!ambulance ? <></> : <>
  <SubSectionHeader>
    <Typography
      variant="h3"
      component="h4"
      id={`ambulance-transportation-heading-${id}`}
      message={
        <FormattedMessage id="planDetailsModalContent.ambulanceTransportationHeading.pgcpJ9" />
      }
    />
  </SubSectionHeader>
  <Spacer size="spaceXS" />
  <SectionDetails>
    <Typography
      variant="body1"
      message={
        <FormattedMessage id="planDetailsModalContent.ambulanceTransportationDetails.ublDij" />
      }
    />
  </SectionDetails>
</>
);

export const Ambulance = ({ plan, renderFunctions }:
{
  plan: HD_Plan,
  renderFunctions: OtherBenefits,
}) => {
  return renderFunctions.ambulance(
    plan.otherBenefits?.ambulance,
    plan.planType,
  );
};
