import React, { useEffect, useState } from 'react';
import fill from 'lodash/fill';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Input, Select, Spacer, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

import { hasValue, isEmptyObj } from '../../utils/helpers';

const unitizedSymbolLookup = (intl) => {
  return {
    day: intl.formatMessage({ id: 'aura.unitized.day' }),
    week: intl.formatMessage({ id: 'aura.unitized.week' }),
    month: intl.formatMessage({ id: 'aura.unitized.month' }),
    year: intl.formatMessage({ id: 'aura.unitized.year' }),
    Decimal: intl.formatMessage({ id: 'aura.unitized.EyesightDecimal' }),
    Percent: intl.formatMessage({ id: 'aura.unitized.Percent' }),
    'unit(s)/L': intl.formatMessage({ id: 'aura.unitized.unit/L' }),
    'unit(s)/mL': intl.formatMessage({ id: 'aura.unitized.unit(s)/mL' }),
    'unit(s)/g': intl.formatMessage({ id: 'aura.unitized.unit(s)/g' }),
    PerDay: intl.formatMessage({ id: 'aura.unitized.PerDay' }),
    PerWeek: intl.formatMessage({ id: 'aura.unitized.PerWeek' }),
    PerMonth: intl.formatMessage({ id: 'aura.unitized.PerMonth' }),
    PerYear: intl.formatMessage({ id: 'aura.unitized.PerYear' }),
    '20 ft': intl.formatMessage({ id: 'aura.unitized.Eyesight20ft' }),
    '10K cell(s)/µL': intl.formatMessage({ id: 'aura.unitized.10K_cell(s)/µL' }),
    ft: intl.formatMessage({ id: 'aura.unitized.ft' }),
    in: intl.formatMessage({ id: 'aura.unitized.in' }),
    '1K cell(s)/mL': intl.formatMessage({ id: 'aura.unitized.1K_cell(s)/mL' }),
    'mL/min/1.73m2': intl.formatMessage({ id: 'aura.unitized.mL/min/1.73m2' }),
  };
};

