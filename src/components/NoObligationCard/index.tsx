import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, AwardIcon } from '@policyme/global-libjs-designsystem';

const NoObligationCard = () => {
  return (<Alert
    type="tip"
    icon={<AwardIcon />}
    text={<FormattedMessage id="authorization.noFeesToSubmit.0Hifjp" />}
  />);
};

export default NoObligationCard;
