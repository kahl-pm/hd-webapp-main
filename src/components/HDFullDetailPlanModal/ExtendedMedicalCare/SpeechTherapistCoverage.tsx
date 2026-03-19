import React from 'react';
import { Row, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const SpeechTherapistCoverage = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => (!plan.extendedMedicalCare?.speechTherapistsCoverage ? <></> : (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.speechTherapists.RQUqOP" />
          }
        />
        <SpeechTherapistCoverageComponent
          plan={plan}
          renderFunctions={renderFunctions}
          formatPrice={formatPrice}
        />
      </SubSectionHeader>
      {plan?.extendedMedicalCare?.speechTherapistsRAndCLimit &&
        <SpeechTherapistsRAndCLimitComponent
          plan={plan}
          renderFunctions={renderFunctions}
        />}
      <Spacer size="spaceXS" />
      <Row
        sx={{
          justifyContent: 'flex-end',
          margin: '0 .5rem .25rem 0',
        }}
      >
        {plan?.extendedMedicalCare?.speechTherapistsCoveragePerVisit &&
          <SpeechTherapistCoveragePerVisitComponent
            plan={plan}
            renderFunctions={renderFunctions}
            formatPrice={formatPrice}
          />}
        {plan?.extendedMedicalCare?.speechTherapistsCoveragePercent &&
          <SpeechTherapistCoveragePercentComponent
            plan={plan}
            renderFunctions={renderFunctions}
          />}
      </Row>
    </>
)
);

export const BaseSpeechTherapistCoverage = ({ speechTherapistsCoverage, id, formatPrice }:
  {
    speechTherapistsCoverage: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => <Typography
    variant="h3"
    align="right"
    component="p"
    id={`speech-therapists-coverage-value-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.perYear.0ZmJwe"
        values={{
          coverage: formatPrice(
            speechTherapistsCoverage,
          ),
        }}
      />
    }
  />;

const SpeechTherapistCoverageComponent = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => plan?.extendedMedicalCare &&
  renderFunctions &&
  renderFunctions.speechTherapistsCoverage(
    plan.extendedMedicalCare?.speechTherapistsCoverage,
    plan.planType,
    { formatPrice },
  );

export const BaseSpeechTherapistsRAndCLimit = () => <Row
  sx={{
    justifyContent: 'flex-end',
    margin: '0 1rem 0 0',
  }}
>
  <Typography
    variant="body3Bold"
    id="speech-therapists-r-and-c-limit"
    message={
      <FormattedMessage
        id="planDetailsModalContent.rAndC.Rkqic7"
      />
    }
  />
</Row>;

const SpeechTherapistsRAndCLimitComponent = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
  }) => renderFunctions &&
  renderFunctions.speechTherapistsRAndCLimit();

export const BaseSpeechTherapistCoveragePercent = ({ speechTherapistsCoveragePercent, id }:
  {
    speechTherapistsCoveragePercent: number,
    id: string,
  }) => <Typography
    variant="body3Bold"
    id={`speech-therapists-coverage-percent-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.coinsurancePercent.ax3xUU"
        values={{
          percent: speechTherapistsCoveragePercent,
        }}
      />
    }
  />;

const SpeechTherapistCoveragePercentComponent = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
  }) => renderFunctions && renderFunctions.speechTherapistsCoveragePercent &&
  renderFunctions.speechTherapistsCoveragePercent(
    plan.extendedMedicalCare?.speechTherapistsCoveragePercent,
    plan.planType,
  );

export const BaseSpeechTherapistCoveragePerVisit = ({
  speechTherapistsCoveragePerVisit,
  id,
  formatPrice,
}:
  {
    speechTherapistsCoveragePerVisit: number,
    id: string,
    formatPrice: (priceString: number) => string
  }) => <Typography
    variant="body3Bold"
    id={`speech-therapists-coverage-per-visit-${id}`}
    message={
      <FormattedMessage
        id="planDetailsModalContent.maxPerVisit.jk0yZ5"
        values={{
          maxCoverage: formatPrice(
            speechTherapistsCoveragePerVisit,
          ),
        }}
      />
    }
  />;

const SpeechTherapistCoveragePerVisitComponent = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string
  }) => renderFunctions && renderFunctions.speechTherapistsCoveragePerVisit &&
  renderFunctions.speechTherapistsCoveragePerVisit(
    plan.extendedMedicalCare?.speechTherapistsCoveragePerVisit,
    plan.planType,
    { formatPrice },
  );
