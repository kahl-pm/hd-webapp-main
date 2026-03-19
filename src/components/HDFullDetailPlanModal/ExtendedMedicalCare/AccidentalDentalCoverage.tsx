import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const BaseAccidentalDentalCoverage = ({ accidentalDentalCoverage, id, formatPrice }:
  {
    accidentalDentalCoverage: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (accidentalDentalCoverage && (
  <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.accidentalDental.5dujqs" />
        }
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`accidental-dental-coverage-value-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.perYear.0ZmJwe"
            values={{
              coverage: formatPrice(
                accidentalDentalCoverage,
              ),
            }}
          />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        message={
          <FormattedMessage id="planDetailsModalContent.accidentalDentalDetails.2JxPed" />
        }
      />
    </SectionDetails>
  </>)
);

export const AccidentalDentalCoverage = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => plan?.extendedMedicalCare && renderFunctions && renderFunctions?.accidentalDentalCoverage(
  plan?.extendedMedicalCare && plan?.extendedMedicalCare.accidentalDentalCoverage,
  plan?.planType,
  {
    formatPrice,
  },
);
