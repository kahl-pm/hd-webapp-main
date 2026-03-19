import React from 'react';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import type { ProfessionalServicesUnlimited as ProfessionalServicesUnlimitedType } from '../../HDPlanBaseFields';

export const BaseProfessionalServicesUnlimited = ({ annualMax, id, formatPrice }:
  {
    annualMax: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => (!annualMax ? <></> : (
    <Typography
      variant="h3"
      align="right"
      component="p"
      id={`professional-services-unlimited-${id}`}
      message={
        <FormattedMessage
          id="planDetailsModalContent.max.283TYc"
          values={{
            coverage: formatPrice(
              annualMax,
            ),
          }}
        />
      }
    />)
);

export const ProfessionalServicesUnlimited = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ProfessionalServicesUnlimitedType,
    formatPrice: (priceString: number) => string
  }) => plan?.professionalServicesUnlimited && renderFunctions && renderFunctions?.annualMax(
  plan?.professionalServicesUnlimited && plan?.professionalServicesUnlimited.annualMax,
  plan?.planType,
  { formatPrice },
);