const unitizedLabelLookup = (intl) => {
  return {
    weight: intl.formatMessage({ id: 'aura.unitized.weight' }),
    length: intl.formatMessage({ id: 'aura.unitized.length' }),
    time: intl.formatMessage({ id: 'aura.unitized.time' }),
    frequency: intl.formatMessage({ id: 'aura.unitized.frequency' }),
    speed: intl.formatMessage({ id: 'aura.unitized.speed' }),
    tempature: intl.formatMessage({ id: 'aura.unitized.tempature' }),
    percentage: intl.formatMessage({ id: 'aura.unitized.percentage' }),
    decimalIndex: intl.formatMessage({ id: 'aura.unitized.decimalIndex' }),
    pulse: intl.formatMessage({ id: 'aura.unitized.pulse' }),
    bloodSugar: intl.formatMessage({ id: 'aura.unitized.bloodSugar' }),
    cholesterol: intl.formatMessage({ id: 'aura.unitized.cholesterol' }),
    triglyceride: intl.formatMessage({ id: 'aura.unitized.triglyceride' }),
    psa: intl.formatMessage({ id: 'aura.unitized.psa' }),
    volumeConcentration: intl.formatMessage({ id: 'aura.unitized.volumeConcentration' }),
    volumeConcentrationInsulin: intl.formatMessage({ id: 'aura.unitized.volumeConcentrationInsulin' }),
    weightConcentrationInsulin: intl.formatMessage({ id: 'aura.unitized.weightConcentrationInsulin' }),
    grams: intl.formatMessage({ id: 'aura.unitized.grams' }),
    milligrams: intl.formatMessage({ id: 'aura.unitized.milligrams' }),
    kilograms: intl.formatMessage({ id: 'aura.unitized.kilograms' }),
    ounces: intl.formatMessage({ id: 'aura.unitized.ounces' }),
    pounds: intl.formatMessage({ id: 'aura.unitized.pounds' }),
    stone: intl.formatMessage({ id: 'aura.unitized.stone' }),
    stones: intl.formatMessage({ id: 'aura.unitized.stones' }),
    'stone/pounds': intl.formatMessage({ id: 'aura.unitized.stone/pounds' }),
    microgram: intl.formatMessage({ id: 'aura.unitized.microgram' }),
    picogram: intl.formatMessage({ id: 'aura.unitized.picogram' }),
    centimeters: intl.formatMessage({ id: 'aura.unitized.centimeters' }),
    meters: intl.formatMessage({ id: 'aura.unitized.meters' }),
    'meters/centimeters': intl.formatMessage({ id: 'aura.unitized.meters/centimeters' }),
    kilometers: intl.formatMessage({ id: 'aura.unitized.kilometers' }),
    inches: intl.formatMessage({ id: 'aura.unitized.inches' }),
    feet: intl.formatMessage({ id: 'aura.unitized.feet' }),
    miles: intl.formatMessage({ id: 'aura.unitized.miles' }),
    'feet/inches': intl.formatMessage({ id: 'aura.unitized.feet/inches' }),
    micrometres: intl.formatMessage({ id: 'aura.unitized.micrometres' }),
    millimeter: intl.formatMessage({ id: 'aura.unitized.millimeter' }),
    'Per Day': intl.formatMessage({ id: 'aura.unitized.PerDay' }),
    'Per Week': intl.formatMessage({ id: 'aura.unitized.PerWeek' }),
    'Per Month': intl.formatMessage({ id: 'aura.unitized.PerMonth' }),
    'Per Year': intl.formatMessage({ id: 'aura.unitized.PerYear' }),
    days: intl.formatMessage({ id: 'aura.unitized.days' }),
    weeks: intl.formatMessage({ id: 'aura.unitized.weeks' }),
    months: intl.formatMessage({ id: 'aura.unitized.months' }),
    years: intl.formatMessage({ id: 'aura.unitized.years' }),
    milesperhour: intl.formatMessage({ id: 'aura.unitized.milesperhour' }),
    kilometersperhour: intl.formatMessage({ id: 'aura.unitized.kilometersperhour' }),
    Celsius: intl.formatMessage({ id: 'aura.unitized.Celsius' }),
    Fahrenheit: intl.formatMessage({ id: 'aura.unitized.Fahrenheit' }),
    Percent: intl.formatMessage({ id: 'aura.unitized.Percent' }),
  };
};

const getSelectedAvailableUnit = (availableUnits, unitSymbol) => {
  return availableUnits.find((availableUnit) => (
    availableUnit.unitSymbol === unitSymbol));
};

const createInputComponents = (
  id, text, selectedAvailableUnit, value, onChange, userType, intl,
) => {
  const { symbolParts, validationRanges, decimalPrecision, label } = selectedAvailableUnit;
  let orientation = 'singleColumn';

  const inputComponents = [];

  const handleChange = (i, useDecimals) => (val) => {
    const newValue = { ...value };
    let num;
    if (useDecimals) {
      num = val;
    } else {
      num = parseInt(val, 10);
      if (num > Number.MAX_SAFE_INTEGER) {
        return;
      }
      if (Number.isNaN(num)) {
        num = '';
      }
    }
    newValue.answerParts[i] = num;
    onChange(newValue);
  };

  const useDecimals = decimalPrecision > 0;

  for (let i = 0; i < symbolParts.length; i++) {
    let val = '';
    if (value.answerParts) {
      val = hasValue(value.answerParts[i]) ? value.answerParts[i] : '';
    }
    const translatedSymbolUnit = unitizedSymbolLookup(intl)[symbolParts[i]] || symbolParts[i];

    const sharedProps = {
      key: `${id}-input-${label}-${i}`,
      name: `${id}-input-${label}-${i}`,
      'data-cy': `unitized-input-${text}-${i}-${userType}`,
      // find each occurrence of a lower case character followed by
      // an upper case character, and insert a space between them
      placeholder: translatedSymbolUnit.replace(/([a-z])([A-Z])/g, '$1 $2'),
      label: translatedSymbolUnit.replace(/([a-z])([A-Z])/g, '$1 $2'),
      value: val,
      onChange: handleChange(i, useDecimals),
      min: validationRanges[i].lower,
      max: validationRanges[i].upper,
      required: true,
    };

    const DecimalInput = <Input
      {...sharedProps}
      decimal={{
        whole: 10, decimal: decimalPrecision,
      }}
      intl={{ locale: intl.locale }}
    />;
    const NumberInput = <Input
      {...sharedProps}
      number
    />;
    inputComponents.push(
      useDecimals ? DecimalInput : NumberInput,
    );
  }

  if (inputComponents.length >= 2) {
    orientation = 'multiColumn';
  }

  const flexDirection = orientation === 'multiColumn' ? 'row' : 'column';

  return (
    <UniformSpacingLayout flexDirection={flexDirection} gap="0.5rem">
      {inputComponents}
    </UniformSpacingLayout>
  );
};

