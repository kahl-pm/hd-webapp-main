import { Link, Typography } from '@policyme/global-libjs-designsystem';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { INFO_EMAIL } from '../../../utils/const';
import { getBCLComplaintsPath } from '../../../utils/helpers';
import { State } from '../../../store/types/State';

const supportEmail = INFO_EMAIL;

export const ComplaintsLinkSlot = () => {
  const lang = useSelector((state: State) => state.primary.household.application_language);
  const complaintsLink = getBCLComplaintsPath(lang);
  return <Typography
    variant="body1"
    message={
      <FormattedMessage
        id="amfDetails.complaints.YkV0uE"
        values={{
          strong: (chunks) => <Typography variant="body1Bold" component="span" message={chunks} />,
          supportEmail: <Link href={`mailto:${supportEmail}`} label={supportEmail} />,
          a: (chunks: any) => (
            <Link href={complaintsLink} target="_blank" label={chunks} />
          ),
        }}
      />
    }
  />;
};

export const QuotesContinuedCTA = () => {
  return <Typography
    variant="CTALargePrimary"
    message={
      <FormattedMessage id="global.next.Q0fXUP" />
    }
  />
};

// For BCL, hide the MoneyBackGuarantee
export const QuotesMoneyBackGuarantee = () => {
  return null;
};
