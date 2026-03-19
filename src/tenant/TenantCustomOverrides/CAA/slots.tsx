import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, Typography } from '@policyme/global-libjs-designsystem';
import { useSelector } from 'react-redux';
import { getTenantBasedFormattedText } from '../../helpers';
import { TENANT_TEXT_KEYS } from '../../consts';
import { getComplaintsPath } from '../../../utils/helpers';
import { State } from '../../../store/types/State';

const useSupportEmail = () => {
  const intl = useIntl();
  return getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
};

export const SupportEmailSlot = () => {
  const supportEmail = useSupportEmail();
  return <Link href={`mailto:${supportEmail}`} label={supportEmail} />;
};

export const ComplaintsLinkSlot = () => {
  const supportEmail = useSupportEmail();
  const lang = useSelector((state: State) => state.primary.household.application_language);
  const complaintsLink = getComplaintsPath(lang);
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
