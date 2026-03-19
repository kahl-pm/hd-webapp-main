import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';

import { TENANT_TEXT_KEYS } from '../../tenant/consts';
import { getTenantBasedFormattedText } from '../../tenant/helpers';

function PageTitle(props) {
  const intl = useIntl();
  const title = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.PAGE_TITLE);
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default PageTitle;
