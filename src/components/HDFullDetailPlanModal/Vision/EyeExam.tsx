import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader } from '../sharedComponents';
import { EyeWare } from '../../HDPlanBaseFields';

export const BaseEyeExam = ({ eyeExamCoverage, id, formatPrice }:
  {
    eyeExamCoverage: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.eyeExams.5NOdeF" />
        }
        />
        <Typography
          variant="h3"
          align="right"
          component="p"
          id={`eye-exam-coverage-value-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.everyNumberOfYears.beAUqJ"
              values={{
                coverage: formatPrice(eyeExamCoverage),
                numberOfYears: '2',
              }}
            />
        }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
    </>
);

export const EyeExamCoverage = ({ plan, formatPrice, renderFunctions }:
{
  plan: HD_Plan,
  renderFunctions: EyeWare,
  formatPrice: (priceString: number) => string
}) => {
  return plan.eyeware?.eyeExamCoverage
    && renderFunctions.eyeExamCoverage(
      plan.eyeware?.eyeExamCoverage,
      plan.planType,
      { formatPrice },
    );
};
