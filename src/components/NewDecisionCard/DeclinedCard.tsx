import React from 'react';
import { Divider, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { styled } from '@mui/material';

import { PM_PRODUCT_PREFIX, ProductType } from '../../utils/const';

type DeclinedCardProps = {
  product: ProductType;
}

const DeclinedDesc = styled('div')(({ theme }) => ({
  marginTop: theme.spacer.space2XS,
  [theme.breakpoints.up('tablet')]: {
    marginTop: theme.spacer.spaceSmall,
  },
}));

const DeclinedCard = (props: DeclinedCardProps) => {
  const { product } = props;

  return (
    <div data-cy="declined-desc">
      <Divider />
      <DeclinedDesc>
        <Typography
          variant="body2Bold"
          message={<FormattedMessage id="DeclinedCard.checkEmail.mIVdcj" />}
          mb="1rem"
        />
        <Typography
          variant="body2"
          message={<FormattedMessage id="DeclinedCard.lifeInsuranceNotEligible.qwzHRf" />}
          mb="1rem"
        />
        <Typography
          variant="body2"
          message={<FormattedMessage id="DeclinedCard.lifeInsuranceP2.IdMEN7" />}
        />
      </DeclinedDesc>
    </div>
  );
};

export default DeclinedCard;
