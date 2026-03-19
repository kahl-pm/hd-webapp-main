import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Form,
  Spacer,
  Button,
  MaxWidthContainer,
  UniformSpacingLayout,
  PageContainer,
  isMobile,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { birthdateStringToReadable, hasValue, isSocialSignOnFeatureEnabled } from '../../utils/helpers';
import DetailCard from '../DetailCard';
import { EXPERIENCE_LEVEL, PROVINCES_ABBREVIATIONS, UNDERWRITING_METHODS } from '../../utils/const';
import { StartAppProps } from '../../pages/types/StartApp.types';
import { handleStartAppNextSteps, handleStartAppNextStepsForSocialSignOn } from '../../NewActions/handle';
import { updateEmailPrimary, updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';
import { updateDependentHousehold } from '../../NewActions/dependents';
import NoFees from '../NoFees';
import BottomNavigation from '../BottomNavigation';
import StartAppHDFaq from '../HDFaq/StartAppHDFaq';
import SocialSignOn from '../SocialSignOn';
import { State } from '../../store/types/State';
import { useEmailManagement } from './useEmailManagement';
import { isLoggedInUser } from '../../Selectors/userControl';

const StartAppHD = (props: StartAppProps) => {
  // If user has started recommendation journey, we don't want to show social sign on
  // because their email has already been captured and it might not match the social sign on email
  // We are determining this by experience level and email but we want to exclude Quebec from this
  // since Quebec goes through recommendation journey by default
  const skipSocialSignOn = useSelector<State, boolean>(
    (state) => state.metadata.experienceLevel === EXPERIENCE_LEVEL.NOVICE
      && !!state.primary.household.email
      && state.primary.household.province !== PROVINCES_ABBREVIATIONS.QC,
  );

  const isSocialSignOnEnabled_ = isSocialSignOnFeatureEnabled();

  if (isSocialSignOnEnabled_ && !skipSocialSignOn) {
    return <StartAppHDSocialSignOn {...props} />;
  }
  return <StartAppHDLegacy {...props} />;
};

const getButtonText = (props: StartAppProps) => {
  if (props.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN) {
    return props.isJoint ? (
      <FormattedMessage id="startApp.jointCtaText.61Vza2" />
    ) : (
      <FormattedMessage id="startApp.regularCtaText.ijo3wU" />
    );
  }
  return <FormattedMessage id="global.next.Q0fXUP" />;
};

const StartAppHDSocialSignOn = (props: StartAppProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const title =
    props.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ? (
      <FormattedMessage id="startAppRegular.readyToSee.ee9lOe" />
    ) : (
      <FormattedMessage id="startAppRegular.readyToCheckout.AcMVFF" />
    );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    if (loading) return;

    setLoading(true);
    try {
      await dispatch(handleStartAppNextStepsForSocialSignOn(props.mainProduct));
    } finally {
      setLoading(false);
    }
  };
  const isLoggedIn = useSelector<State, boolean>((state) => isLoggedInUser(state));
  const isEmailDisabled = isLoggedIn;
  const isSignOnDisabled = isLoggedIn;

  return (
    <>
      <PageContainer fullHeight>
        <PageContainer gap="1rem">
          {
            props.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ? (
              <>
                <Typography
                  variant="h1"
                  message={<FormattedMessage id="sso.login.309jd2" />}
                />
                <Typography
                  variant="body1"
                  message={
                    <FormattedMessage
                      id="startAppRegular.questions.ZtCClf"
                    />
                  }
                />
              </>
            ) : (
              <>
                <Typography
                  variant="h1"
                  message={<FormattedMessage id="startAppAlternate.createAccount.HTNYsk" />}
                  data-cy="start-app-alternate-header"
                />
                <Typography
                  variant="body1"
                  message={
                    <FormattedMessage
                      id="startAppAlternate.questions.WMPNVg"
                    />
                  }
                  data-cy="start-app-alternate-question"
                />
              </>
            )
          }
          <MaxWidthContainer width="md">
            <Form
              onSubmit={handleSubmit}
              name="app-contact"
              segmentPayload={{
                name: title,
                product_type: props.mainProduct,
              }}
            >
              <UniformSpacingLayout gap="1rem" flexDirection="column">
                <SocialSignOn
                  onEmailChange={(field) => dispatch(updateEmailPrimary(field))}
                  emailValue={props.email}
                  isEmailDisabled={isEmailDisabled}
                  isSignOnDisabled={isSignOnDisabled}
                  onSubmit={handleSubmit}
                />
              </UniformSpacingLayout>
              <Spacer size="spaceMedium" />
              <div>
                <Button
                  variant="primary"
                  name="submit"
                  type="submit"
                  dataCy="submit"
                  hidden={isMobile()}
                  ref={buttonRef}
                  loading={loading}
                >
                  {getButtonText(props)}
                </Button>
                <StartAppHDFaq />
              </div>
            </Form>
          </MaxWidthContainer>
        </PageContainer>
        <NoFees />
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

const StartAppHDLegacy = (props: StartAppProps) => {
  const [showPartnerInput, setShowPartnerInput] = useState(false);
  const [showDepsInput, setShowDepsInput] = useState(false);
  const { localEmail, updateLocalEmail } = useEmailManagement(props.email);
  const intl = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    setShowPartnerInput(
      hasValue(props.firstName) && hasValue(props.lastName) && hasValue(localEmail),
    );
    if (props.isJoint) {
      setShowDepsInput(
        hasValue(props.partnerFirstName) && hasValue(props.partnerLastName),
      );
    } else {
      setShowDepsInput(
        hasValue(props.firstName) && hasValue(props.lastName) && hasValue(localEmail),
      );
    }
  }, [props, localEmail]);

  const title =
    props.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ? (
      <FormattedMessage id="startAppRegular.readyToSee.ee9lOe" />
    ) : (
      <FormattedMessage id="startAppRegular.readyToCheckout.AcMVFF" />
    );
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer fullHeight>
        <PageContainer gap="1rem">
          {
            props.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ? (
              <>
                <Typography
                  variant="h1"
                  message={<FormattedMessage id="startAppRegular.readyToSee.ee9lOe" />}
                />
                <Typography
                  variant="body1"
                  message={
                    <FormattedMessage
                      id="startAppRegular.questions.ZtCClf"
                    />
                  }
                />
              </>
            ) : (
              <>
                <Typography
                  variant="h1"
                  message={<FormattedMessage id="startAppAlternate.createAccount.HTNYsk" />}
                  data-cy="start-app-alternate-header"
                />
                <Typography
                  variant="body1"
                  message={
                    <FormattedMessage
                      id="startAppAlternate.questions.WMPNVg"
                    />
                  }
                  data-cy="start-app-alternate-question"
                />
              </>
            )
          }
          <MaxWidthContainer width="md">
            <Form
              onSubmit={() => {
                dispatch(updateEmailPrimary(localEmail));
                dispatch(handleStartAppNextSteps(props.mainProduct));
              }}
              name="app-contact"
              segmentPayload={{
                name: title,
                product_type: props.mainProduct,
              }}
            >
              <UniformSpacingLayout gap="1rem" flexDirection="column">
                <DetailCard
                  name="primary"
                  title={<FormattedMessage id="startApp.yourDetails.nHOvZe14" />}
                  expanded
                  firstNameValue={props.firstName}
                  lastNameValue={props.lastName}
                  emailValue={localEmail}
                  firstNameDisabled={props.firstNameDisabled}
                  lastNameDisabled={props.lastNameDisabled}
                  emailDisabled={props.emailDisabled}
                  onFirstNameChange={(field) => dispatch(updateHouseholdPropPrimary('firstName', field))}
                  onLastNameChange={(field) => dispatch(updateHouseholdPropPrimary('lastName', field))}
                  onEmailChange={(field) => updateLocalEmail(field)}
                  dataCyEmail="email"
                  dataCyFirstName="firstName"
                  dataCyLastName="lastName"
                />
                {(showPartnerInput && props.isJoint) &&
                <DetailCard
                  name="secondary"
                  title={<FormattedMessage id="startApp.yourPartnerDetails.yMAXNi" />}
                  expanded={showPartnerInput}
                  firstNameValue={props.partnerFirstName}
                  lastNameValue={props.partnerLastName}
                  hideEmailInput
                  onFirstNameChange={(field) => dispatch(updateHouseholdPropSecondary('firstName', field))}
                  onLastNameChange={(field) => dispatch(updateHouseholdPropSecondary('lastName', field))}
                  onEmailChange={(_) => {}}
                  dataCyFirstName="partnerFirstName"
                  dataCyLastName="partnerLastName"
                />}
                {(showDepsInput && props.dependent_keys.length > 0) &&
              props.dependent_keys.map((key, index) => {
                const dep = props.dependents[key];
                return (
                  <DetailCard
                    key={key}
                    name={key}
                    title={<FormattedMessage id="startApp.DependentDetails.CaoGkaQ" values={{ index: index + 1 }} />}
                    isDependent
                    formattedBirthday={
                      birthdateStringToReadable(dep.household.birthdate, intl.locale)
                    }
                    gender={dep.household.userGender ? dep.household.userGender[0] : ''}
                    expanded={showPartnerInput}
                    firstNameValue={dep.household.firstName}
                    lastNameValue={dep.household.lastName}
                    hideEmailInput
                    onFirstNameChange={(field) => dispatch(updateDependentHousehold(key, 'firstName', field))}
                    onLastNameChange={(field) => dispatch(updateDependentHousehold(key, 'lastName', field))}
                    onEmailChange={(_) => {}}
                    dataCyFirstName="depFirstName"
                    dataCyLastName="depLastName"
                  />
                );
              })}
              </UniformSpacingLayout>
              <Spacer size="spaceMedium" />
              <div>
                <Button variant="primary" name="submit" type="submit" dataCy="submit" hidden={isMobile()} ref={buttonRef}>
                  {getButtonText(props)}
                </Button>
                <StartAppHDFaq />
              </div>
            </Form>
          </MaxWidthContainer>
        </PageContainer>
        <NoFees />
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default StartAppHD;
