import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Input } from '@policyme/global-libjs-designsystem';
import { COUNTRY_CODES } from '../../utils/const';

export default function PostalCode(props) {
  const canPostalCodeRegex = /^[A-Z][0-9][A-Z]\s[0-9][A-Z][0-9]$/;
  const usaZipCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  const allRegExp = /.*/;
  const regex = props.country === COUNTRY_CODES.CA ? canPostalCodeRegex :
    (props.country === COUNTRY_CODES.US ? usaZipCodeRegex :
      allRegExp);

  const { value, country, ...restOfProps } = props;
  const intl = useIntl();

  return (
    <Input
      label={intl.formatMessage({ id: 'global.postalCode.iN1zXv' })}
      value={props.value}
      country={props.country}
      regex={regex}
      validateOnValueChange
      onChange={props.onChange}
      required
      requiredMessage={<FormattedMessage id="postalCode.inputRequired.5IJ38T" />}
      regexMessage={<FormattedMessage id="postalCode.inputFormat.WT50uJ" />}
      name="postal_code_search"
      autoComplete="off"
      {...restOfProps}
    />
  );
}
