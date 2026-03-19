import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Input } from '@policyme/global-libjs-designsystem';

import { FormattedMessage, useIntl } from 'react-intl';
import { getPropsBasedOnDatePeriod } from './helpers';
import { calcAge } from '../../../utils/helpers';

interface DateQuestionRelativeAgeProps {
  commonProps: {
    name: string;
    birthdate: string;
    value: string;
    onChange: (value: string) => void;
    box: boolean;
    floatPlaceholder: boolean;
    required: boolean;
  };
  maxDate: string;
  selectedDatePeriod: string;
}

const DateQuestionRelativeAge = (props: DateQuestionRelativeAgeProps) => {
  const {
    commonProps,
    selectedDatePeriod,
  } = props;
  const intl = useIntl();
  // Age should be not be earlier than birthdate
  const currentAge = calcAge(commonProps.birthdate);
  const formattedMaxDate = moment().utc().format('DD/MM/YYYY');
  const maxAge = calcAge(commonProps.birthdate, formattedMaxDate);
  const pastDateProps = {
    min: 0,
    minMessage: <FormattedMessage id="dateQuestion.minAge.ScinL7" values={{ age: 0 }} />,
    max: currentAge,
    maxMessage: <FormattedMessage id="dateQuestion.maxAge.oFeME3" values={{ age: currentAge }} />,
  };
  const futureDateProps = {
    min: currentAge,
    minMessage: <FormattedMessage id="dateQuestion.minAge.ScinL7" values={{ age: currentAge }} />,
    max: maxAge,
    maxMessage: <FormattedMessage id="dateQuestion.maxAge.oFeME3" values={{ age: maxAge }} />,
  };
  const allDateProps = {
    min: pastDateProps.min,
    minMessage: pastDateProps.minMessage,
    max: futureDateProps.max,
    maxMessage: futureDateProps.maxMessage,
  };

  const additionalData = getPropsBasedOnDatePeriod(
    selectedDatePeriod, pastDateProps, futureDateProps, allDateProps,
  );

  return (
    <Input
      {...commonProps}
      {...additionalData}
      placeholder={intl.formatMessage({ id: 'dateQuestion.yourAge.FWlEEI' })}
      number
    />
  );
};

export default DateQuestionRelativeAge;
