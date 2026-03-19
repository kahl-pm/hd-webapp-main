import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckboxGroup, ScreenReaderOnly, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { CheckboxGroupOptionProps } from '@policyme/global-libjs-designsystem/CheckboxGroup/CheckboxGroup.types';
import {
  MULTIPLE_CHOICE_DO_NOT_KNOW_ANSWERS_DEFINITION,
  MULTIPLE_CHOICE_NONE_ANSWERS_DEFINITION,
  UserType,
} from '../../utils/const';

interface Choice {
  value: string;
  text: string;
}

interface Constraints {
  canBeUnknown: boolean;
  choices: Choice[];
}

interface MultiChoiceQuestionProps {
  data: {
    constraints: Constraints;
    id: string;
    text: string;
  };
  value: string[]
  onChange: (value: string[]) => void;
  onUnknown: () => void;
  userType: UserType;
}

const MultipleChoice = (props:MultiChoiceQuestionProps) => {
  const [prom, setProm] = useState(null);
  const {
    data: {
      constraints: { canBeUnknown, choices },
      id,
      text,
    },
    value,
    onChange,
    onUnknown,
  } = props;
  const intl = useIntl();

  const handleChange = (val: string[]) => {
    const oldSelectedValues = [...value];
    const isOptionChecked = val.some(v => !oldSelectedValues.includes(v));
    const newlyCheckedValue = val.filter(v => !oldSelectedValues.includes(v));

    const valTexts = val.map(v => choices.find(c => c.value === v).text.toLowerCase().trim());

    const MULTIPLE_CHOICE_DO_NOT_KNOW_ANSWERS =
      Object.values(MULTIPLE_CHOICE_DO_NOT_KNOW_ANSWERS_DEFINITION)
        .map(definition => intl.formatMessage(definition));
    const MULTIPLE_CHOICE_NONE_ANSWERS =
      Object.values(MULTIPLE_CHOICE_NONE_ANSWERS_DEFINITION)
        .map(definition => intl.formatMessage(definition));

    const isDoNotKnowOrNone = valTexts.some(
      valText => MULTIPLE_CHOICE_DO_NOT_KNOW_ANSWERS.includes(valText)
        || MULTIPLE_CHOICE_NONE_ANSWERS.includes(valText),
    );

    // If unknown or none is selected, uncheck other options
    if (isDoNotKnowOrNone && isOptionChecked) {
      return onChange(newlyCheckedValue);
    }

    return onChange(val);
  };

  const multiChoiceOptions:CheckboxGroupOptionProps[] = choices.map(choice => {
    return {
      text: choice.text,
      value: choice.value,
      checkboxName: choice.value,
      dataCy: `${text}-${choice.text}-${props.userType}`,
    };
  });

  return (
    <>
      <ScreenReaderOnly>
        <Typography
          variant="body1"
          message={
            <FormattedMessage
              id="global.selectAtLeastOneOption.P8L95H"
            />
          }
          id="global.selectAtLeastOneOption.P8L95H"
        />
      </ScreenReaderOnly>
      <CheckboxGroup
        ariaDescribedBy="global.selectAtLeastOneOption.P8L95H"
        ariaLabelledBy="disclosureHeader"
        required
        name={text}
        variant="outlined"
        options={multiChoiceOptions}
        selectedValues={value}
        onChange={handleChange}
        errorMessage={<FormattedMessage id="disclosure.selectOption.IatNRZ" />}
      />
    </>
  );
};

export default MultipleChoice;
