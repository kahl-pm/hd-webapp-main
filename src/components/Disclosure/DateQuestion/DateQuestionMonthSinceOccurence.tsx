import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { FormattedMessage, useIntl } from 'react-intl';
import { Input } from '@policyme/global-libjs-designsystem';

interface DateQuestionMonthSinceOccurenceProps {
  commonProps: {
    name: string;
    value: string;
    onChange: (event: string) => void;
    box: boolean;
    floatPlaceholder: boolean;
    required: boolean;
    birthdate: string;
  };
}

const DateQuestionMonthSinceOccurence = (props: DateQuestionMonthSinceOccurenceProps) => {
  const {
    commonProps,
  } = props;
  const intl = useIntl();
  let currentDate = moment();
  let formattedMinDate = moment(commonProps.birthdate, 'DD/MM/YYYY');
  let monthsTillMinDate = currentDate.diff(formattedMinDate, 'months');
  return (
    <Input
      {...commonProps}
      label={intl.formatMessage({ id: 'dateQuestion.numberOfMonths.CA2hff' })}
      number
      max={monthsTillMinDate}
      maxMessage={<FormattedMessage id="disclosure.maxMessage.jCJUSY" values={{ value: monthsTillMinDate }} />}
    />
  );
};

export default DateQuestionMonthSinceOccurence;
