import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails } from '../sharedComponents';
import { OtherBenefits } from '../../HDPlanBaseFields';

export const BaseMentalHealthTogetherAll = ({ mentalHealthTogetherAll, id }:
{
  mentalHealthTogetherAll: boolean,
  id: string
}) => (!mentalHealthTogetherAll ? <></> : <>
  <SubSectionHeader>
    <Typography
      variant="h3"
      component="h4"
      id={`mental-health-together-all-heading-${id}`}
      message={
        <FormattedMessage id="planDetailsModalContent.togetherAllHeader.bFCKiE" />
      }
    />
  </SubSectionHeader>
  <Spacer size="spaceXS" />
  <SectionDetails>
    <Typography
      variant="body1"
      message={
        <FormattedMessage id="planDetailsModalContent.togetherAllDetails.CnjK9j" />
      }
    />
  </SectionDetails>
</>
);

export const MentalHealthTogetherAll = ({ plan, renderFunctions }:
{
  plan: HD_Plan,
  renderFunctions: OtherBenefits,
}) => {
  return renderFunctions.mentalHealthTogetherAll(
    plan.otherBenefits?.mentalHealthTogetherAll,
    plan.planType,
  );
};
