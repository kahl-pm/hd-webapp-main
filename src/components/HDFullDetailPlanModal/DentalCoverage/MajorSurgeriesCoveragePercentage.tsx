import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseMajorSurgeriesCoveragePercentage = ({ percent, id, year }:
  {
    percent: string,
    id: string,
    year: string,
  }) => (percent ? <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.majorSurgeriesHeading.3Rn0q2" />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        id={`major-surgeries-details-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.majorSurgeriesDetailsPM.108a5a"
            values={{
              year,
              percent,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
      />
    </SectionDetails>
  </> : <></>
);

export const MajorSurgeriesCoveragePercentage = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage
  }) => (plan?.dentalCoverage &&
  renderFunctions &&
  renderFunctions?.majorSurgeriesCoveragePercentage(
    plan?.dentalCoverage?.majorSurgeriesCoveragePercentage,
    plan.planType,
    {
      majorSurgeriesYear: plan?.dentalCoverage?.majorSurgeriesYear,
    },
  ));
