import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { ProfessionalServicesWithLimit } from '../../HDPlanBaseFields';

export const BaseProfessionalServicesWithLimit = ({ perVisit, id, formatPrice }:
  {
    perVisit: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (!perVisit ? <></> : (
    <>
      <Typography
        variant="h3"
        align="right"
        component="p"
        id={`professional-services-per-visit-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.perVisit.0L0yCd"
            values={{
              coverage: formatPrice(
                perVisit,
              ),
            }}
          />
        }
      />
    </>
)
);

export const ProfessionalServicesWithLimits = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ProfessionalServicesWithLimit,
    formatPrice: (priceString: number) => string
  }) => plan?.professionalServicesWithLimit && renderFunctions && renderFunctions?.perVisit(
  plan?.professionalServicesWithLimit && plan?.professionalServicesWithLimit.perVisit,
  plan?.planType,
  { formatPrice },
);

export const BaseProfessionalServicesWithLimitMax = ({ annualMax, id, formatPrice }:
  {
    annualMax: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (!(annualMax) ? <></> : (
    <Row
      sx={{
        justifyContent: 'flex-end',
        margin: '0 .5rem .25rem 0',
      }}
    >
      <Typography
        variant="body3Bold"
        message={
          <FormattedMessage
            id="planDetailsModalContent.maxPerYear.Rkqic7"
            values={{
              maxCoverage: formatPrice(
                annualMax,
              ),
            }}
          />
        }
      />
    </Row>)
);

export const ProfessionalServicesWithLimitMax = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ProfessionalServicesWithLimit,
    formatPrice: (priceString: number) => string
  }) => plan?.professionalServicesWithLimit && renderFunctions && renderFunctions?.annualMax(
  plan?.professionalServicesWithLimit && plan?.professionalServicesWithLimit.annualMax,
  plan?.planType,
  { formatPrice },
);
