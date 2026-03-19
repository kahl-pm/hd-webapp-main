import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { ErrorMessage, FormContext, Select, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { SingleSelectOnChangeValue } from '@policyme/global-libjs-designsystem/Select/Select.types';

const MONTH_TYPES = [
  { label: <FormattedMessage id="month.january.LPlA5p" />, value: 1 },
  { label: <FormattedMessage id="month.february.Px1uhW" />, value: 2 },
  { label: <FormattedMessage id="month.march.790PVA" />, value: 3 },
  { label: <FormattedMessage id="month.april.7rhexm" />, value: 4 },
  { label: <FormattedMessage id="month.may.OlQGQ4" />, value: 5 },
  { label: <FormattedMessage id="month.june.vs0oce" />, value: 6 },
  { label: <FormattedMessage id="month.july.STXTNK" />, value: 7 },
  { label: <FormattedMessage id="month.august.xwhG7J" />, value: 8 },
  { label: <FormattedMessage id="month.september.Ul0rtP" />, value: 9 },
  { label: <FormattedMessage id="month.october.qziBli" />, value: 10 },
  { label: <FormattedMessage id="month.november.RT0wWx" />, value: 11 },
  { label: <FormattedMessage id="month.december.rJEX73" />, value: 12 },
];

const curr_year = moment().year();
const DOB_YEAR_TYPES = Array.from({ length: curr_year - 1899 }, (_, i) => ({
  label: (curr_year - i).toString(),
  value: curr_year - i,
}));

const DOB_DAY_TYPES = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));

const MONTHS_WITH_THIRTY_DAYS = [4, 6, 9, 11]; // Apr, Jun, Sep, Nov

function isLeapYear(year: number): boolean {
  return new Date(year, 1, 29).getDate() === 29;
}

interface DateOfBirthProps {
  name: string;
  value: string;
  required: boolean;
  onChange: (value: string) => void;
  minAge?: number;
  maxAge?: number;
  maxAgeNearest?: number;
  minAgeMessage?: string | React.ReactNode;
  maxAgeMessage?: string | React.ReactNode;
  maxAgeNearestMessage?: string | React.ReactNode;
  'data-cy'?: string;
}

