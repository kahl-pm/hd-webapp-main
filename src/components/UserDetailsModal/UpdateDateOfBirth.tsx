import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Spacer, Typography } from '@policyme/global-libjs-designsystem';
import DateOfBirth from '../DateOfBirth';
import { MIN_AGE, MODAL_FIELDS, NEW_PROD_MAX_AGE } from '../../utils/const';
import { useUserDetailsContext } from './UserDetailsContext';

const UpdateDateOfBirth = () => {
  const {
    isUpdatingPartner,
    values,
    setFieldValue,
  } = useUserDetailsContext();
  return (
    <div>
      <Typography
        variant="h4"
        align="left"
        component="h3"
        message={<FormattedMessage
          id="updateDateOfBirth.header.iE4rQx"
          values={{
            isUpdatingPartner,
          }}
        />}
      />
      <Spacer size="spaceXS" />
      <DateOfBirth
        name="birthdate"
        required
        value={values[MODAL_FIELDS.BIRTHDATE]}
        onChange={(val) => setFieldValue(MODAL_FIELDS.BIRTHDATE, val)}
        minAge={MIN_AGE}
        minAgeMessage={
          <FormattedMessage
            id="dateOfBirth.minAgeMessage.4ToZOd"
            values={{
              MIN_AGE,
            }}
          />
        }
        maxAgeNearest={NEW_PROD_MAX_AGE}
        maxAgeNearestMessage={
          <FormattedMessage
            id="dateOfBirth.maxAgeNearestMessage.IxeNxY"
            values={{
              NEW_PROD_MAX_AGE,
            }}
          />
        }
        data-cy="jointDate"
      />
    </div>
  );
};

export default UpdateDateOfBirth;
