import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import PropTypes, { InferProps } from 'prop-types';
import { LOCALE } from '@policyme/global-libjs-utils';
import { FormattedMessage } from 'react-intl';
import { Divider, NativeList, Spacer, Tooltip, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { MONTHLY_PREM_TOOLTIP } from './const';
import { usePricing } from '../HOC/WithPricing';
import { isAfterSellCIJourney, getMainProductEventPrefix } from '../../Selectors/helpers/productApp';

interface RisksComponentProps {
  risksDisplayed: string[];
  hasRisksNotDisplayed: boolean;
  userType: string;
}
const RisksComponent = (props:RisksComponentProps) => {
  const { risksDisplayed, hasRisksNotDisplayed, userType } = props;
  return (
    <>
      {
        risksDisplayed.length > 0 &&
        <>
          <Spacer size={'spaceSmall'} />
          <NativeList gap="0.5rem">
            {risksDisplayed.map((customerFriendlyReason) => (
              <Typography
                variant="body1"
                message={customerFriendlyReason}
                component="li"
              />
            ))}
            {hasRisksNotDisplayed && <>
              <p className="risks-label">and</p>
              <p className="risks-label">
                <FormattedMessage id="RisksComponent.otherFactors.X9Ru6J" />
              </p>
            </>}
          </NativeList>
        </>
      }
    </>
  );
};

type OuterProps = InferProps<typeof propTypes>;
type ReduxProps = ConnectedProps<typeof connector>;
type Props = OuterProps & ReduxProps;

const InReviewCard = (props:Props) => {
  const { risks, userType, fromDropJourney, auraErrorFlag, product } = props;
  const { pricing } = usePricing();

  // get top 3 risks with customerFriendlyReason
  const risksDisplayed = risks.filter((riskObj) => riskObj && riskObj.customerFriendlyReason)
    .map((riskObj) => riskObj.customerFriendlyReason)
    .slice(0, 3);
  // has at least one RUW reason displayed and 1 not displayed (no customerFriendlyReason)
  const hasRisksNotDisplayed = risksDisplayed.length !== risks.length && risksDisplayed.length > 0;

  return (<div>
    {
      auraErrorFlag === 'Y' || props.isAfterSellCI || props.isFrenchUser ?
        fromDropJourney ?
          <Typography
            variant="body1"
            message={<FormattedMessage id="InReviewCard.reviewTitle.NVKM6r" />}
          />
          :
          <Typography
            variant="body1"
            message={<FormattedMessage id="InReviewCard.reviewTitle2.J3MJam" values={{ b: chunks => <strong>{chunks}</strong> }} />}
          />
        :
        risksDisplayed.length ?
          <>
            {
                fromDropJourney ?
                  <Typography
                    variant="body1"
                    message={<FormattedMessage id="InReviewCard.teamTakingALook.jPAJed" />}
                  /> :
                  <Typography
                    variant="body1"
                    message={
                      <FormattedMessage id="InReviewCard.humanReview.HBCg8M" values={{ b: chunks => <strong>{chunks}</strong> }} />
                    }
                  />
              }
            <RisksComponent
              userType={userType}
              risksDisplayed={risksDisplayed}
              hasRisksNotDisplayed={hasRisksNotDisplayed}
            />
            {
              fromDropJourney &&
              <Typography
                variant="body1"
                message={<FormattedMessage id="InReviewCard.followUpMessage.nu4hAP" />}
              />
            }
          </>
          :
          <Typography
            variant="body1"
            message={<FormattedMessage id="InReviewCard.reviewTitle2.J3MJam" values={{ b: chunks => <strong>{chunks}</strong> }} />}
          />
    }
    <Spacer size="spaceMedium" />
    <Divider />
    <Spacer size="spaceMedium" />
    <UniformSpacingLayout flexDirection="row" fullWidth alignItems="center" justifyContent="space-between">
      <Typography
        variant="h4"
        component="p"
        message={<FormattedMessage id="InReviewCard.estimatedRate.30S1KT" />}
      />
      <UniformSpacingLayout flexDirection="row" alignItems="baseline">
        <Typography
          variant="h4"
          component="p"
          message={pricing[userType][product].preDecisionFirstPaymentCurrency}
        />
        <Typography
          variant="body4"
          message={<FormattedMessage id="global.perMonth.1GGl5v" />}
        />
        <Tooltip
          tooltipButtonName="In Review Monthly Premium Tooltip"
          ariaDescribedBy="in-review-monthly-premium-tooltip"
          ariaLabelledBy="in-review-monthly-premium-tooltip"
          variant="icon-only"
          tooltipHeader=""
          segmentPayload={{
            name: `${props.productPrefix} - TOOLTIP Monthly Premium`,
            product_type: product,
          }}
        >
          <Typography
            variant="body1"
            message={MONTHLY_PREM_TOOLTIP}
          />
        </Tooltip>
      </UniformSpacingLayout>
    </UniformSpacingLayout>
  </div>);
};

const propTypes = {
  userType: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  product: PropTypes.string.isRequired,
};

InReviewCard.propTypes = propTypes;
InReviewCard.defaultProps = {
};

const mapStateToProps = (state, props) => {
  const userType = props.userType;
  return {
    risks: state[userType][`${props.product}Decision`].risks,
    fromDropJourney: state.metadata.fromDropJourney,
    auraErrorFlag: state[userType][`${props.product}Decision`].aura_uw_decision_error_flag,
    isAfterSellCI: isAfterSellCIJourney(state, userType),
    productPrefix: getMainProductEventPrefix(state, userType),
    isFrenchUser: state[userType].household.application_language === LOCALE.FR_CA,
  };
};

const connector = connect(mapStateToProps);
export default connector(InReviewCard);
