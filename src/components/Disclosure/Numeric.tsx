import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Input } from '@policyme/global-libjs-designsystem';
import { LOCALE } from '@policyme/global-libjs-designsystem/const';
import { UserType } from '../../utils/const';

interface Constraints {
  canBeUnknown?: boolean;
  minVal?: number;
  maxVal?: number;
  decimalPrecision?: number;
}

interface NumericProps {
  data: {
    constraints: Constraints;
    id: string;
    text: string;
  };
  value: string;
  onChange: (value: string) => void;
  onUnknown: () => void;
  userType: UserType;
}

const Numeric = (props:NumericProps) => {
  const intl = useIntl();
  const [prom, setProm] = useState(null);
  const {
    data: {
      constraints: {
        canBeUnknown, minVal, maxVal, decimalPrecision,
      },
      id,
      text,
    },
    value,
    onChange,
    onUnknown,
  } = props;

  const handleChange = (val) => {
    const newValue = val;
    if (val > Number.MAX_SAFE_INTEGER) {
      return;
    }
    onChange(newValue);
  };

  const useDecimals = decimalPrecision > 0;

  const moreData: {
    decimal: { whole: number, decimal: number },
    intl: { locale: typeof LOCALE[keyof typeof LOCALE] },
  } | { number: true } = useDecimals ? {
    intl: { locale: intl.locale as typeof LOCALE[keyof typeof LOCALE] },
    decimal: { whole: 10, decimal: decimalPrecision },
  } : {
    number: true,
  };

  return <>
    <Input
      name={id}
      data-cy={`numeric-input-${text}-${props.userType}`}
      value={value}
      onChange={handleChange}
      min={minVal}
      minMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
      max={maxVal}
      maxMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
      requiredMessage={<FormattedMessage id="disclosure.enterAnswer.zit7ag" />}
      required
      label={intl.formatMessage({ id: 'aura.numericLabel.B8thdv' })}
      {...moreData}
    />
    {canBeUnknown &&
      <Button
        type="button"
        loading={!!prom}
        onClick={() => setProm(onUnknown())}
        name={`button-unknown-${id}`}
      >
        <FormattedMessage id="disclosure.unknown.aWwg4M" />
      </Button>}
  </>;
};

export default Numeric;
