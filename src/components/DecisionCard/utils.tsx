import React from 'react';
import { PM_PRODUCT_PREFIX } from '@policyme/global-libjs-utils';
import { FormattedMessage } from 'react-intl';

export const getDecisionCardTitle = (
  productPrefix: string,
  isPermanent: boolean = false,
): React.ReactElement => {
  const PRODUCT_TITLES = {
    [PM_PRODUCT_PREFIX.HD]: <FormattedMessage id="hdDecision.healthDental.aYORrD" />,
  };
  return PRODUCT_TITLES[productPrefix];
};
