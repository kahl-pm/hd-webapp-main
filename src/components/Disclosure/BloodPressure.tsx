import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { Button, Card, FlexHtoVTablet, FormContext, IconButton, Input, Row, Spacer, TriangleAlertIcon, Typography, UniformSpacingLayout, XIcon } from '@policyme/global-libjs-designsystem';
import { Theme, useTheme } from '@mui/material';

import { hasValue } from '../../utils/helpers';
import { MinMaxErrorContainer } from '../MinMaxErrorContainer';

type BloodPressureReading = {
  systolic: string | number;
  diastolic: string | number;
};

type BloodPressureConstraints = {
  canBeUnknown: boolean;
  maxNumberOfReadings: number;
  maxValDiastolic: number;
  minValDiastolic: number;
  maxValSystolic: number;
  minValSystolic: number;
};

type BloodPressureData = {
  constraints: BloodPressureConstraints;
  id: string;
  text: string;
};

type BloodPressureProps = {
  data: BloodPressureData;
  value: BloodPressureReading[];
  onChange: (newValue: BloodPressureReading[]) => void;
  onUnknown: () => void | Promise<void>;
  userType?: string;
};

type OnChangeType = (newValue: BloodPressureReading[]) => void;

const VALID_BLOOD_PRESSURE_NAME = 'all_valid_blood_pressures';

const hasValidBloodPressureDifference = (difference: number) => difference >= 0;

function createPressureInputs(
  id: string,
  text: string,
  value: BloodPressureReading[],
  onChange: OnChangeType,
  maxValDiastolic: number,
  minValDiastolic: number,
  maxValSystolic: number,
  minValSystolic: number,
  userType: string,
  intl: IntlShape,
  theme: Theme,
): ReactNode[] {
  const inputComponents = [];

  const showClose = value.length > 1;

  const handleChange = (type, i) => (val) => {
    const newValue = [...value];
    let num: number | string = parseInt(val, 10);
    if (Number.isNaN(num)) {
      num = '';
    }
    const bloodPressureData = {
      ...newValue[i],
      [type]: num,
    };
    newValue[i] = bloodPressureData;
    onChange(newValue);
  };

  const handleRemove = (i) => () => {
    const newValue = [...value];
    newValue.splice(i, 1);
    onChange(newValue);
  };

  for (let i = 0; i < value.length; i++) {
    let systolicValue: string | number = '', diastolicValue: string | number = '';
    if (value[i]) {
      systolicValue = hasValue(value[i].systolic) ? value[i].systolic : '';
      diastolicValue = hasValue(value[i].diastolic) ? value[i].diastolic : '';
    }

    const valDifference = Number(systolicValue) - Number(diastolicValue);
    const showError = !hasValidBloodPressureDifference(valDifference);

    inputComponents.push(
      <>
        {/* TODO: Remove hidden error input and use keys to determine
        systolic errors */}
        <FlexHtoVTablet gap="1rem" alignItems="baseline">
          <Typography
            variant="h4"
            message={
              <FormattedMessage
                id="bloodPressure.readingNumber.1J9Z9b"
                values={{ readingNumber: i + 1 }}
              />
            }
            align="left"
            textWrap="nowrap"
          />
          <UniformSpacingLayout flexDirection="row" gap="1rem" alignItems="baseline" fullWidth>
            <Input
              key={`${id}-systolic-${i}`}
              name={`${id}-systolic-${i}`}
              data-cy={`bloodPressure-systolic-${text}-${i}-${userType}`}
              placeholder={
                intl.formatMessage({ id: 'bloodPressure.mmHg.RyO6Dc' })
              }
              value={String(systolicValue)}
              onChange={handleChange('systolic', i)}
              min={minValSystolic}
              minMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
              max={maxValSystolic}
              maxMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
              number
              required
              requiredMessage={<FormattedMessage id="disclosure.enterAnswer.zit7ag" />}
              label={
                intl.formatMessage({ id: 'bloodPressure.systolicPressure.sYUTWC' })
              }
            />
            <Input
              key={`${id}-diastolic-${i}`}
              name={`${id}-diastolic-${i}`}
              data-cy={`bloodPressure-diastolic-${text}-${i}-${userType}`}
              placeholder={
                intl.formatMessage({ id: 'bloodPressure.mmHg.RyO6Dc' })
              }
              value={String(diastolicValue)}
              onChange={handleChange('diastolic', i)}
              min={minValDiastolic}
              minMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
              max={maxValDiastolic}
              maxMessage={<FormattedMessage id="disclosure.enterValidAmount.fCDoAY" />}
              number
              required
              requiredMessage={<FormattedMessage id="disclosure.enterAnswer.zit7ag" />}
              label={
                intl.formatMessage({ id: 'bloodPressure.diastolicPressure.pt9fOT' })
              }
            />
            {showClose && <div>
              <IconButton
                name="remove reading icon"
                onClick={handleRemove(i)}
                icon={<XIcon variant="plain" color={theme._figmaPaletteVariables.linkIcon} size="accordionLarge" />}
              />
            </div>}
          </UniformSpacingLayout>
        </FlexHtoVTablet>
        {showError && <>
          <MinMaxErrorContainer error>
            <TriangleAlertIcon variant="plain" color={theme.palette.error.main} />
            <Typography
              variant="body4"
              message={<FormattedMessage id="bloodPressure.errorMessage.2CEUps" />}
              color={theme.palette.error.main}
              component="span"
            />
          </MinMaxErrorContainer>
          <Spacer size="spaceXS" />
          </>}
      </>,
    );
  }
  return inputComponents;
}

