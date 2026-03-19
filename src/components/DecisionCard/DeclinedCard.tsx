import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@policyme/global-libjs-designsystem';

const DeclinedCard = (props:InferProps<typeof propTypes>) => {
  return (<div className="declined-card">
    <Typography
      variant="body1Bold"
      message={<FormattedMessage id="DeclinedCard.checkEmail.mIVdcj" />}
    />
    <Typography
      variant="body1"
      message={<FormattedMessage id="DeclinedCard.lifeInsuranceNotEligible.qwzHRf" />}
    />
    <Typography
      variant="body1"
      message={<FormattedMessage id="DeclinedCard.lifeInsuranceP2.IdMEN7" />}
    />
  </div>);
};

const propTypes = {
  product: PropTypes.string.isRequired,
};

DeclinedCard.propTypes = propTypes;
DeclinedCard.defaultProps = {
};

export default DeclinedCard;
