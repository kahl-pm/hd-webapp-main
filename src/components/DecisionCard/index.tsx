import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useSelector } from 'react-redux';
import { Badge, Card } from '@policyme/global-libjs-designsystem';
import { AURA_DECISION_TYPES, PM_PRODUCT_PREFIX, ProductType, UserType } from '../../utils/const';
import { DECISION_CARD } from './const';
import ApprovedCard from './ApprovedCard';
import { getDecisionCardTitle } from './utils';
import { canEditCoverageOrTermLength } from '../../Selectors/helpers/productApp';
import { getDecisionCardState } from './helpers';
import DeclinedCard from './DeclinedCard';
import InReviewCard from './InReviewCard';

const DecisionCard = (props:InferProps<typeof propTypes>) => {
  const {
    product, userType, activeDecision,
    policyStatusInForce, auraUWDecisionErrorFlag,
    isPermanent, hideWhatsCoveredAndNotCoveredDetails, hideDetailsSection,
  } = props;
  const canEditCovOrTermLength = useSelector(
    (state) => canEditCoverageOrTermLength(state, userType, product),
  );

  const decision = getDecisionCardState(
    activeDecision,
    policyStatusInForce,
    auraUWDecisionErrorFlag,
  );
  const { icon, title, alt, isDisabled } = DECISION_CARD[decision];

  const decisionCardUI = <DecisionCardBody
    activeDecision={activeDecision}
    userType={userType as UserType}
    showEditButton={canEditCovOrTermLength && !policyStatusInForce}
    product={product as ProductType}
    hideWhatsCoveredAndNotCoveredDetails={hideWhatsCoveredAndNotCoveredDetails}
    hideDetailsSection={hideDetailsSection}
  />;

  return (<div data-cy={`Decision Card ${product}`}>
    <Card
      heading={getDecisionCardTitle(product, isPermanent)}
      cardVariant="heading-and-inline-badge"
      badges={[<Badge
        type={decision === AURA_DECISION_TYPES.APPROVED ? 'success' : 'alert'}
        variant="filled"
        label={title}
        icon={icon}
      />]}
      body={decisionCardUI}
      positioning="inline"
    />
  </div>);
};

interface CardBodyProps extends React.ComponentProps<typeof ApprovedCard> {
  activeDecision: string;
}
export const DecisionCardBody:React.FC<CardBodyProps> = ({ activeDecision, ...props }) => {
  switch (activeDecision) {
    case AURA_DECISION_TYPES.APPROVED:
      return (
        <ApprovedCard {...props} />
      );
    case AURA_DECISION_TYPES.DECLINED:
      return (<DeclinedCard product={props.product} />);
    case AURA_DECISION_TYPES.REFER_TO_UNDERWRITER:
    default:
      return (<InReviewCard userType={props.userType} product={props.product} />);
  }
};

const propTypes = {
  userType: PropTypes.string.isRequired,
  product: PropTypes.string,
  activeDecision: PropTypes.oneOf(Object.values(AURA_DECISION_TYPES)).isRequired,
  policyStatusInForce: PropTypes.bool.isRequired,
  isPermanent: PropTypes.bool.isRequired,
  hideWhatsCoveredAndNotCoveredDetails: PropTypes.bool,
  hideDetailsSection: PropTypes.bool,
  auraUWDecisionErrorFlag: PropTypes.string,
};

DecisionCard.propTypes = propTypes;
DecisionCard.defaultProps = {
  product: PM_PRODUCT_PREFIX.HD,
  hideWhatsCoveredAndNotCoveredDetails: false,
  hideDetailsSection: false,
  auraUWDecisionErrorFlag: null,
};

export default DecisionCard;
