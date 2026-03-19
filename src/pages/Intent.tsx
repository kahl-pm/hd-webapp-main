import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';
import {
  Button,
  CheckboxGroup,
  Typography,
  Form,
  Spacer,
  PageContainer,
  MaxWidthContainer,
  isMobile,
  RadioGroup,
  Alert,
} from '@policyme/global-libjs-designsystem';
import { CheckboxGroupOptionProps } from '@policyme/global-libjs-designsystem/CheckboxGroup/CheckboxGroup.types';
import { RadioGroupOptionProps } from '@policyme/global-libjs-designsystem/RadioGroup/RadioGroup.types';
import { State } from '../store/types/State';
import { handleSubmitUserIntent } from '../NewActions/handle';
import { onComponentLoad } from '../NewActions/session';
import { AUTH0_RESPONSE_ERROR, PM_PRODUCT_PREFIX, USER_HD_INTENT_CHOICES, USER_INTENT_CHOICES, USER_TYPES } from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import BottomNavigation from '../components/BottomNavigation';

const formatIntentChoices = (choices: {
  text: React.ReactNode,
  value: string,
}[]) => {
  return choices.map((choice) => {
    return {
      text: choice.text,
      value: choice.value,
      checkboxName: choice.value,
      dataCy: `user-intent-${choice.value}`,
    };
  });
};

const getIntentChoices = () => {
  const intentChoices: CheckboxGroupOptionProps[] = formatIntentChoices(USER_INTENT_CHOICES);
  return intentChoices;
};

const getHDIntentChoices = () => {
  const intentChoices: RadioGroupOptionProps[] = formatIntentChoices(USER_HD_INTENT_CHOICES);
  return intentChoices;
};

const HDIntentOptionsGroup = ({
  onIntentChoiceChange,
  intent,
}: {
  onIntentChoiceChange: (selectedChoices: string[]) => void,
  intent: string
}) => {
  const intentChoices = getHDIntentChoices();
  return (
    <RadioGroup
      labelledBy="intent.header.oO5pP6"
      required
      name="intent"
      variant="outlined"
      options={intentChoices}
      onChange={(event, value) => onIntentChoiceChange([`${value}`])}
      orientation="vertical"
      value={intent}
      errorMessage={<FormattedMessage id="global.selectOption.chwFb9" />}
    />
  );
};

const IntentOptionsGroup = ({
  onIntentChoiceChange,
  intents,
}: {
  onIntentChoiceChange: (selectedChoices: string[]) => void,
  intents: string[]
}) => {
  const intentChoices = getIntentChoices();
  return (
    <CheckboxGroup
      ariaDescribedBy="intent.subheader.qr9iT5"
      ariaLabelledBy="intent.header.oO5pP6"
      required
      name="intent"
      variant="outlined"
      options={intentChoices}
      selectedValues={intents}
      onChange={onIntentChoiceChange}
      errorMessage={<FormattedMessage id="global.selectOption.chwFb9" />}
    />
  );
};

const Intent = () => {
  const search = useSelector((state: State) => state.router.location.search);
  const auth0Resp = useSelector((state: State) => state.metadata.auth0Resp);
  const params = queryString.parse(search);

  function getErrorMessage() {
    if ([params?.res, auth0Resp].some(val => val === AUTH0_RESPONSE_ERROR.EMAIL_NOT_FOUND || val === AUTH0_RESPONSE_ERROR.APPLE_RELAY_EMAIL)) {
      return <FormattedMessage id="error.unableToLogin.0a32d1" />;
    }
    return null;
  }

  const errorMessage = getErrorMessage();

  const dispatch = useDispatch();
  const intl = useIntl();
  const mainProduct = useSelector(state => getMainProduct(state, USER_TYPES.PRIMARY));
  const isHD = mainProduct === PM_PRODUCT_PREFIX.HD;

  const initIntents = useSelector((state: State) => (
    state.metadata.userIntent ? state.metadata.userIntent.split(' | ') : []
  ));

  const [intents, setIntents] = useState(initIntents);
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const onIntentChoiceChange = (selectedChoices) => {
    setIntents(selectedChoices);
  };

  const onFormSubmit = () => {
    dispatch(handleSubmitUserIntent(intents, mainProduct));
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageContainer fullHeight>
        { errorMessage ? <><Alert type='high' text={errorMessage} /><Spacer size="spaceMedium" /></> : null }
        <Typography
          variant="h1"
          align="center"
          message={<FormattedMessage id="intent.header.oO5pP6" />}
          id="intent.header.oO5pP6"
        />
        <Spacer size="spaceMedium" />
        {/* No Need to show "check all that apply" for HD */}
        {!isHD && (
          <>
            <Typography
              variant="h2"
              component="body1"
              align="center"
              message={<FormattedMessage id="intent.subheader.qr9iT5" />}
              id="intent.subheader.qr9iT5"
            />
            <Spacer size="spaceMedium" />
          </>
        )}
        <MaxWidthContainer
          width="md"
        >
          <Form
            name="intent_form"
            onSubmit={onFormSubmit}
            segmentPayload={{
              name: intl.formatMessage({ id: 'intent.header.oO5pP6' }),
              product_type: mainProduct,
              user_intent: intents.join(' | '),
            } as any}
          >
            {isHD ? (
              <HDIntentOptionsGroup
                onIntentChoiceChange={onIntentChoiceChange}
                intent={intents[0]}
              />
            ) : (
              <IntentOptionsGroup
                onIntentChoiceChange={onIntentChoiceChange}
                intents={intents}
              />
            )}

            <Spacer size="spaceSmall" />
            <Button variant="primary" type="submit" name="Next Button" dataCy="submit" ref={buttonRef} hidden={isMobile()}>
              <Typography
                variant="CTALargePrimary"
                align="center"
                color="white"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
            {/* <SecureFooter noRelative /> */}
          </Form>
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation
        buttonRef={buttonRef}
        position="sticky"
      />
    </>
  );
};

export default Intent;
