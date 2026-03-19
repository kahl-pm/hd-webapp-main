import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import type { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseMaintenanceServices = ({
  maintenanceCoveragePercentage,
  id,
  hasMaintenanceCoveragePercentageYear2,
}:
  {
    maintenanceCoveragePercentage: string;
    hasMaintenanceCoveragePercentageYear2: boolean;
    id: string;
  }) => (<>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.maintenanceServicesHeading.Lc00yV" />
        }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        id={`maintenance-services-details-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.maintenanceServicesDetails.yBVOim"
            values={{
              coveragePercentage: maintenanceCoveragePercentage,
              hasMaintenanceCoveragePercentageYear2,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        }
      />
    </SectionDetails>
  </>);

export const MaintenanceServices = ({
  plan,
  renderFunctions,
}: {
  plan: HD_Plan;
  renderFunctions: DentalCoverage;
  }) => (plan?.dentalCoverage && renderFunctions && renderFunctions?.maintenanceCoveragePercentage(
  plan?.dentalCoverage?.maintenanceCoveragePercentage,
  plan.planType,
  {
    hasMaintenanceCoveragePercentageYear2:
      plan?.dentalCoverage?.hasMaintenanceCoveragePercentageYear2,
  },
));
