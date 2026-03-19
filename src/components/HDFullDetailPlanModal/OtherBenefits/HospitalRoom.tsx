import React from 'react';
import { Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails } from '../sharedComponents';
import { OtherBenefits } from '../../HDPlanBaseFields';

export const BaseHospitalRoom = ({ value, id }:
  {
    value: {
      daysCoveredFull: number,
      daysCovered: number,
    },
    id: string,
  }) => {
  return (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.hospitalAccommodationsHeading.k2oww7" />
          }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      <SectionDetails>
        <Typography
          variant="body1"
          id={`hospital-accommodations-details-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.hospitalAccommodationsDetails.8xTgv9"
              values={{
                daysCovered: value.daysCoveredFull,
                b: (chunks) => <strong>{chunks}</strong>,
                li: (chunks) => <li>
                  <Typography
                    variant="body1"
                    message={chunks}
                  />
                </li>,
                ul: (chunks) => <StyledUnorderedList>{chunks}</StyledUnorderedList>,
              }}
            />
          }
        />
      </SectionDetails>
    </>
  );
};

export const HospitalRoom = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: OtherBenefits
  }) => {
  if (plan?.otherBenefits?.hospitalRoom && typeof plan?.otherBenefits?.hospitalRoom === 'object') {
    return renderFunctions?.hospitalRoom(
      plan?.otherBenefits?.hospitalRoom,
      plan?.planType,
    );
  }
  return <></>;
};
