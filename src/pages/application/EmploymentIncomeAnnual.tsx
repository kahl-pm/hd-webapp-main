import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Card, Divider, Form, isMobile, MaxWidthContainer, PageContainer, Spacer, Tooltip, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

import { nextQuestion, onComponentLoad } from '../../NewActions/session';
import { PM_PRODUCT_PREFIX, SESSION_STORAGE_LOGGING } from '../../utils/const';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';
import { addPossessiveApostrophe, hasValue, updateSessionStorage } from '../../utils/helpers';
import { isJoint as isJointSelector } from '../../Selectors/userControl';
import { isBaseEligibilitySelfIncome as isBaseEligibilitySelfIncomeSelector, isBaseEligibilityPartnerIncome as isBaseEligibilityPartnerIncomeSelector } from '../../Selectors/router';

import { getMainProduct, getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { State } from '../../store/types/State';
import Currency from '../../components/Currency';
import BottomNavigation from '../../components/BottomNavigation';

const EmploymentIncomeAnnual = () => {
  const mainProduct = useSelector(
    (state: State) => getMainProduct(state, state.userControl.currentUser),
  );
  const isHd = mainProduct === PM_PRODUCT_PREFIX.HD;
  const productPrefix = useSelector(
    (state: State) => getMainProductEventPrefix(state, state.userControl.currentUser),
  );
  const isJoint = useSelector((state: State) => isJointSelector(state));
  const isBaseEligibilityPartnerIncome = useSelector(
    (state: State) => isBaseEligibilityPartnerIncomeSelector(state),
  );
  const isBaseEligibilitySelfIncome = useSelector(
    (state: State) => isBaseEligibilitySelfIncomeSelector(state),
  );

  const intl = useIntl();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);
  const annualIncomeTooltip = isJoint ?
    <FormattedMessage id="employmentIncomeAnnual.annualIncomeTooltipJoint.Vqi64Y" />
    :
    <FormattedMessage id="employmentIncomeAnnual.annualIncomeTooltip.vyCGic" />;

  // The following question is hardcoded in our policy document
  // If you need to change this copy you also need to change the policy document to match
  const POLICY_DOCUMENT_QUESTION_INCOME_DO_NOT_CHANGE = <FormattedMessage
    id="policyDocumentQuestion.income.q00SjF"
    values={{
      isBaseEligibilityPartnerIncome,
      isJoint,
    }}
  />;

  const handleSubmit = () => {
    dispatch(nextQuestion());
  };

  const title = 'What is your annual family\'s income';
  const headerTooltip = <Tooltip
    variant="icon-only-without-heading"
    ariaDescribedBy="annualIncomeTooltipBody"
    ariaLabel={`${intl.formatMessage({ id: 'policyDocumentQuestion.income.q00SjF' }, { isBaseEligibilityPartnerIncome,
      isJoint })} tooltip`}
    tooltipButtonName={title}
    segmentPayload={{
      name: title,
      product_type: mainProduct,
    }}
  >
    <Typography variant="body1" align="left" message={annualIncomeTooltip} />
  </Tooltip>;
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer fullHeight>
      <Typography
        variant="h1"
        tooltip={headerTooltip}
        message={POLICY_DOCUMENT_QUESTION_INCOME_DO_NOT_CHANGE}
      />
      <Spacer size="spaceSmall" />
      <Typography
        align="center"
        variant="body1"
        message={<FormattedMessage
          id="employmentIncomeAnnual.subheading.gjgcyW"
          values={{
            br: <></>,
          }}
        />}
      />
      {isBaseEligibilityPartnerIncome && <>
        <Spacer size="spaceSmall" />
        <Typography
          variant="body1"
          align="center"
          message={<FormattedMessage
            id="employmentIncomeAnnual.noPartner.zWJUZL"
          />}
        /></>}

      <Spacer size="spaceMedium" />
      <MaxWidthContainer width="md">
        <Form
          onSubmit={handleSubmit}
          name="Employment Income Annual"
          segmentPayload={{
            name: POLICY_DOCUMENT_QUESTION_INCOME_DO_NOT_CHANGE,
            product_type: productPrefix,
          }}
        >
          <UniformSpacingLayout gap="1.5rem" flexDirection="column">
            {isBaseEligibilitySelfIncome && <UserRow />}
            {((isBaseEligibilityPartnerIncome || isJoint)
            && !isHd) && <PartnerRow />}
            <Button type="submit" name="submit" dataCy="submit" hidden={isMobile()} ref={buttonRef}>
              <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
            </Button>
            <UniformSpacingLayout justifyContent="center">
              <Tooltip
                tooltipButtonName="whyIncomes"
                ariaDescribedBy="useOfIncomeTooltipBody"
                tooltipHeader={intl.formatMessage({ id: 'employmentIncomeAnnual.whyIncome.EN8tKx' }, { isBaseEligibilityPartnerIncome,
                  isJoint })}
                ariaLabelledBy="useOfIncomeTooltipHeader"
                variant="icon-and-text"
                tooltipButtonLabel={intl.formatMessage({ id: 'employmentIncomeAnnual.whyIncome.EN8tKx' }, { isBaseEligibilityPartnerIncome,
                  isJoint })}
              >
                <Typography align="left" variant="body1" message={<FormattedMessage id="employmentIncomeAnnual.useOfIncomeInfo.4PIZYf" />} />
              </Tooltip>
            </UniformSpacingLayout>
          </UniformSpacingLayout>
        </Form>
        {/* <SecureFooter noRelative /> */}
      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>;
};

