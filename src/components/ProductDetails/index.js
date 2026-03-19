import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getCurrentUser } from '../../Selectors/userControl';
import { USER_TYPES } from '../../utils/const';
import { usePricing } from '../HOC/WithPricing';

const ProductDetails = (props) => {
  const { pricing } = usePricing();
  const { hd } = pricing[props.userType];
  return (
    <ProductDetailsTemplate
      productHeading={<FormattedMessage id="policyType.healthAndDental.placeholder" />}
      coverage={hd.coverageAmtCurrency}
      term={hd.term}
    />
  );
};

const ProductDetailsTemplate = (props) => {
  return (
    <div>
      <div className="title">
        {props.productHeading}
      </div>
      <div>
        <FormattedMessage
          id="productDetailsTemplate.coverageAndTerm.dnkkUw"
          values={{ coverage: props.coverage, term: props.term, span: chunks => <span className="heavy-text">{chunks}</span> }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    userType: (props.match && props.match.params.userType) || getCurrentUser(state)
      || USER_TYPES.PRIMARY,
  };
};

export default connect(mapStateToProps)(ProductDetails);
