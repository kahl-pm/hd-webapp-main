import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseOrthodonticsCoveragePercentage = ({
  orthodonticsCoveragePercentage,
  id, orthodonticsMaxCoverage,
  formatPrice, orthodonticsInitialYears,
}:
  {
    orthodonticsCoveragePercentage: string,
    id: string,
    orthodonticsMaxCoverage: number,
    orthodonticsInitialYears: number,
    formatPrice: (priceString: number) => string,
  }) => (orthodonticsCoveragePercentage ? <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.orthodonticsHeading.bRoPYU" />
        }
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`orthodontics-coverage-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.percentageSign.gPc4sZ"
            values={{
              number: orthodonticsCoveragePercentage,
            }}
          />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <Row
      sx={{
        justifyContent: 'flex-end',
        margin: '0 .5rem .25rem 0',
      }}
    >
      <Typography
        variant="body3Bold"
        id={`orthodontics-max-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.maxLifetime.taT11w"
            values={{
              maxCoverage: formatPrice(
                orthodonticsMaxCoverage,
              ),
            }}
          />
        }
      />
    </Row>
    <SectionDetails>
      <Typography
        variant="body1"
        id={`orthodontics-details-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.orthodonticsDetails.53R96P"
            values={{
              coveragePercentage: orthodonticsCoveragePercentage,
              maxCoverage: formatPrice(
                orthodonticsMaxCoverage,
              ),
              orthodonticsInitialYears,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
      />
    </SectionDetails>
  </> : <></>
);

export const OrthodonticsCoveragePercentage = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage,
    formatPrice: (priceString: number) => string
  }) => (plan?.dentalCoverage && renderFunctions && renderFunctions?.orthodonticsCoveragePercentage(
  plan?.dentalCoverage?.orthodonticsCoveragePercentage,
  plan.planType,
  {
    orthodonticsMaxCoverage: plan?.dentalCoverage?.orthodonticsMaxCoverage,
    orthodonticsInitialYears: plan?.dentalCoverage?.orthodonticsInitialYears,
    formatPrice,
  },
));