interface AvailableUnit {
  decimalPrecision: number;
  label: string;
  unitSymbol: string;
  symbolParts: string[];
  validationRanges: { lower: number, upper: number }[];
}

interface UnitizedProps {
  data: {
    constraints: {
      canBeUnknown: boolean;
      availableUnits: AvailableUnit[];
    },
    id: string;
    text: string;
  }
  onChange: (unitizedData: {
    selectedUnit: string;
    answerParts: string[];
  }) => void;
  onUnknown: () => void;
  value: {
    selectedUnit: string,
    answerParts: string[] | number[]
  };
  userType: string;
}

const Unitized = (props: UnitizedProps) => {
  const intl = useIntl();
  const [prom, setProm] = useState(null);
  const {
    data: {
      constraints: {
        canBeUnknown, availableUnits,
      },
      id,
      text,
    },
    value,
    onChange,
    onUnknown,
  } = props;

  const handleSelectChange = (unitSymbolObj) => {
    const unitSymbol = unitSymbolObj?.value;
    // empty the field if we changed to a different option
    if (unitSymbol !== value.selectedUnit) {
      const selectedAvailableUnit = getSelectedAvailableUnit(availableUnits, unitSymbol);
      const arrayLength = (selectedAvailableUnit && selectedAvailableUnit.symbolParts &&
        selectedAvailableUnit.symbolParts.length) || 0;
      const stringArray = fill(Array(arrayLength), '');
      const unitizedData = {
        selectedUnit: unitSymbol,
        answerParts: stringArray,
      };
      onChange(unitizedData);
    }
  };

  const selectedAvailableUnit = getSelectedAvailableUnit(availableUnits, value.selectedUnit);

  const dropDownOptions = availableUnits.map(availableUnit => {
    return {
      value: availableUnit.unitSymbol,
      text: unitizedLabelLookup(intl)[availableUnit.label] || availableUnit.label,
      label: unitizedLabelLookup(intl)[availableUnit.label] || availableUnit.label,
    };
  });

  // set default value to be the first option
  useEffect(() => {
    if (isEmptyObj(value)) {
      handleSelectChange(dropDownOptions[0]);
    }
  }, [value]);

  return <>
    <UniformSpacingLayout gap="2rem" flexDirection="column">
      <Select
        ariaLabel={text}
        label={<FormattedMessage id="unitized.placeholder.1VRTqd" />}
        name={id}
        options={dropDownOptions}
        onChange={handleSelectChange}
        value={value.selectedUnit}
        required
        requiredMessage={<FormattedMessage id="disclosure.selectOption.IatNRZ" />}
        dataCy={`available-unit-${text}-${props.userType}`}
        multiple={false}
      />
      {!isEmptyObj(value) && selectedAvailableUnit &&
      createInputComponents(
        id, text, selectedAvailableUnit, value, onChange, props.userType, intl,
      )}
      {canBeUnknown &&
      <Button
        name="unknown"
        type="button"
        variant="secondary"
        loading={!!prom}
        onClick={() => setProm(onUnknown())}
      >
        <Typography variant="CTALargeSecondary" message={<FormattedMessage id="disclosure.unknown.aWwg4M" />} />
      </Button>}
    </UniformSpacingLayout>
  </>;
};

export default Unitized;
