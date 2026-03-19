import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { PrescriptionDrugCoverage } from '../../HDPlanBaseFields';

export const BaseDispensingFee = ({ dispensingFee, id, formatPrice, dispensingFeeCovered }:
  {
    dispensingFee: number,
    id: string,
    formatPrice: (priceString: number) => string,
    dispensingFeeCovered: boolean // This boolean is coupled from the plan and the config, refactor
  }) => {
  return (<>
    <SubSectionHeader>
      <Typography
        variant="h3"
        component="h4"
        message={
          <FormattedMessage id="planDetailsModalContent.dispensingFeeHeader.3T4aiI" />
        }
      />{dispensingFee &&
        <Typography
          variant="h3"
          align="right"
          component="p"
          id={`dispensing-fee-value-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.perPrescription.dLUEgV"
              values={{
                fee: formatPrice(
                  dispensingFee,
                ),
              }}
            />
          }
        />}
      {dispensingFeeCovered &&
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`dispensing-fee-fully-covered-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.fullyCovered.SwBq1o"
          />
        }
      />}
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        message={
          <FormattedMessage id="planDetailsModalContent.dispensingFeeBody.BD5Yr5" />
        }
      />
    </SectionDetails>
  </>);
};

export const DispensingFee = ({ plan, formatPrice, renderFunctions }:
  {
    plan: HD_Plan,
    formatPrice: (priceString: number) => string,
    renderFunctions: PrescriptionDrugCoverage
  }) => {
  const showDispensingFee = plan?.prescriptionDrugCoverage &&
      (plan?.prescriptionDrugCoverage?.dispensingFee ||
        plan?.prescriptionDrugCoverage?.dispensingFeeCovered);
  if (!showDispensingFee) {
    return <></>;
  }
  return renderFunctions && renderFunctions.dispensingFee && renderFunctions.dispensingFee(
    plan?.prescriptionDrugCoverage && plan?.prescriptionDrugCoverage?.dispensingFee,
    plan.planType,
    {
      formatPrice,
      dispensingFeeCovered: plan?.prescriptionDrugCoverage &&
        plan?.prescriptionDrugCoverage.dispensingFeeCovered,
    },

  );
};
