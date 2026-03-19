import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Input } from '@policyme/global-libjs-designsystem';
import {
  isValidDay,
  isValidMonth,
  isValidYear,
  isNumeric,
  formatMonth,
} from '../../utils/helpers';

interface DateProps {
  dateFormat: 'date' | 'monthYear';
  required?: boolean;
  label: string;
  name: string;
  onChange: (val: string) => void;
  requiredMessage?: React.ReactNode;
  minAge?: boolean;
  maxAge?: boolean;
  minDate?: boolean;
  maxDate?: boolean;
  minMonthYear?: boolean;
  maxMonthYear?: boolean;
  maxAgeNearest?: boolean;
  value: string;
  maxAgeMessage?: React.ReactNode;
  minAgeMessage?: React.ReactNode;
  maxAgeNearestMessage?: React.ReactNode;
  minMonthYearMessage?: React.ReactNode;
  maxMonthYearMessage?: React.ReactNode;
  minDateMessage?: React.ReactNode;
  maxDateMessage?: React.ReactNode;
  dataCy?: string;
}

const Date = (props: DateProps) => {
  const [date, setDate] = useState(props.value);
  const intl = useIntl();

  const onInputChange = ([value, cursor]: [string, number]) => {
    props.onChange(value);
    setDate(value);
    const input = document.getElementById(props.name) as HTMLInputElement;
    window.requestAnimationFrame(() => {
      input.selectionStart = cursor;
      input.selectionEnd = cursor;
    });
  };

  /**
   *
   * Consumes the javascript event from html input and validates it
   * while rejecting errors. The input is also formatted and the
   * cursor is adjusted accordingly.
   *
   */
  const parseDate = (val: string, event: React.ChangeEvent<HTMLInputElement>): [string, number] => {
    let prevDateVal = date;
    let input = val;
    let cursor = event.target.selectionStart;

    // Enabling and validating auto-complete
    if (prevDateVal.length === 0 && input.length === 10) {
      let [day, month, year] = input.split('/');
      if (!isValidDay(day) || !isValidMonth(month) || !isValidYear(year)) {
        return [prevDateVal, 0];
      }
      return [input, 10];
    }

    let valid = true;
    let newVal = input;
    // Adding forward slashes and underscores when input is initially entered
    if (input.length === 1) {
      if (!isNumeric(input)) {
        valid = false;
      } else if (parseInt(input[0], 10) > 3) {
        newVal = `0${input[0]}/__/____`;
        cursor++;
      } else {
        newVal = `${input}_/__/____`;
      }
      // Deletion logic for when the user hits backspace
    } else if (prevDateVal.length > input.length) {
      if ((prevDateVal.length - input.length) > 1) {
        cursor += prevDateVal.length - input.length;
        valid = false;
      } else if (['_', '/'].includes(prevDateVal[cursor])) {
        valid = false;
      } else if (!isNumeric(input)) {
        newVal = '';
      } else {
        newVal = `${input.slice(0, cursor)}_${input.slice(cursor)}`;
      }
      // Checking the character was entered in a valid location
    } else if (input[cursor] !== '_') {
      valid = false;
      cursor--;
      // Checking if an invalid character was enetered
    } else if (!isNumeric(input[cursor - 1])) {
      valid = false;
      cursor--;
      // Validating the users input and placing the cursor in response to validation
    } else {
      newVal = `${input.slice(0, cursor)}${input.slice(cursor + 1)}`;
      let [day, month, year] = newVal.split('/');
      month = formatMonth(month);
      if (cursor === 4 && isNumeric(month[1])) {
        cursor++;
      }
      if (!isValidDay(day) || !isValidMonth(month) || !isValidYear(year)) {
        valid = false;
        cursor--;
      }
      newVal = `${day}/${month}/${year}`;
    }

    if (!valid) {
      newVal = prevDateVal;
    }

    // Moving the cursor past the slash to help users with input
    if (newVal[cursor] === '/' && prevDateVal.length < input.length) {
      cursor++;
    }

    return [newVal, cursor];
  };

  /*
  For parsing mm/yy formats
  */
  const parseMonthYear =
    (val: string, event: React.ChangeEvent<HTMLInputElement>): [string, number] => {
      let prevDateVal = date;
      let input = val;
      let cursor = event.target.selectionStart;

      // Enabling and validating auto-complete
      if (prevDateVal.length === 0 && input.length === 7) {
        let [month, year] = input.split('/');
        if (!isValidMonth(month) || !isValidYear(year)) {
          return [prevDateVal, 0];
        }
        return [input, 7];
      }

      let valid = true;
      let newVal = input;
      // Adding forward slashes and underscores when input is initially entered
      if (input.length === 1) {
        if (!isNumeric(input)) {
          valid = false;
        } else if (parseInt(input[0], 10) > 1) {
          newVal = `0${input[0]}/____`;
          cursor++;
        } else {
          newVal = `${input}_/____`;
        }
      // Deletion logic for when the user hits backspace
      } else if (prevDateVal.length > input.length) {
        if ((prevDateVal.length - input.length) > 1) {
          cursor += prevDateVal.length - input.length;
          valid = false;
        } else if (['_', '/'].includes(prevDateVal[cursor])) {
          valid = false;
        } else if (!isNumeric(input)) {
          newVal = '';
        } else {
          newVal = `${input.slice(0, cursor)}_${input.slice(cursor)}`;
        }
      // Checking the character was entered in a valid location
      } else if (input[cursor] !== '_') {
        valid = false;
        cursor--;
      // Checking if an invalid character was enetered
      } else if (!isNumeric(input[cursor - 1])) {
        valid = false;
        cursor--;
      // Validating the users input and placing the cursor in response to validation
      } else {
        newVal = `${input.slice(0, cursor)}${input.slice(cursor + 1)}`;
        let [month, year] = newVal.split('/');
        month = formatMonth(month);
        if (cursor === 1 && isNumeric(month[1])) {
          cursor++;
        }
        if (!isValidMonth(month) || !isValidYear(year)) {
          valid = false;
          cursor--;
        }
        newVal = `${month}/${year}`;
      }

      if (!valid) {
        newVal = prevDateVal;
      }

      // Moving the cursor past the slash to help users with input
      if (newVal[cursor] === '/' && prevDateVal.length < input.length) {
        cursor++;
      }

      return [newVal, cursor];
    };

  const {
    name, value, label = intl.formatMessage({ id: 'global.dateMonthYearLabel.dpq9ns' }), required, dateFormat,
    onChange, requiredMessage = <FormattedMessage id="date.enterDate.g6QgBY" />, dataCy, ...restOfProps
  } = props;

  const getParsedDate = (val: string, e: React.ChangeEvent<HTMLInputElement>) => (dateFormat === 'monthYear' ? parseMonthYear(val, e) : parseDate(val, e));

  return (
    <Input
      name={name}
      currency
      autoComplete="false"
      required={required}
      label={label}
      requiredMessage={requiredMessage}
      data-cy={dataCy}
      value={value}
      placeholder={label}
      aria-describedby={`${name}-errors`}
      onChange={(val, e) => { onInputChange(getParsedDate(val, e)); }}
      {...{ [dateFormat]: true }}
      {...restOfProps}
    />
  );
};

export default Date;
