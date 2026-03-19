import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FormattedMessage, useIntl } from 'react-intl';
import Date from '../../Date';
import { getPropsBasedOnDatePeriod } from './helpers';

interface DateQuestionMonthYearProps {
  commonProps: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    box: boolean;
    floatPlaceholder: boolean;
    required: boolean;
    birthdate: string;
  };
  minDate: string;
  maxDate: string;
  selectedDatePeriod: string;
}

const DateQuestionMonthYear = (props: DateQuestionMonthYearProps) => {
  const intl = useIntl();
  const {
    commonProps, minDate, maxDate,
    selectedDatePeriod,
  } = props;
  const currentMonthYear = moment().format('MM/YYYY');
  // using UTC to display formatted date since it would go a day back when converted to EDT
  // problem e.g. 2017-10-01T00:00:00Z -> expected: 10/2017, received: 09/2017
  let minMonthYear = moment(minDate).utc().format('MM/YYYY');
  // if minDate is the default 1900 reset it
  if (minMonthYear === '01/1900') {
    minMonthYear = moment(commonProps.birthdate).utc().format('MM/YYYY');
  }
  const maxMonthYear = moment(maxDate).utc().format('MM/YYYY');
  // 'ALL_DATES' & default constraints

  const pastDateProps = {
    minMonthYear,
    minMonthYearMessage: <FormattedMessage id="disclosure.minMessage.T0cynh" values={{ value: minMonthYear }} />,
    maxMonthYear: currentMonthYear,
    maxMonthYearMessage: <FormattedMessage id="disclosure.maxMessage.jCJUSY" values={{ value: currentMonthYear }} />,
  };
  const futureDateProps = {
    minMonthYear: currentMonthYear,
    minMonthYearMessage: <FormattedMessage id="disclosure.minMessage.T0cynh" values={{ value: currentMonthYear }} />,
    maxMonthYear,
    maxMonthYearMessage: <FormattedMessage id="disclosure.maxMessage.jCJUSY" values={{ value: maxMonthYear }} />,
  };
  const allDateProps = {
    minMonthYear: pastDateProps.minMonthYear,
    minMonthYearMessage: pastDateProps.minMonthYearMessage,
    maxMonthYear: futureDateProps.maxMonthYear,
    maxMonthYearMessage: futureDateProps.maxMonthYearMessage,
  };

  const additionalData = getPropsBasedOnDatePeriod(
    selectedDatePeriod, pastDateProps, futureDateProps, allDateProps,
  );

  return (<>
    <Date
      {...commonProps}
      {...additionalData}
      label={intl.formatMessage({ id: 'global.monthYearLabel.MXIGfX' })}
      dateFormat="monthYear"
    />
  </>

  );
};

export default DateQuestionMonthYear;
