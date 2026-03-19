import React from 'react';
import { Card } from '@policyme/global-libjs-designsystem';
import { useSelector } from 'react-redux';

import { AURA_DECISION_TYPES, PM_PRODUCT_PREFIX, POLICIES_STATUS, ProductType, UserType, PolicyStatusType, AuraDecisionType } from '../../utils/const';
import { getDecisionCardTitle } from '../DecisionCard/utils';
import { getBadges } from './helpers';

import { canEditCoverageOrTermLength } from '../../Selectors/helpers/productApp';
import { getProductDecisionData } from '../../Selectors/decisionPage';

import ApprovedCard from './ApprovedCard';
import DeclinedCard from './DeclinedCard';
import InReviewCard from './InReviewCard';

type DecisionCardBodyProps = {
  activeDecision: AuraDecisionType;
  userType: UserType;
  showEditButton: boolean;
  product: ProductType;
}

type DecisionCardProps = {
  product?: ProductType;
  userType: UserType;
  policyStatus: PolicyStatusType;
  activeDecision: AuraDecisionType;
  auraUWDecisionErrorFlag: string;
  isPermanent?: boolean;
}

const DecisionCardBody = ({
  activeDecision,
  userType,
  showEditButton,
  product,
}: DecisionCardBodyProps) => {
  switch (activeDecision) {
    case AURA_DECISION_TYPES.APPROVED:
      return <ApprovedCard
        product={product}
        userType={userType}
        showEditButton={showEditButton}
      />;
    case AURA_DECISION_TYPES.DECLINED:
      return <DeclinedCard product={product} />;
    case AURA_DECISION_TYPES.REFER_TO_UNDERWRITER:
    default:
      return <InReviewCard userType={userType} product={product} />;
  }
};

const DecisionCard = (props: DecisionCardProps) => {
  const { product = PM_PRODUCT_PREFIX.HD,
    userType,
    activeDecision,
    policyStatus,
    auraUWDecisionErrorFlag,
    isPermanent } = props;

  // Accessing the data from the Redux store
  const exclusions = useSelector(state => state[userType][`${product}Decision`].exclusions || []);
  const canEditCovOrTermLength = useSelector(
    (state) => canEditCoverageOrTermLength(state, userType, product),
  );
  const { hasRatingsOrSmokingDiscrepancy } =
  useSelector((state) => getProductDecisionData(state, userType, product));

  const badges = getBadges(
    product,
    activeDecision,
    policyStatus,
    auraUWDecisionErrorFlag,
    exclusions,
    false,
    hasRatingsOrSmokingDiscrepancy,
  );

  const decisionCardUI = <DecisionCardBody
    activeDecision={activeDecision}
    userType={userType}
    showEditButton={canEditCovOrTermLength && policyStatus !== POLICIES_STATUS.IN_FORCE_PAID}
    product={product}
  />;

  return (
    <div data-cy={`Decision Card ${product}`}>
      <Card
        cardVariant="heading-and-inline-badge"
        body={decisionCardUI}
        positioning="inline"
        heading={getDecisionCardTitle(product, isPermanent)}
        headingTypographyTagOverride="h2"
        badges={badges}
        dense={activeDecision === AURA_DECISION_TYPES.APPROVED}
      />
    </div>
  );
};

export default DecisionCard;
