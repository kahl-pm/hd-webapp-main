import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan, getTenant } from '@policyme/global-libjs-utils';
import { SubSectionHeader } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const BaseOrthoticsCoverage = ({ orthoticsCoverage, id, formatPrice }:
  {
    orthoticsCoverage: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (!orthoticsCoverage ? <></> : (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.orthotics.HeMWEi" />
        }
        />
        <Typography
          variant="h3"
          align="right"
          component="p"
          id={`orthotics-coverage-value-${id}`}
          message={
            getTenant().code === 'PM' ? (
              <FormattedMessage
                id="planDetailsModalContent.everyNumberOfYears.beAUqJ"
                values={{
                  coverage: formatPrice(
                    orthoticsCoverage,
                  ),
                  numberOfYears: '2',
                }}
              />
            ) : (
              <FormattedMessage
                id="planDetailsModalContent.perYear.0ZmJwe"
                values={{
                  coverage: formatPrice(
                    orthoticsCoverage,
                  ),
                }}
              />
            )
          }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
    </>)
);

export const Orthotics = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => plan?.extendedMedicalCare && renderFunctions && renderFunctions?.orthoticsCoverage(
  plan?.extendedMedicalCare && plan?.extendedMedicalCare.orthoticsCoverage,
  plan?.planType,
  {
    formatPrice,
  },
);
