import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FormattedMessage, useIntl } from 'react-intl';
import Date from '../../Date';
import { getPropsBasedOnDatePeriod } from './helpers';

interface DateQuestionExactDateProps {
  commonProps: {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    box: boolean;
    floatPlaceholder: boolean;
    required: boolean;
    birthdate: string;
  };
  minDate: string;
  maxDate: string;
  selectedDatePeriod: string;
}

const DateQuestionExactDate = (props: DateQuestionExactDateProps) => {
  const {
    commonProps, minDate, maxDate,
    selectedDatePeriod,
  } = props;
  const intl = useIntl();
  const currentDate = moment().format('DD/MM/YYYY');
  // using UTC to display formatted date since it would go a day back when converted to EDT
  // problem e.g. 2017-10-12T00:00:00Z -> expected: 12/10/2017, received: 11/10/2017
  let formattedMinDate = moment(minDate).utc().format('DD/MM/YYYY');
  if (formattedMinDate === '01/01/1900') {
    formattedMinDate = moment(commonProps.birthdate).utc().format('DD/MM/YYYY');
  }
  const formattedMaxDate = moment(maxDate).utc().format('DD/MM/YYYY');
  const pastDateProps = {
    minDate: formattedMinDate,
    minDateMessage: <FormattedMessage id="disclosure.minMessage.T0cynh" values={{ value: formattedMinDate }} />,
    maxDate: currentDate,
    maxDateMessage: <FormattedMessage id="disclosure.maxMessage.jCJUSY" values={{ value: currentDate }} />,
  };
  const futureDateProps = {
    minDate: currentDate,
    minDateMessage: <FormattedMessage id="disclosure.minMessage.T0cynh" values={{ value: currentDate }} />,
    maxDate: formattedMaxDate,
    maxDateMessage: <FormattedMessage id="disclosure.maxMessage.jCJUSY" values={{ value: formattedMaxDate }} />,
  };
  const allDateProps = {
    minDate: pastDateProps.minDate,
    minDateMessage: pastDateProps.minDateMessage,
    maxDate: futureDateProps.maxDate,
    maxDateMessage: futureDateProps.maxDateMessage,
  };

  const additionalData = getPropsBasedOnDatePeriod(
    selectedDatePeriod, pastDateProps, futureDateProps, allDateProps,
  );

  return (
    <Date
      {...commonProps}
      {...additionalData}
      label={intl.formatMessage({ id: 'global.dateMonthYearLabel.dpq9ns' })}
      dateFormat="date"

    />
  );
};

export default DateQuestionExactDate;
