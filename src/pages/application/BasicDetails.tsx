/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Form, MaxWidthContainer, PageContainer, Typography, Button, Spacer, isMobile,
  UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { SEGMENT_EVENTS, USER_TYPES } from '../../utils/const';
import { isACHCSSAffiliate, isJoint } from '../../Selectors/userControl';

import { State } from '../../store/types/State';
import store from '../../store';
import BottomNavigation from '../../components/BottomNavigation';
import DetailCard from '../../components/DetailCard';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';
import { updateGroupName } from '../../NewActions/userControl';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { handleBasicDetailsNextSteps } from '../../NewActions/handle';
import { birthdateStringToReadable, hasValue } from '../../utils/helpers';
import { updateDependentHousehold } from '../../NewActions/dependents';
import { GROUP_NAMES } from '../../tenant/consts';
import { onComponentLoad } from '../../NewActions/session';

const BasicDetails = () => {
  const intl = useIntl();
  const hasPartnerApplication = useSelector<State, boolean>((state) => state.userControl.hasPartnerApplication);
  const mainProduct = useSelector<State>((state) => getMainProduct(state, USER_TYPES.PRIMARY));
  const email = useSelector<State>((state) => state.primary.household.email);
  const firstName = useSelector<State, string>((state) => state.primary.household.firstName);
  const lastName = useSelector<State, string>((state) => state.primary.household.lastName);
  const groupName = useSelector<State, typeof GROUP_NAMES[number]>((state) => state.userControl.affiliate.group_name);
  const isJoint_ = useSelector<State>((state) => isJoint(state));
  const isACHCSSAffiliate_ = useSelector<State, boolean>((state) => isACHCSSAffiliate(state));
  const partnerFirstName = useSelector<State, string>((state) => state.secondary.household.firstName);
  const partnerLastName = useSelector<State, string>((state) => state.secondary.household.lastName);
  const dependent_keys = useSelector<State, string[]>((state) => state.dependents.dependent_keys);
  const dependents = useSelector<State, any>((state) => state.dependents.dependents);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<typeof store.dispatch>();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [headerTitle] = useState(() => {
    if (hasValue(firstName) && hasValue(lastName)) {
      return <FormattedMessage id="sso.confirmTheBasics.36Qs8h" />;
    }
    return <FormattedMessage id="sso.letsStart.koBdd4" />;
  });

  const showPartnerInput = () => {
    return hasValue(firstName) && hasValue(lastName) && hasValue(email);
  };

  const showDepsInput = () => {
    if (isJoint_) {
      return hasValue(partnerFirstName) && hasValue(partnerLastName);
    }
    return hasValue(firstName) && hasValue(lastName) && hasValue(email);
  };

  useEffect(() => {
    dispatch(onComponentLoad(() => {
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await dispatch(handleBasicDetailsNextSteps());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageContainer hasFixedBanner fullHeight>
        <Typography
          variant="h1"
          message={headerTitle}
        />
        <Spacer size="spaceXL" />
        <MaxWidthContainer width="md">
          <Form
            onSubmit={handleSubmit}
            name="disguised_name"
          >
            <UniformSpacingLayout gap="1.5rem" flexDirection="column">
              <DetailCard
                name="primary"
                title={<FormattedMessage id="startApp.yourDetails.nHOvZe14" />}
                expanded
                firstNameValue={firstName}
                lastNameValue={lastName}
                hideEmailInput
                onEmailChange={() => {}}
                onFirstNameChange={(field) => dispatch(updateHouseholdPropPrimary('firstName', field))}
                onLastNameChange={(field) => dispatch(updateHouseholdPropPrimary('lastName', field))}
                dataCyEmail="email"
                dataCyFirstName="firstName"
                dataCyLastName="lastName"
                isACHCSSAffiliate={isACHCSSAffiliate_}
                groupNameValue={groupName}
                onGroupNameChange={(field) => dispatch(updateGroupName(field))}
              />
              {hasPartnerApplication &&
                <DetailCard
                  name="secondary"
                  title={<FormattedMessage id="startApp.yourPartnerDetails.yMAXNi" />}
                  expanded={hasPartnerApplication}
                  firstNameValue={partnerFirstName}
                  lastNameValue={partnerLastName}
                  hideEmailInput
                  onEmailChange={() => {}}
                  onFirstNameChange={(field) => dispatch(updateHouseholdPropSecondary('firstName', field))}
                  onLastNameChange={(field) => dispatch(updateHouseholdPropSecondary('lastName', field))}
                  dataCyFirstName="partnerFirstName"
                  dataCyLastName="partnerLastName"
                />}
              {(showDepsInput() && dependent_keys.length > 0) &&
                dependent_keys.map((key, index) => {
                  const dep = dependents[key];
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
                      expanded={showPartnerInput()}
                      firstNameValue={dep.household.firstName}
                      lastNameValue={dep.household.lastName}
                      hideEmailInput
                      onFirstNameChange={(field) => dispatch(updateDependentHousehold(key, 'firstName', field))}
                      onLastNameChange={(field) => dispatch(updateDependentHousehold(key, 'lastName', field))}
                      onEmailChange={(field) => dispatch(updateDependentHousehold(key, 'email', field))}
                      dataCyFirstName="depFirstName"
                      dataCyLastName="depLastName"
                    />
                  );
                })}
              <Button
                name={`${mainProduct}-start-app-btn`}
                id={`${mainProduct}-start-app-btn`}
                type="submit"
                dataCy="submit"
                ref={buttonRef}
                hidden={isMobile()}
                loading={loading}
              >
                <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
              </Button>
            </UniformSpacingLayout>
            <Spacer size="spaceLarge" />
          </Form>
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>);
};

export default BasicDetails;
