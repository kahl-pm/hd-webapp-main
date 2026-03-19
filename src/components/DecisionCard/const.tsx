import React from 'react';
import { FormattedMessage } from 'react-intl';
// import { IconApproved, IconInReview, IconNotEligible } from '../ThemedSvgs/IconDecisionStates';
import { AwardIcon, CheckIcon, TriangleAlertIcon, Typography } from '@policyme/global-libjs-designsystem';
import { AURA_DECISION_TYPES } from '../../utils/const';

type AuraDecisionState = typeof AURA_DECISION_TYPES[keyof typeof AURA_DECISION_TYPES];
export type DecisionCardState = AuraDecisionState | 'IN_FORCE';
export const DECISION_CARD = {
  [AURA_DECISION_TYPES.APPROVED]: {
    icon: CheckIcon,
    title: <FormattedMessage id="global.approved.YLH4VS" />,
    alt: 'Approved Icon',
    isDisabled: false,
  },
  [AURA_DECISION_TYPES.REFER_TO_UNDERWRITER]: {
    icon: TriangleAlertIcon,
    title: <FormattedMessage id="decisionCardConst.inReviewTitle.m2XgL4" />,
    alt: 'In Review Icon',
    isDisabled: false,
  },
  IN_FORCE: {
    icon: CheckIcon,
    title: <FormattedMessage id="decisionCardConst.inForceTitle.5hCA9I" />,
    alt: 'Approved Icon',
    isDisabled: false,
  },
  [AURA_DECISION_TYPES.DECLINED]: {
    icon: null,
    title: <FormattedMessage id="decisionCardConst.notEligibleTitle.sWSPQv" />,
    alt: 'Not Eligible',
    isDisabled: true,
  },
} as const;

export const MONTHLY_PREM_TOOLTIP = <p>
  <FormattedMessage
    id="decisionCardConst.monthlyPremTooltip.SCA9Oh"
    values={{
      br: <br />,
    }}
  />
</p>;

export const APPROVED_MONTHLY_PREM_TOOLTIP = <Typography
  variant="body1"
  message={<FormattedMessage
    id="decisionCardConst.approvedMonthlyPremTooltip.0DLD2T"
    values={{ br: <br /> }}
  />}
/>;

export const MONTHLY_PREM_TOOLTIP_JOINT = <p>
  <FormattedMessage
    id="decisionCardConst.monthlyPremTooltipJoint.e4cC2X"
    values={{
      br: <br />,
    }}
  />
</p>;