const DateOfBirth: React.FC<DateOfBirthProps> = ({
  name,
  value,
  required,
  onChange,
  minAge,
  maxAge,
  maxAgeNearest,
  minAgeMessage,
  maxAgeMessage,
  maxAgeNearestMessage,
  'data-cy': dataCy,
}) => {
  const context = useContext(FormContext);
  const formContextControlId = context.callbacks.getControlId(name);

  const [day, setDay] = useState<number>(null);
  const [month, setMonth] = useState<number>(null);
  const [year, setYear] = useState<number>(null);

  const intl = useIntl();

  useEffect(() => {
    if (value.length === 10) {
      const [d, m, y] = value.split('/').map(Number);
      setDay(d || null);
      setMonth(m || null);
      setYear(y || null);
    }
  }, [value]);

  const minMaxErrorMessage = useMemo(() => {
    if (!day || !month || !year) {
      return null;
    }

    return context.callbacks.getErrorMessage(name);
  }, [day, month, year, name, context]);

  const showMinMaxError = !!(context && minMaxErrorMessage);

  const errorMessages = {
    minAge: minAgeMessage,
    maxAge: maxAgeMessage,
    maxAgeNearest: maxAgeNearestMessage,
  };

  const rules: Record<string, any> = {
  };

  // if (required) rules.required = true; is not needed
  // since the select fields are required and they handle the validation
  if (maxAgeNearest !== undefined) rules.maxAgeNearest = maxAgeNearest;
  if (minAge !== undefined) rules.minAge = minAge;
  if (maxAge !== undefined) rules.maxAge = maxAge;

  // Register control to the Form
  useEffect(() => {
    if (context) {
      const getter = () => value;
      context.callbacks.registerControl(name, {
        rules,
        getter,
        errorMessages,
      });
    }
    return () => {
      /**
       * De-register the control with the form context on unmount
       */
      if (context) context.callbacks.deRegisterControl(name);
    };
  }, [name, value]);

  const formatSelectedInput = useCallback((val: number | null): string => {
    return val ? (val < 10 ? `0${val}` : val.toString()) : '__';
  }, []);

  const handleDayMonthYearSelect = useCallback((val: SingleSelectOnChangeValue | null, type: 'day' | 'month' | 'year') => {
    const selectedValue = val?.value ? Number(val.value) : null;
    let newDay = day ? formatSelectedInput(day) : '__';
    let newMonth = month ? formatSelectedInput(month) : '__';
    let newYear = year || '____';

    switch (type) {
      case 'day':
        newDay = formatSelectedInput(selectedValue);
        setDay(selectedValue);
        break;
      case 'month':
        newMonth = formatSelectedInput(selectedValue);
        setMonth(selectedValue);
        break;
      case 'year':
        newYear = selectedValue ? selectedValue.toString() : null;
        setYear(selectedValue);
        break;
      default:
        break;
    }

    const dateStr = `${newDay}/${newMonth}/${newYear}`;
    onChange(dateStr);
  }, [day, month, year, onChange, formatSelectedInput]);

  const filteredDayOptions = DOB_DAY_TYPES.filter((option) => {
    if (MONTHS_WITH_THIRTY_DAYS.includes(month || 0)) {
      return option.value < 31;
    }
    if (month === 2) { // Feb
      if (isLeapYear(year || 0)) {
        return option.value < 30;
      }
      return option.value < 29;
    }
    return true;
  });

  return (
    <>
      <input
        name={name}
        type="hidden"
        required={required}
        id={name}
        value={value}
        data-form-id={formContextControlId}
      />
      <UniformSpacingLayout gap="0.5rem" flexDirection="row">
        <Select
          autoHighlight
          autoSelect
          label={<FormattedMessage id="global.dayDDLabel.DD3IGXQ" />}
          name={`${name}_day`}
          multiple={false}
          value={day}
          options={filteredDayOptions}
          error={showMinMaxError}
          // hide the built in error message since we are showing our own
          hideErrorMessage={showMinMaxError}
          onChange={(val) => handleDayMonthYearSelect(val, 'day')}
          required={required}
          requiredMessage={<FormattedMessage id="global.selectDay.KfX5CF" />}
          dataCy={`${dataCy}-day`}
          ariaLabel={intl.formatMessage({ id: 'global.day.fFa0fM' })}
        />
        <Select
          autoHighlight
          label={<FormattedMessage id="global.monthMMLabel.MMIG9X" />}
          name={`${name}_month`}
          multiple={false}
          value={month}
          options={MONTH_TYPES}
          error={showMinMaxError}
          // hide the built in error message since we are showing our own
          hideErrorMessage={showMinMaxError}
          onChange={(val) => handleDayMonthYearSelect(val, 'month')}
          required={required}
          requiredMessage={<FormattedMessage id="global.selectMonth.m571w7" />}
          dataCy={`${dataCy}-month`}
          ariaLabel={intl.formatMessage({ id: 'global.month.HYfRjK' })}
        />
        <Select
          autoHighlight
          autoSelect
          label={<FormattedMessage id="global.yearYYYYLabel.YYYYQp" />}
          name={`${name}_year`}
          multiple={false}
          value={year}
          options={DOB_YEAR_TYPES}
          error={showMinMaxError}
          // hide the built in error message since we are showing our own
          hideErrorMessage={showMinMaxError}
          onChange={(val) => handleDayMonthYearSelect(val, 'year')}
          required={required}
          requiredMessage={<FormattedMessage id="global.selectYear.xK2lOy" />}
          dataCy={`${dataCy}-year`}
          ariaLabel={intl.formatMessage({ id: 'global.year.RHSUDv' })}
        />
      </UniformSpacingLayout>
      {showMinMaxError && <ErrorMessage message={minMaxErrorMessage} />}
    </>
  );
};

export default DateOfBirth;
