import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails } from '../sharedComponents';
import { OtherBenefits } from '../../HDPlanBaseFields';

export const BaseTelehealthMaple = ({ telehealthMaple, id }:
{
    telehealthMaple: boolean,
    id: string
}) => (!telehealthMaple ? <></> : <>
  <SubSectionHeader>
    <Typography
      variant="h3"
      component="h4"
      id={`telehealth-maple-heading-${id}`}
      message={
        <FormattedMessage id="planDetailsModalContent.teleHealthByMapleHeading.KZ3Ew7" />
      }
    />
  </SubSectionHeader>
  <Spacer size="spaceXS" />
  <SectionDetails>
    <Typography
      variant="body1"
      message={
        <FormattedMessage id="planDetailsModalContent.teleHealthByMapleDetails.5PX6os" />
      }
    />
  </SectionDetails>
</>
);

export const TelehealthMaple = ({ plan, renderFunctions }:
{
  plan: HD_Plan,
  renderFunctions: OtherBenefits,
}) => {
  return renderFunctions.telehealthMaple(
    plan.otherBenefits?.telehealthMaple,
    plan.planType,
  );
};
