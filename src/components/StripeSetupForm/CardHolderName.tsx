import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Stack } from '@mui/material';
import { Input } from '@policyme/global-libjs-designsystem';
import { USER_TYPES } from '../../utils/const';
import { makeUpdatePaymentDetails } from '../../NewActions/payment';

interface CardHolderNameProps {
  userType: typeof USER_TYPES[keyof typeof USER_TYPES];
}

const CardHolderName = ({
  userType,
}: CardHolderNameProps) => {
  const dispatch = useDispatch();
  const [cardFirstName, setCardFirstName] = useState('');
  const [cardLastName, setCardLastName] = useState('');
  const intl = useIntl();

  return (
    <Stack
      sx={{
        marginBottom: '1rem',
      }}
    >
      <Box
        sx={{
          marginBottom: '1rem',
        }}
      >
        <Input
          name="cardholderFirstName"
          label={intl.formatMessage({ id: 'paymentForm.cardholderFirstName.pYc10i' })}
          value={cardFirstName}
          required
          requiredMessage={<FormattedMessage id="paymentForm.enterCardholderFirstName.F8YNSr" />}
          onChange={(val) => {
            dispatch(makeUpdatePaymentDetails(userType)('cardFirstName', val));
            setCardFirstName(val);
          }}
          data-cy="firstName"
        />
      </Box>
      <Input
        name="cardholderLastName"
        label={intl.formatMessage({ id: 'paymentForm.cardholderLastName.rl9Sdz' })}
        value={cardLastName}
        required
        requiredMessage={<FormattedMessage id="paymentForm.enterCardholderLastName.RwDuAS" />}
        onChange={(val) => {
          dispatch(makeUpdatePaymentDetails(userType)('cardLastName', val));
          setCardLastName(val);
        }}
        data-cy="lastName"
      />
    </Stack>
  );
};

export default CardHolderName;
