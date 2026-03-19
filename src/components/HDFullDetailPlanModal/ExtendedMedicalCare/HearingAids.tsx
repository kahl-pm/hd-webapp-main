import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const BaseHearingAids = ({ hearingAidsCoverage, id, formatPrice }:
  {
    hearingAidsCoverage: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (hearingAidsCoverage && (
  <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.hearingAids.UXGy43" />
                      }
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`hearing-aids-coverage-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.everyNumberOfYears.beAUqJ"
            values={{
              coverage: formatPrice(
                hearingAidsCoverage,
              ),
              numberOfYears: '4',
            }}
          />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
  </>)
);

export const HearingAids = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => plan?.extendedMedicalCare && renderFunctions && renderFunctions?.hearingAidsCoverage(
  plan?.extendedMedicalCare && plan?.extendedMedicalCare.hearingAidsCoverage,
  plan?.planType,
  {
    formatPrice,
  },
);
