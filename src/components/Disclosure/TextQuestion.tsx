import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Input } from '@policyme/global-libjs-designsystem';

interface Constraints {
  canBeUnknown: boolean;
  label: string;
}

interface Data {
  constraints: Constraints;
  id: string;
  text: string;
}

interface TextQuestionProps {
  data: Data;
  value: string;
  onChange: (value: string) => void;
  userType: string;
}

interface IMoreData {
  textarea?: boolean;
  textareaHeight?: number;
}

const TextQuestion = (props: TextQuestionProps) => {
  const {
    data: {
      constraints: {
        canBeUnknown,
      },
      id,
      text,
    },
    value,
    onChange,
  } = props;

  const moreData: IMoreData = {};

  // TODO: api response know whether to display textarea or input
  const isSmallerInput = true;

  if (isSmallerInput) {
    moreData.textarea = true;
    moreData.textareaHeight = 4;
  }
  const intl = useIntl();
  return <div className="text-component">
    <Input
      {...moreData}
      name={id}
      data-cy={`textQuestion-input-${text}-${props.userType}`}
      placeholder={''} // TODO: add placeholder once we know the values
      value={value}
      onChange={onChange}
      required
      requiredMessage={<FormattedMessage id="textQuestion.enterDetails.BZP58U" />}
      label={
        intl.formatMessage({ id: 'textQuestion.label.IjWh2T' })
      }
      multiline
      minRows={3}
    />
  </div>;
};

export default TextQuestion;
