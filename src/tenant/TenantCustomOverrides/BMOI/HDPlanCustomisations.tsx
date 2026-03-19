import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { getBasePlanRenderFunctions, HDPlanRenderFunctions } from '../../../components/HDPlanBaseFields';
import { SubSectionHeader, SectionDetails } from '../../../components/HDFullDetailPlanModal/sharedComponents';

export const BMOIPlanCustomisations: HDPlanRenderFunctions = {
  otherBenefits: {
    ...getBasePlanRenderFunctions().otherBenefits,
    hospitalRoom: (
      value: {
        daysCovered: number,
        daysCoveredFull: number,
      },
      id: string,
    ) => {
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
                // We're using the same keys daysCoveredFull and daysCovered for showing
                // percentages, instead the config should have different keys.
                <FormattedMessage
                  id="planDetailsModalContent.hospitalAccommodationsPercentView.a938xl"
                  values={{
                    strong: (chunks) => <strong>{chunks}</strong>,
                    percentCovered: value.daysCoveredFull,
                    maxDaysCovered: value.daysCovered,
                  }}
                />
              }
            />
          </SectionDetails>
        </>
      );
    },
  },
};
