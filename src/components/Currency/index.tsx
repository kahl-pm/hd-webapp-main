import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { getNumChars, formatCurrency, repositionCursor, cleanValue, LOCALE } from '@policyme/global-libjs-utils';
import { Input } from '@policyme/global-libjs-designsystem';

const currencyMask = {
  [LOCALE.EN_CA]: {
    prefix: '$',
    suffix: '',
    groupSeparator: ',',
  },
  [LOCALE.FR_CA]: {
    prefix: '',
    suffix: '$',
    groupSeparator: ' ',
  },
};

interface CurrencyWithIntlProps {
  name: string;
  value: string | number;
  onChange: (value: number) => void;
  maxLength?: number;
  requiredMessage?: string | React.ReactNode;
  negative?: boolean;
  placeholder?: string;
  intl: IntlShape;
  required?: boolean;
  autoFocus?: boolean;
  dataCy?: string;
  ariaLabel?: string;
  disabled?: boolean;
  max?: number;
}

const CurrencyWithIntl = (props: CurrencyWithIntlProps) => {
  const {
    value: userValue,
    requiredMessage,
    negative = false,
    placeholder = '',
    intl,
    maxLength,
    required,
    autoFocus = false,
    dataCy,
    ariaLabel,
    disabled,
    max,
  } = props;

  const maxChars = maxLength ? getNumChars(intl.locale, maxLength) : 11;
  const calculatedPlaceholder = placeholder
    || intl.formatMessage({ id: 'currency.amountPlaceholder.GqjRro' });

  const formattedStateValue =
    userValue !== undefined && userValue !== null
      ? formatCurrency({
        ...currencyMask[intl.locale],
        intl,
        value: String(userValue),
        isNegative: negative,
      })
      : '';

  const [stateValue, setStateValue] = useState(formattedStateValue);
  const [dirty, setDirty] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [lastKeyStroke, setLastKeyStroke] = useState(null);
  const inputRef = useRef(null);

  /**
   * Process change in value
   */
  const processChange = (value, selectionStart) => {
    setDirty(true);
    const { prefix, suffix, groupSeparator } = currencyMask[intl.locale];

    const { modifiedValue, cursorPosition } = repositionCursor({
      selectionStart,
      value,
      lastKeyStroke,
      stateValue,
      groupSeparator,
      suffix,
      prefix,
    });

    const cleanValueOptions = {
      groupSeparator,
      isNegative: negative,
      prefix,
      suffix,
    };
    // Get value of currency without formatting
    const stringValue = cleanValue({ value: modifiedValue, ...cleanValueOptions });

    // Don't let user modify string with maxLength is met
    if (maxChars && stringValue.replace(/-/g, '').length > maxChars) {
      return stateValue;
    }
    // No formatting required on empty value or negative symbol
    if (stringValue === '' || stringValue === '-') {
      setStateValue(stringValue);
      return stringValue;
    }

    const formattedValue = formatCurrency({
      value: stringValue,
      intl,
      ...currencyMask[intl.locale],
      isNegative: negative,
    });

    if (cursorPosition !== undefined && cursorPosition !== null) {
      // Prevent cursor jumping
      let newCursor = cursorPosition + (formattedValue.length - value.length);
      newCursor = newCursor <= 0 ? (prefix ? formattedValue.length : 0) : newCursor;

      setCursor(newCursor);
      setChangeCount(changeCount + 1);
    }

    setStateValue(formattedValue);
    return formattedValue;
  };

  useEffect(() => {
    // prevent cursor jumping if editing value
    if (
      dirty &&
      stateValue !== '-' &&
      inputRef.current &&
      document.activeElement === inputRef.current
    ) {
      if (stateValue[cursor - 1] === currencyMask[intl.locale].suffix) {
        // Set cursor to before suffix eg: 1,000 $
        inputRef.current.setSelectionRange(cursor - 2, cursor - 2);
      } else {
        inputRef.current.setSelectionRange(cursor, cursor);
      }
    }
  }, [stateValue, cursor, inputRef, dirty, changeCount]);

  const getRenderValue = () => {
    if (
      userValue !== undefined &&
      userValue !== null &&
      stateValue !== '-'
    ) {
      return formatCurrency({
        ...currencyMask[intl.locale],
        intl,
        value: String(userValue),
        isNegative: negative,
      });
    }

    return stateValue;
  };

  return (
    <Input
      name={props.name}
      currency
      required={required}
      label={calculatedPlaceholder}
      placeholder={calculatedPlaceholder}
      data-cy={dataCy}
      requiredMessage={
        requiredMessage || <FormattedMessage id="global.enterAnAmount.zBMdhN" />
      }
      value={getRenderValue()}
      onChange={(value, e) => {
        const stringValue = cleanValue({
          value: processChange(value, e.target.selectionStart),
          isNegative: negative,
          ...currencyMask[intl.locale],
        });
        props.onChange(Number(stringValue));
      }}
      onKeyDown={(e) => setLastKeyStroke(e.key)}
      inputRef={inputRef}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      disabled={props.disabled}
      max={props.max}
    />
  );
};

export default injectIntl(CurrencyWithIntl);
