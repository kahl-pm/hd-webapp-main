import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const DiagnosticServices = ({ plan, formatPrice, renderFunctions }:
  { plan: HD_Plan,
    formatPrice: (priceString: number) => string,
    renderFunctions: ExtendedMedicalCare
  }) => (!plan?.extendedMedicalCare?.diagnosticServices ? <></> : (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.diagnosticServicesHeader.Vixp10" />
          }
        />
        <DiagnosticServicesComponent
          plan={plan}
          renderFunctions={renderFunctions}
          formatPrice={formatPrice}
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      {plan?.extendedMedicalCare?.diagnosticServicesQuebecOnly && (
      <Row
        sx={{
          justifyContent: 'flex-end',
          margin: '0 .5rem .25rem 0',
        }}
      >
        <Typography
          variant="body3Bold"
          id={`diagnostic-services-quebec-only-${plan.planType}`}
          message={
            <FormattedMessage id="planDetailsModalContent.quebecOnly.Cln6J2" />
          }
        />
      </Row>
      )}
    </>)
);

export const BaseDiagnosticServices = ({ diagnosticServices, id, formatPrice }:
  {
    diagnosticServices: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => <Typography
    variant="h3"
    align="right"
    component="p"
    id={`diagnostic-services-coverage-value-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.perYear.0ZmJwe"
        values={{
          coverage: formatPrice(
            diagnosticServices,
          ),
        }}
      />
    }
  />;

const DiagnosticServicesComponent = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => renderFunctions && renderFunctions.diagnosticServices &&
  renderFunctions.diagnosticServices(
    plan.extendedMedicalCare?.diagnosticServices,
    plan.planType,
    { formatPrice },
  );
