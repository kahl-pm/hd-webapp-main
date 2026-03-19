import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, AwardIcon } from '@policyme/global-libjs-designsystem';

const MoneyBackGuaranteeCard: React.FC = () => {
  return (<Alert
    type="tip"
    icon={<AwardIcon />}
    text={<FormattedMessage
      id="global.moneyBack.ltHgH4"
      values={{
        b: chunks => <strong>{chunks}</strong>,
      }}
    />}
  />);
};

export default MoneyBackGuaranteeCard;
