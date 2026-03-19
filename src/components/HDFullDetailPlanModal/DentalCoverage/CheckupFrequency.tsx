import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseCheckupFrequency = ({ checkupFrequencyInMonths, id }:
  {
    checkupFrequencyInMonths: string,
    id: string,
  }) => (checkupFrequencyInMonths ? <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={<FormattedMessage id="planDetailsModalContent.checkupFrequencyHeading.VyRkrd" />}
      />
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`checkup-frequency-value-${id}`}
        message={<FormattedMessage
          id="planDetailsModalContent.months.8qqED8"
          values={{
            months: checkupFrequencyInMonths,
          }}
        />}
      />
    </SubSectionHeader><Spacer size="spaceXS" /><SectionDetails>
      <Typography
        variant="body1"
        id={`checkup-frequency-details-${id}`}
        message={<FormattedMessage
          id="planDetailsModalContent.checkupFrequencyDetails.6K2OQ5"
          values={{
            frequencyInMonths: checkupFrequencyInMonths,
            b: (chunks) => <strong>{chunks}</strong>,
          }}
        />}
      />
    </SectionDetails></> : <></>
);

export const CheckupFrequency = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage
  }) => (plan?.dentalCoverage && renderFunctions && renderFunctions?.checkupFrequencyInMonths(
  plan?.dentalCoverage?.checkupFrequencyInMonths,
  plan.planType,
));
