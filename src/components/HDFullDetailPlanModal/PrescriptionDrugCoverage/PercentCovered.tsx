import React from 'react';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { PrescriptionDrugCoverage } from '../../HDPlanBaseFields';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';

export const BasePercentCovered = ({ value, id, isHDFullyUW }:
  { value: string, id: string, isHDFullyUW: boolean }) => {
  return (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.coinsurance.YZTR63" />
          }
        />
        <Typography
          variant="h3"
          align="right"
          component="p"
          id={`coinsurance-value-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.percentageSign.gPc4sZ"
              values={{
                number: value,
              }}
            />
        }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      <SectionDetails>
        <Typography
          variant="body1"
          id={`coinsurance-details-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.coinsuranceDetails.ymmmuR"
              values={{
                coveragePercentage: value,
                isHDFullyUW,
                b: (chunks) => <strong>{chunks}</strong>,
                i: (chunks) => <em>{chunks}</em>,
              }}
            />
          }
        />
      </SectionDetails>
    </>
  );
};

export const PercentCovered = ({ plan, isHDFullyUW, renderFunctions }:
  {
    plan: HD_Plan,
    isHDFullyUW: boolean,
    renderFunctions: PrescriptionDrugCoverage
  }) => plan?.prescriptionDrugCoverage && renderFunctions && renderFunctions?.percentCovered(
  plan?.prescriptionDrugCoverage?.percentCovered,
  plan.planType,
  { isHDFullyUW },
);
