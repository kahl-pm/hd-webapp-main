import React from 'react';
import { RadioGroup, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { MODAL_FIELDS, SMOKING_OPTIONS } from '../../utils/const';
import { useUserDetailsContext } from './UserDetailsContext';

const UpdateSmoke = (props) => {
  const intl = useIntl();
  const {
    isUpdatingPartner,
    values,
    setFieldValue,
  } = useUserDetailsContext();
  return (
    <div>
      <Typography
        variant="h4"
        component="h3"
        align="left"
        id="updateSmoke.header.qBrvtr"
        message={<FormattedMessage
          id="updateSmoke.header.qBrvtr"
          values={{
            isUpdatingPartner,
          }}
        />}
      />
      <Spacer size="space2XS" />
      <RadioGroup
        name="smoker"
        options={SMOKING_OPTIONS}
        labelledBy="updateSmoke.header.qBrvtr"
        value={values[MODAL_FIELDS.SMOKE]}
        orientation="horizontal"
        required
        requiredMessage={<FormattedMessage id="global.smoke.required.IV0WS3" />}
        onChange={(val) => setFieldValue(MODAL_FIELDS.SMOKE, JSON.parse(val.target.value))}
        data-cy="jointSmoker"
      />
    </div>
  );
};

export default UpdateSmoke;
