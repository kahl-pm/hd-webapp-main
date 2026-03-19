import React from 'react';
import { RadioGroup } from '@policyme/global-libjs-designsystem';

interface Choice {
  value: string;
  text: string;
}

interface Constraints {
  canBeUnknown: boolean;
  choices: Choice[];
}

interface Data {
  constraints: Constraints;
  text: string;
  id: string;
}

interface NumericChoiceProps {
  data: Data;
  value: string;
  onChange: (value: string) => void;
  userType: string;
  requiredMessage?: string;
}

const NumericChoice = (props: NumericChoiceProps) => {
  const {
    data: {
      constraints: { canBeUnknown, choices },
      text,
      id,
    },
    value,
    onChange,
  } = props;

  const singleChoiceOptions = choices.map(choice => {
    return {
      value: choice.value,
      text: choice.text,
      label: choice.text,
    };
  });

  return (
    <RadioGroup
      options={singleChoiceOptions}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      labelledBy={id}
      name={id}
      data-cy={`numeric-choice-radio-${text}-${props.userType}`}
      required
      requiredMessage={props.requiredMessage}
      orientation="vertical"
      data-cy-use-text
      variant="outlined"
    />
  );
};

export default NumericChoice;
