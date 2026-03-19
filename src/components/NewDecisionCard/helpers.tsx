import React from 'react';
import { Badge, CheckIcon, TriangleAlertIcon, CircleAlertIcon, ClockIcon } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

import { AURA_DECISION_TYPES, POLICIES_STATUS, PolicyStatusType, AuraDecisionType, ProductType, PM_PRODUCT_TYPE, PM_PRODUCT_PREFIX } from '../../utils/const';
import { ExclusionItem } from '../../utils/types';

export const getBadges = (
  product: ProductType,
  activeDecision: AuraDecisionType,
  policyStatus?: PolicyStatusType,
  auraUWDecisionErrorFlag?: string,
  exclusions?: Array<ExclusionItem>,
  isAfterSellCI?: boolean,
  hasRatingsOrSmokingDiscrepancy?: boolean,
) => {
  const badges = [];

  const getLabel = () => {
    switch (policyStatus) {
      case POLICIES_STATUS.IN_FORCE_PAID:
        return <FormattedMessage id="decisionCardConst.inForceTitle.5hCA9I" />;
      case POLICIES_STATUS.PAID_NOT_IN_FORCE:
        return <FormattedMessage id="decisionCardConst.confirmingCoverage.M3ga29" />;
      default:
        return <FormattedMessage id="global.approved.YLH4VS" />;
    }
  };

  if (activeDecision === AURA_DECISION_TYPES.APPROVED) {
    badges.push(
      <Badge
        variant="filled"
        icon={CheckIcon}
        type="success"
        label={getLabel()}
        dataCy="approved-badge"
      />,
    );
  }

  if (auraUWDecisionErrorFlag === 'Y' || activeDecision === AURA_DECISION_TYPES.REFER_TO_UNDERWRITER) {
    badges.push(
      <Badge
        variant="filled"
        icon={ClockIcon}
        type="alert"
        label={<FormattedMessage id="decisionCardConst.inReviewTitle.m2XgL4" />}
        dataCy="review-badge"
      />,
    );
  }

  if (activeDecision === AURA_DECISION_TYPES.POSTPONED ||
      activeDecision === AURA_DECISION_TYPES.DECLINED) {
    badges.push(
      <Badge
        variant="filled"
        icon={CircleAlertIcon}
        type="inactive"
        label={<FormattedMessage id="decisionCardConst.notEligibleTitle.sWSPQv" />}
        dataCy="declined-badge"
      />,
    );
  }

  if (exclusions && exclusions.length > 0 && activeDecision === AURA_DECISION_TYPES.APPROVED) {
    badges.push(
      <Badge
        variant="filled"
        icon={TriangleAlertIcon}
        type="alert"
        label={
          <FormattedMessage
            id="decisionCardConst.exclusions.eCk9gZ"
            values={{
              exclusionsCount: exclusions.length,
            }}
          />
        }
        dataCy="exclusions-badge"
      />,
    );
  }

  // if both exclusion and rate change happens then we just show the exclusions badge - CRO-1001
  if (
    hasRatingsOrSmokingDiscrepancy &&
    activeDecision === AURA_DECISION_TYPES.APPROVED && exclusions.length <= 0
  ) {
    badges.push(
      <Badge
        variant="filled"
        icon={TriangleAlertIcon}
        type="alert"
        label={<FormattedMessage
          id="decisionCardConst.rateChange.ciMS1a"
        />}
        dataCy="rate-change-badge"
      />,
    );
  }

  return badges;
};

export const topThreeRisks = (risks) => {
  return risks
    .filter((riskObj) => riskObj && riskObj.customerFriendlyReason)
    .map((riskObj) => riskObj.customerFriendlyReason)
    .slice(0, 3);
};
