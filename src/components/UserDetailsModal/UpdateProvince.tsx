import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Select, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { useUserDetailsContext } from './UserDetailsContext';
import { MODAL_FIELDS, PROVINCE_TYPES } from '../../utils/const';

const UpdateProvince = () => {
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
        align="left"
        component="h3"
        message={<FormattedMessage
          id="updateProvince.header.AcRgNv"
          values={{
            isUpdatingPartner,
          }}
        />}
      />
      <Spacer size="spaceXS" />
      <Select
        label={<FormattedMessage id="global.province.pPf9cm" />}
        multiple={false}
        name="province_search"
        options={PROVINCE_TYPES}
        value={values[MODAL_FIELDS.PROVINCE]}
        onChange={(val) => setFieldValue(MODAL_FIELDS.PROVINCE, val?.value as string)}
        required
        requiredMessage={<FormattedMessage id="address.provinceRequired.fuXlwk" />}
        dataCy="addressProvince"
        ariaLabel={intl.formatMessage({ id: 'global.province.pPf9cm' })}
      />
    </div>
  );
};

export default UpdateProvince;
