import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { MentalHealth } from '../../HDPlanBaseFields';

export const MentalHealthServices = ({ plan, renderFunctions, formatPrice }:
  { plan: HD_Plan,
    renderFunctions: MentalHealth,
    formatPrice: (priceString: number) => string
  }) => (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.mentalHealthServices.HiGnNj" />
          }
        />
        {plan.mentalHealth?.annualMax && (
          <MentalHealthAnnualMax
            plan={plan}
            renderFunctions={renderFunctions}
            formatPrice={formatPrice}
          />
        )}
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      {plan.mentalHealth?.perSession && (
        <MentalHealthPerSessionMax
          plan={plan}
          renderFunctions={renderFunctions}
          formatPrice={formatPrice}
        />
      )}
      <SectionDetails>
        <LimitApplies
          plan={plan}
          renderFunctions={renderFunctions}
        />
      </SectionDetails>
    </>
);

export const BaseMentalHealthAnnualMax = ({ annualMax, id, formatPrice }:
  {
    annualMax: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => <Typography
    variant="h3"
    align="right"
    component="p"
    id={`mental-health-coverage-value-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.perYear.0ZmJwe"
        values={{
          coverage: formatPrice(annualMax),
        }}
      />
      }
  />;

const MentalHealthAnnualMax = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: MentalHealth,
    formatPrice: (priceString: number) => string
  }) => {
  return plan.mentalHealth?.annualMax
    && renderFunctions &&
    renderFunctions.annualMax(plan.mentalHealth?.annualMax, plan.planType, { formatPrice });
};

export const BaseMentalHealthPerSessionMax = ({ perSession, id, formatPrice }:
  {
    perSession: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => <Row
    sx={{
      justifyContent: 'flex-end',
      margin: '0 .5rem .25rem 0',
    }}
  >
    <Typography
      variant="body3Bold"
      id={`mental-health-per-session-${id}`}
      message={
        <FormattedMessage
          id="planDetailsModalContent.perSessionMax.XPfqmL"
          values={{
            price: formatPrice(perSession),
          }}
        />
      }
    />
  </Row>;

const MentalHealthPerSessionMax = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: MentalHealth,
    formatPrice: (priceString: number) => string
  }) => {
  return plan.mentalHealth?.perSession && renderFunctions &&
    renderFunctions.perSession(plan.mentalHealth?.perSession, plan.planType, { formatPrice });
};

export const BaseLimitApplies = ({ limitApplies, id }:
  {
    limitApplies: boolean,
    id: string
  }) => <Typography
    variant="body1"
    id={`mental-health-details-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.mentalHealthServicesDetails.3LnV2u"
        values={{
          limitApplies,
        }}
      />
    }
  />;

const LimitApplies = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: MentalHealth,
  }) => renderFunctions &&
  renderFunctions.limitApplies(plan.mentalHealth?.limitApplies, plan.planType);