const isShowingBothInputs = (
  isBaseEligibilitySelfIncome: boolean, isJoint: boolean, isHd: boolean,
) => {
  return isBaseEligibilitySelfIncome && isJoint && !isHd;
};

const UserRow = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  const primaryUserIncome = useSelector(
    (state: State) => state.primary.household.userIncome,
  );
  const primaryUserIncomeOverride = useSelector(
    (state: State) => state.primary.household.userIncomeOverride,
  );
  const isJoint = useSelector((state: State) => isJointSelector(state));
  const isBaseEligibilitySelfIncome = useSelector(
    (state: State) => isBaseEligibilitySelfIncomeSelector(state),
  );
  const mainProduct = useSelector(
    (state: State) => getMainProduct(state, state.userControl.currentUser),
  );
  const isHd = mainProduct === PM_PRODUCT_PREFIX.HD;
  const primaryFirstName = useSelector((state: State) => state.primary.household.firstName);
  const application_language = useSelector(
    (state: State) => state.primary.household.application_language,
  );

  // Sync pre-filled userIncome to userIncomeOverride on mount so Redux is correct even if user doesn't change the input
  useEffect(() => {
    if (hasValue(primaryUserIncome) && !hasValue(primaryUserIncomeOverride)) {
      dispatch(updateHouseholdPropPrimary('userIncomeOverride', primaryUserIncome));
      if (isJoint) {
        dispatch(updateHouseholdPropSecondary('partnerIncomeOverride', primaryUserIncome));
      }
      updateSessionStorage(
        SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS,
        [SESSION_STORAGE_LOGGING.PRIMARY_INCOME],
        primaryUserIncome,
      );
    }
  }, [dispatch, isJoint, primaryUserIncome, primaryUserIncomeOverride]);

  const InputComponent = <Currency
    placeholder={intl.formatMessage({ id: 'employmentIncomeAnnual.annualIncome.wblNAo' })}
    name="annual_income"
    value={hasValue(primaryUserIncomeOverride) ? primaryUserIncomeOverride : primaryUserIncome}
    dataCy="annualIncome"
    required
    requiredMessage={<FormattedMessage
      id="employmentIncomeAnnual.annualIncomeRequired.l4fGVD"
    />}
    onChange={(field) => {
      dispatch(updateHouseholdPropPrimary('userIncomeOverride', field));
      if (isJoint) {
        dispatch(updateHouseholdPropSecondary('partnerIncomeOverride', field));
      }
      // log to session storage
      updateSessionStorage(
        SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS,
        [SESSION_STORAGE_LOGGING.PRIMARY_INCOME],
        field,
      );
    }}
  />;
  return isShowingBothInputs(isBaseEligibilitySelfIncome, isJoint, isHd) ? <Card
    cardVariant="only-heading"
    heading={<FormattedMessage
      id="employmentIncomeAnnual.userRowName.Me7aet"
      values={{
        firstName:
       addPossessiveApostrophe(primaryFirstName, application_language),
      }}
    />}
    headingTypographyTagOverride="h2"
    body={<>
      <Divider />
      <Spacer size="spaceMedium" />
      {InputComponent}
    </>}
  /> : InputComponent;
};

