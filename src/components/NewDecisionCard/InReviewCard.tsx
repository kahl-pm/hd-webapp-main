import React from 'react';
import { useSelector } from 'react-redux';
import { LOCALE } from '@policyme/global-libjs-utils';
import { Typography } from '@policyme/global-libjs-designsystem';
import { styled, useTheme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import PriceHeader from './PriceHeader';

import { usePricing } from '../HOC/WithPricing';

import { MONTHLY_PREM_TOOLTIP } from './TextComponents';
import { ProductType, UserType } from '../../utils/const';
import { topThreeRisks } from './helpers';

type InReviewCardProps = {
  product: ProductType;
  userType: UserType;
};

type ReviewMessageProps = {
  auraErrorFlag: string;
  fromDropJourney: boolean;
  isFrenchUser: boolean;
  risksDisplayed: string[];
  hasRisksNotDisplayed: boolean;
};

const RisksList = styled('ul')(() => {
  return {
    paddingLeft: '1.25rem',
    marginBottom: 0,
  };
});

const ReviewMessage = (props: ReviewMessageProps) => {
  const {
    auraErrorFlag,
    fromDropJourney,
    isFrenchUser,
    risksDisplayed,
    hasRisksNotDisplayed,
  } = props;
  const intl = useIntl();

  const theme = useTheme();

  // Intentionally not displaying the risks for the user if it's "FRENCH" user
  // aura risks reasons is in english and we don't want to show it to the
  // user for the french application
  // https://policyme.slack.com/archives/C060ATXM4QH/p1727448965025569
  if (auraErrorFlag === 'Y' || isFrenchUser) {
    return fromDropJourney
      ? <Typography
        message={<FormattedMessage id="InReviewCard.reviewTitle.NVKM6r" />}
        variant="body2"
        pt={theme.spacer.space2XS}
      />
      : <Typography
        message={<FormattedMessage id="InReviewCard.reviewTitle2.J3MJam" values={{ b: chunks => <strong>{chunks}</strong> }} />}
        variant="body2"
        pt={theme.spacer.space2XS}
      />;
  }

  if (risksDisplayed.length) {
    return (
      <>
        {fromDropJourney
          ? <Typography
            message={<FormattedMessage id="InReviewCard.teamTakingALook.jPAJed" />}
            variant="body2"
            pt={theme.spacer.space2XS}
          />
          : <Typography
            message={<FormattedMessage id="InReviewCard.humanReview.HBCg8M" values={{ b: chunks => <strong>{chunks}</strong> }} />}
            variant="body2"
            pt={theme.spacer.space2XS}
          />}
        {
          risksDisplayed.length > 0 &&
          (<RisksList>
            {risksDisplayed.map((customerFriendlyReason) => (
              <Typography
                message={customerFriendlyReason}
                variant="body2Bold"
                component="li"
              />
            ))}
            {hasRisksNotDisplayed && <Typography
              message={`and ${intl.formatMessage({ id: 'RisksComponent.otherFactors.X9Ru6J' })}`}
              variant="body2Bold"
              component="li"
            />}
          </RisksList>)
        }
        {fromDropJourney && <Typography
          message={<FormattedMessage id="InReviewCard.followUpMessage.nu4hAP" />}
          variant="body2"
          pt="1rem"
        />}
      </>
    );
  }

  return <Typography
    message={<FormattedMessage id="InReviewCard.reviewTitle2.J3MJam" values={{ b: chunks => <strong>{chunks}</strong> }} />}
    variant="body2"
    pt={theme.spacer.space2XS}
  />;
};

const InReviewCard = (props: InReviewCardProps) => {
  const { userType, product } = props;

  const { pricing } = usePricing();

  const risks = useSelector(state => state[userType][`${props.product}Decision`].risks);
  const fromDropJourney = useSelector((state: any) => state.metadata.fromDropJourney);
  const auraErrorFlag = useSelector(state => state[userType][`${props.product}Decision`].aura_uw_decision_error_flag);
  const isFrenchUser = useSelector(
    state => state[userType].household.application_language === LOCALE.FR_CA,
  );

  // get top 3 risks with customerFriendlyReason
  const risksDisplayed = topThreeRisks(risks);
  // has at least one RUW reason displayed and 1 not displayed (no customerFriendlyReason)
  const hasRisksNotDisplayed = risksDisplayed.length !== risks.length && risksDisplayed.length > 0;

  return (
    <div data-cy="review-desc">
      <PriceHeader
        title={<FormattedMessage id="decisionCard.estimatedRate.sHb6pf" />}
        amount={pricing[userType][product].preDecisionFirstPaymentCurrency}
        frequency={<FormattedMessage id="global.perMonth.1GGl5v" />}
        product={product}
        tootltipModalText={MONTHLY_PREM_TOOLTIP}
        tooltipButtonName="open rate tooltip"
      />
      <ReviewMessage
        auraErrorFlag={auraErrorFlag}
        fromDropJourney={fromDropJourney}
        isFrenchUser={isFrenchUser}
        risksDisplayed={risksDisplayed}
        hasRisksNotDisplayed={hasRisksNotDisplayed}
      />
    </div>
  );
};

export default InReviewCard;