const BloodPressure = (props: BloodPressureProps) => {
  const [prom, setProm] = useState(null);
  const {
    data: {
      constraints: {
        canBeUnknown, maxNumberOfReadings,
        maxValDiastolic, minValDiastolic,
        maxValSystolic, minValSystolic,
      },
      id,
      text,
    },
    value,
    onChange,
    onUnknown,
  } = props;

  const pressureInit = [{
    systolic: '',
    diastolic: '',
  }];

  // initialize value if it is empty
  if (value.length === 0 && value.constructor === Array) {
    onChange([...pressureInit]);
  }

  const showAddReading = value.length < maxNumberOfReadings;
  const intl = useIntl();
  const theme = useTheme();

  const context = useContext(FormContext);
  const formContextControlId = context.callbacks.getControlId(VALID_BLOOD_PRESSURE_NAME);

  const rules: Record<string, any> = {
    custom: () => {
      return value.reduce((prevVal, bloodPressureReading) => {
        const validBloodPressureReadingDifference = Number(bloodPressureReading.systolic)
          - Number(bloodPressureReading.diastolic);
        return prevVal && hasValidBloodPressureDifference(validBloodPressureReadingDifference);
      }, true);
    },
  };

  // Register control to the Form
  useEffect(() => {
    if (context) {
      const getter = () => 0;
      context.callbacks.registerControl(VALID_BLOOD_PRESSURE_NAME, {
        rules,
        getter,
      });
    }
    return () => {
      /**
       * De-register the control with the form context on unmount
       */
      if (context) context.callbacks.deRegisterControl(VALID_BLOOD_PRESSURE_NAME);
    };
  }, [value]);

  return <>
    <Card
      cardVariant="empty"
      body={
        <>
          <input
            name={VALID_BLOOD_PRESSURE_NAME}
            type="hidden"
            id={VALID_BLOOD_PRESSURE_NAME}
            data-form-id={formContextControlId}
          />
          <Spacer size="spaceMedium" />
          <UniformSpacingLayout flexDirection="column" gap="0.5rem">
            {createPressureInputs(
              id, text, value, onChange,
              maxValDiastolic, minValDiastolic,
              maxValSystolic, minValSystolic, props.userType,
              intl, theme,
            )}
          </UniformSpacingLayout>
          <Spacer size="space2XS" />
          {showAddReading &&
            <Button
              onClick={() => onChange([...value, ...pressureInit])}
              data-cy="addReading"
              variant="secondary"
              name="Add Reading"
              type="button"
            >
              <Typography
                variant="CTALargeSecondary"
                message={<FormattedMessage id="bloodPressure.addReading.kkkPr5" />}
              />
            </Button>}
          {canBeUnknown &&
            <Button
              name="Unknown"
              loading={prom}
              onClick={() => setProm(onUnknown())}
              variant="secondary"
            >
              <Typography
                variant="CTALargeSecondary"
                message={<FormattedMessage id="disclosure.unknown.aWwg4M" />}
              />
            </Button>}
        </>
      }
    />
  </>;
};

export default BloodPressure;
