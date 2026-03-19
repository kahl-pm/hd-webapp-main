import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, RadioGroup } from '@policyme/global-libjs-designsystem';
import { UserType } from '../../utils/const';

interface Choice {
  value: string;
  text: string;
}

interface Constraints {
  canBeUnknown: boolean;
  choices: Choice[];
}

type Value = string | number | boolean;

interface SingleChoiceProps {
  data: {
    constraints: Constraints;
    id: string;
    text: string;
  };
  value: Value;
  onChange: (value: Value) => void;
  onUnknown: () => void;
  userType: UserType;
  requiredMessage: string;
}

const SingleChoice = (props:SingleChoiceProps) => {
  const intl = useIntl();

  const translatedChoices = {
    YES: intl.formatMessage({ id: 'global.yes.JVS0d0' }),
    NO: intl.formatMessage({ id: 'global.no.nlGQVZ' }),
  };
  const unknownText = intl.formatMessage({ id: 'disclosure.unknown.aWwg4M' }).toLowerCase();
  const [prom, setProm] = useState(null);

  const {
    data: {
      constraints: { canBeUnknown, choices },
      text,
      id,
    },
    value,
    onChange,
    onUnknown,
  } = props;
  const singleChoiceOptions = choices.map(choice => {
    return {
      value: choice.value,
      text: choice.text,
      label: choice.text,
    };
  });
  const hasUnknownOption = singleChoiceOptions.some(option => {
    if (option.label !== undefined) {
      return option.label.toLowerCase().startsWith(unknownText);
    }
    return false;
  });
  let choiceComponent = <></>;

  if (choices.length === 2 &&
    (
      (choices[0].text === translatedChoices.YES && choices[1].text === translatedChoices.NO) ||
      (choices[0].text === translatedChoices.NO && choices[1].text === translatedChoices.YES)
    )
  ) {
    choiceComponent =
      <RadioGroup
        options={singleChoiceOptions}
        value={value}
        onChange={(_, val) => onChange(val)}
        labelledBy={id}
        name={id}
        data-cy={`single-choice-radio-${text}-${props.userType}`}
        required
        requiredMessage={props.requiredMessage}
        orientation="horizontal"
        variant="outlined"
        data-cy-use-text
      />;
  } else {
    choiceComponent =
      <RadioGroup
        options={singleChoiceOptions}
        value={value}
        onChange={(_, val) => onChange(val)}
        labelledBy={id}
        name={id}
        data-cy={`single-choice-radio-${text}-${props.userType}`}
        required
        requiredMessage={props.requiredMessage}
        orientation="vertical"
        variant="outlined"
        data-cy-use-text
      />;
  }
  return <>
    {choiceComponent}
    {(canBeUnknown && !hasUnknownOption) &&
      <Button
        className="btn btn-secondary"
        type="button"
        name={`button-unknown-${id}`}
        loading={!!prom}
        onClick={() => setProm(onUnknown())}
      >
        <FormattedMessage id="disclosure.unknown.aWwg4M" />
      </Button>}
  </>;
};

export default SingleChoice;
