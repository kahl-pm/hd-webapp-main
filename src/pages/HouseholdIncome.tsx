import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Typography,
  Form,
  Spacer,
  PageContainer,
  MaxWidthContainer,
  isMobile,
  RadioGroup,
} from '@policyme/global-libjs-designsystem';
import { RadioGroupOptionProps } from '@policyme/global-libjs-designsystem/RadioGroup/RadioGroup.types';
import { State } from '../store/types/State';
import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { HOUSEHOLD_INCOME_OPTIONS, HouseholdIncomeType, LEGACY_SEGMENT_EVENTS, SEGMENT_EVENTS } from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import BottomNavigation from '../components/BottomNavigation';
import { makeUpdateProductSessionProp } from '../utils/helpers';
import { sendSegmentTrackEvent } from '../NewActions/analytics';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';
import { isPMEnvironment } from '../tenant/helpers';

const formatHouseholdIncomeChoices = (choices: {
  text: React.ReactNode,
  value: string,
}[]) => {
  return choices.map((choice) => {
    return {
      text: choice.text,
      value: choice.value,
      name: choice.value,
    };
  });
};

const getHouseholdIncomeChoices = () => {
  const householdIncomeChoices: RadioGroupOptionProps[] =
    formatHouseholdIncomeChoices(HOUSEHOLD_INCOME_OPTIONS);

  return householdIncomeChoices;
};

const HouseholdIncomeOptionsGroup = ({
  onHouseholdIncomeChoiceChange,
  householdIncome,
}: {
  onHouseholdIncomeChoiceChange: (householdIncomeChoice: string) => void,
  householdIncome: string
}) => {
  const householdIncomeChoices = getHouseholdIncomeChoices();
  return (
    <RadioGroup
      labelledBy="householdIncome.header.547ujf"
      required
      name="household-income"
      data-cy="household-income"
      variant="outlined"
      options={householdIncomeChoices}
      onChange={(event, value) => onHouseholdIncomeChoiceChange(String(value))}
      orientation="vertical"
      value={householdIncome}
      errorMessage={<FormattedMessage id="global.selectOption.chwFb9" />}
    />
  );
};

const HouseholdIncome = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const userType = useSelector((state: State) => state.metadata.currentUser);
  const mainProduct = useSelector(state => getMainProduct(state, userType));
  const currentHouseholdIncome = useSelector((state: State) => state[userType][`${mainProduct}Session`].household_income);

  useEffect(() => {
    dispatch(onComponentLoad());
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.HD_HOUSEHOLD_INCOME_QUESTION_PAGE));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.HD_HOUSEHOLD_INCOME_QUESTION_PAGE));
    }
  }, []);

  const onHouseholdIncomeChoiceChange = (selectedChoice: HouseholdIncomeType) => {
    dispatch(makeUpdateProductSessionProp(userType, mainProduct)('household_income', selectedChoice));
  };

  const onFormSubmit = () => {
    dispatch(nextQuestion());
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageContainer fullHeight>
        <Typography
          variant="h1"
          align="center"
          message={<FormattedMessage id="householdIncome.header.547ujf" />}
          id="householdIncome.header.547ujf"
        />
        <Spacer size="spaceXL" />
        <Typography
          variant="body2"
          align="center"
          message={<FormattedMessage
            id="householdIncome.subheader.m93dp1"
          />}
        />
        <Spacer size="spaceMedium" />
        <MaxWidthContainer
          width="md"
        >
          <Form
            name="household-income"
            onSubmit={onFormSubmit}
            segmentPayload={{
              name: intl.formatMessage({ id: 'householdIncome.header.547ujf' }),
              product_type: mainProduct,
            }}
          >
            <HouseholdIncomeOptionsGroup
              onHouseholdIncomeChoiceChange={onHouseholdIncomeChoiceChange}
              householdIncome={currentHouseholdIncome}
            />
            <Spacer size="spaceSmall" />
            <Button variant="primary" type="submit" name="Next Button" dataCy="submit" ref={buttonRef} hidden={isMobile()}>
              <Typography
                variant="CTALargePrimary"
                align="center"
                color="white"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
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

export default HouseholdIncome;
