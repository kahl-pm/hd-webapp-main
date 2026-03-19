import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { Button, Select, Spacer, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import MONTH_YEAR from './DateQuestionMonthYear';
import RELATIVE_AGE from './DateQuestionRelativeAge';
import MONTHS_SINCE_OCCURRENCE from './DateQuestionMonthSinceOccurence';
import EXACT_DATE from './DateQuestionExactDate';

import { USER_TYPES } from '../../../utils/const';
import { State } from '../../../store/types/State';

const DateInputComponents = {
  MONTH_YEAR,
  RELATIVE_AGE,
  MONTHS_SINCE_OCCURRENCE,
  EXACT_DATE,
};

const DATE_FORMAT_NAMES = {
  MONTH_YEAR: <FormattedMessage id="dateFormatNames.monthyear.TDaM7Z" />,
  RELATIVE_AGE: <FormattedMessage id="dateFormatNames.relativeAge.qnEts1" />,
  MONTHS_SINCE_OCCURRENCE: <FormattedMessage id="dateFormatNames.monthsSinceOccurrence.0Djhw4" />,
  EXACT_DATE: <FormattedMessage id="dateFormatNames.exactDate.C78d7A" />,
};

interface DateComponentProps {
  data: {
    constraints: {
      canBeUnknown: boolean;
      selectedDatePeriod: string;
      availableDateFormats: string[];
      minDate: string;
      maxDate: string;
    };
    id: string;
    text: string;
  };
  value: {
    dateFormat?: string;
    value?: string | number;
  };
  onChange: (newValue: { dateFormat?: string; value?: string | number }) => void;
  onUnknown: () => Promise<void>;
  userType?: string;
}

const DateComponent = (props: DateComponentProps) => {
  const [prom, setProm] = useState(null);
  const {
    data: {
      constraints: {
        canBeUnknown, availableDateFormats, ...moreConstraints
      },
      id,
      text,
    },
    value,
    onChange,
    onUnknown,
    userType,
  } = props;

  const birthdate = useSelector(
    (state: State) => state[userType || USER_TYPES.PRIMARY].household.birthdate,
  );

  const handleSelectChange = (e) => {
    const val = e?.value;
    // empty the field if we changed to a different option
    if (val !== value.dateFormat) {
      onChange({
        dateFormat: val,
        value: '',
      });
    }
  };

  const handleInputChange = (val) => {
    const newValue = { ...value };
    newValue.value = val;
    onChange(newValue);
  };

  // sort in a specific order
  availableDateFormats.sort((a, b) => (
    Object.keys(DATE_FORMAT_NAMES).indexOf(a) -
    Object.keys(DATE_FORMAT_NAMES).indexOf(b)
  ));

  let dropDownOptions = availableDateFormats.map(availableDateFormat => {
    return {
      value: availableDateFormat,
      text: availableDateFormat,
      label: DATE_FORMAT_NAMES[availableDateFormat],
    };
  });

  // remove 2 options if there are 4 options
  if (dropDownOptions.length === 4) {
    dropDownOptions = dropDownOptions.filter(option => (
      option.label !== DATE_FORMAT_NAMES.MONTHS_SINCE_OCCURRENCE &&
      option.label !== DATE_FORMAT_NAMES.EXACT_DATE
    ));
  }

  const InputComponent = DateInputComponents[value.dateFormat] || React.Fragment;

  const inputCommonProps = {
    name: `${id}-input`,
    'data-cy': `dateQuestion-input-${text}-${props.userType}`,
    birthdate,
    value: value.value,
    onChange: handleInputChange,
    required: true,
  };

  // defaulting to the first value
  if (!value.dateFormat) {
    handleSelectChange(dropDownOptions[0]);
  }

  return <>
    <UniformSpacingLayout gap="2rem" flexDirection="column">
      <Select
        ariaLabel={text}
        label={<FormattedMessage id="dateQuestion.chooseTimeFormat.t64Up7" />}
        name={id}
        options={dropDownOptions}
        onChange={handleSelectChange}
        value={value.dateFormat || ''}
        required
        multiple={false}
        requiredMessage={<FormattedMessage id="global.selectOption.chwFb9" />}
        dataCy={`available-date-${text}-${props.userType}`}
      />
      <InputComponent
        {...moreConstraints}
        commonProps={inputCommonProps}
      />
      {canBeUnknown &&
      <Button
        name="unknown"
        type="button"
        loading={prom}
        variant="secondary"
        onClick={() => setProm(onUnknown())}
      >
        <Typography variant="CTALargeSecondary" message={<FormattedMessage id="disclosure.unknown.aWwg4M" />} />
      </Button>}
    </UniformSpacingLayout>
  </>;
};

export default DateComponent;