const PartnerRow = () => {
  const application_language = useSelector(
    (state: State) => state.primary.household.application_language,
  );
  const isBaseEligibilityPartnerIncome = useSelector(
    (state: State) => isBaseEligibilityPartnerIncomeSelector(state),
  );
  const secondaryFirstName = useSelector((state: State) => state.secondary.household.firstName);
  const partnerLabel = isBaseEligibilityPartnerIncome ?
    <FormattedMessage
      id="employmentIncomeAnnual.partnerIncomeOptional.Soyocg"
    />
    : <FormattedMessage
        id="employmentIncomeAnnual.userRowName.Me7aet"
        values={{
          firstName:
           addPossessiveApostrophe(secondaryFirstName, application_language),
        }}
    />;
  const requiredMessage = isBaseEligibilityPartnerIncome ?
    <FormattedMessage
      id="employmentIncomeAnnual.provideIncomeAmount.xlz1Za"
    />
    : <FormattedMessage
        id="employmentIncomeAnnual.annualIncomeRequired.l4fGVD"
    />;

  const dispatch = useDispatch();
  const secondaryUserIncome = useSelector(
    (state: State) => state.secondary.household.userIncome,
  );
  const secondaryUserIncomeOverride = useSelector(
    (state: State) => state.secondary.household.userIncomeOverride,
  );
  const isBaseEligibilitySelfIncome = useSelector(
    (state: State) => isBaseEligibilitySelfIncomeSelector(state),
  );
  const mainProduct = useSelector(
    (state: State) => getMainProduct(state, state.userControl.currentUser),
  );
  const isHd = mainProduct === PM_PRODUCT_PREFIX.HD;
  const isJoint = useSelector((state: State) => isJointSelector(state));
  const intl = useIntl();

  // Sync pre-filled userIncome to userIncomeOverride on mount so Redux is correct even if user doesn't change the input
  useEffect(() => {
    if (hasValue(secondaryUserIncome) && !hasValue(secondaryUserIncomeOverride)) {
      dispatch(updateHouseholdPropSecondary('userIncomeOverride', secondaryUserIncome));
      dispatch(updateHouseholdPropPrimary('partnerIncomeOverride', secondaryUserIncome));
      updateSessionStorage(
        SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS,
        [SESSION_STORAGE_LOGGING.SECONDARY_INCOME],
        secondaryUserIncome,
      );
    }
  }, [dispatch, secondaryUserIncome, secondaryUserIncomeOverride]);

  const InputComponent = <Currency
    placeholder={intl.formatMessage({ id: 'employmentIncomeAnnual.annualIncome.wblNAo' })}
    name="partner_annual_income"
    dataCy="partnerAnnualIncome"
    value={hasValue(secondaryUserIncomeOverride) ? secondaryUserIncomeOverride : secondaryUserIncome}
    required
    requiredMessage={requiredMessage}
    onChange={
    (field) => {
      dispatch(updateHouseholdPropSecondary('userIncomeOverride', field));
      dispatch(updateHouseholdPropPrimary('partnerIncomeOverride', field));
      // log to session storage
      updateSessionStorage(
        SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS,
        [SESSION_STORAGE_LOGGING.SECONDARY_INCOME],
        field,
      );
    }
  }
  />;

  return isShowingBothInputs(isBaseEligibilitySelfIncome, isJoint, isHd) ? <Card
    cardVariant="only-heading"
    heading={<FormattedMessage
      id="employmentIncomeAnnual.userRowName.Me7aet"
      values={{
        firstName:
     addPossessiveApostrophe(secondaryFirstName, application_language),
      }}
    />}
    headingTypographyTagOverride="h2"
    body={<>
      <Divider />
      <Spacer size="spaceMedium" />
      {InputComponent}
    </>}
  /> : InputComponent;
};

export default EmploymentIncomeAnnual;
