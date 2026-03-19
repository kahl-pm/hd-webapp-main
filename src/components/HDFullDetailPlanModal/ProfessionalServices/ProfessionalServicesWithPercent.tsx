import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails } from '../sharedComponents';
import { ProfessionalServicesWithPercent as ProfessionalServicesWithPercentType } from '../../HDPlanBaseFields';

export const BaseProfessionalServicesWithPercent = ({ annualMax, id, formatPrice }:
  { annualMax: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (!(annualMax) ? <></> : (
    <Typography
      variant="h3"
      align="right"
      component="p"
      id={`professional-services-with-percent-${id}`}
      message={
        <FormattedMessage
          id="planDetailsModalContent.perYear.0ZmJwe"
          values={{
            coverage: formatPrice(annualMax),
          }}
        />
      }
    />
));

export const ProfessionalServicesWithPercent = ({ plan, formatPrice, renderFunctions }:
  {
    plan: HD_Plan,
    formatPrice: (priceString: number) => string,
    renderFunctions: ProfessionalServicesWithPercentType
  }) => (
  plan?.professionalServicesWithPercent && renderFunctions &&
  renderFunctions.annualMax(
    plan?.professionalServicesWithPercent?.annualMax,
    plan.planType,
    { formatPrice },
  )
);

export const BaseProfessionalServicesCoinsurance = ({
  percent,
  annualMax,
  id,
  formatPrice,
}:
  {
    percent: number,
    annualMax: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (
    <>
      <Row
        sx={{
          justifyContent: 'flex-end',
          margin: '0 .5rem .25rem 0',
        }}
      >
        <Typography
          variant="body3Bold"
          id={`professional-services-percent-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.coinsurancePercent.ax3xUU"
              values={{
                percent,
              }}
            />
          }
        />
      </Row>
      {percent && (
      <SectionDetails>
        <Typography
          variant="body1"
          id={`professional-services-coinsurance-value-${id}`}
          message={
            <FormattedMessage
              id="planDetailsModalContent.professionalServicesCoinsurance.A9lxdn"
              values={{
                annualMax: formatPrice(annualMax),
                percent,
                b: (chunks) => <strong>{chunks}</strong>,
              }}
            />
            }
        />
      </SectionDetails>
      )}
    </>
);

export const ProfessionalServicesCoinsurance = ({ plan, formatPrice, renderFunctions }:
  {
    plan: HD_Plan,
    formatPrice: (priceString: number) => string,
    renderFunctions: ProfessionalServicesWithPercentType
  }) => (
  plan?.professionalServicesWithPercent && renderFunctions &&
  renderFunctions.percent(
    plan?.professionalServicesWithPercent?.percent,
    plan.planType,
    {
      formatPrice,
      annualMax: plan?.professionalServicesWithPercent?.annualMax,
    },
  )
);
