import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { RadioGroup, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { GENDER_OPTIONS, MODAL_FIELDS } from '../../utils/const';
import { TenantCustomisationSlot } from '../Customisation';
import { useUserDetailsContext } from './UserDetailsContext';

const UpdateGender = () => {
  const {
    isUpdatingPartner,
    values,
    setFieldValue,
  } = useUserDetailsContext();
  const intl = useIntl();
  return (
    <div>
      <Typography
        variant="h4"
        component="h3"
        align="left"
        id="updateGender.header.GT5Eyp"
        message={
          <FormattedMessage
            id="updateGender.header.GT5Eyp"
            values={{
              isUpdatingPartner,
            }}
          />
        }
      />

      <Spacer size="space2XS" />
      <RadioGroup
        name="gender"
        orientation="horizontal"
        labelledBy="updateGender.header.GT5Eyp"
        options={GENDER_OPTIONS}
        value={values[MODAL_FIELDS.USER_GENDER]}
        onChange={(_, val) => setFieldValue(MODAL_FIELDS.USER_GENDER, val)}
        required
        requiredMessage={<FormattedMessage id="global.gender.required.Z88KB8" />}
        data-cy="jointGender"
      />
    </div>
  );
};

export default UpdateGender;
