import React, { useRef, useEffect, useState } from 'react';
import {
  Typography,
  Form,
  Button,
  MaxWidthContainer,
  UniformSpacingLayout,
  isMobile,
  PageContainer,
  Spacer,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

import { useDispatch } from 'react-redux';
import DetailCard from '../DetailCard';
import { hasValue } from '../../utils/helpers';
import { handleStartAppNextSteps } from '../../NewActions/handle';
import { updateEmailPrimary, updateEmailSecondary, updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';
import BottomNavigation from '../BottomNavigation';
import { updateGroupName } from '../../NewActions/userControl';
import { StartAppProps } from '../../pages/types/StartApp.types';

const StartWithBasics = (props: StartAppProps) => {
  const [showPartnerInput, setShowPartnerInput] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowPartnerInput(
      hasValue(props.firstName) && hasValue(props.lastName) && hasValue(props.email),
    );
  }, [props]);

  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer fullHeight>
        <UniformSpacingLayout gap="1.5rem" flexDirection="column">
          <Typography
            variant="h1"
            message={<FormattedMessage
              id="sso.letsStart.koBdd4"
            />}
          />

          <MaxWidthContainer width="md">
            <Form
              onSubmit={() => { dispatch(handleStartAppNextSteps(props.mainProduct)); }}
              name="app-contact"
              segmentPayload={{
                name: <FormattedMessage id="startAppRegular.readyToSee.ee9lOe" />,
                product_type: props.mainProduct,
              }}
            >
              <UniformSpacingLayout gap="1.5rem" flexDirection="column">
                <DetailCard
                  name="primary"
                  title={<FormattedMessage id="startApp.yourDetails.nHOvZe14" />}
                  expanded
                  firstNameValue={props.firstName}
                  lastNameValue={props.lastName}
                  emailValue={props.email}
                  firstNameDisabled={props.firstNameDisabled}
                  lastNameDisabled={props.lastNameDisabled}
                  hideEmailInput
                  onFirstNameChange={(field) => dispatch(updateHouseholdPropPrimary('firstName', field))}
                  onLastNameChange={(field) => dispatch(updateHouseholdPropPrimary('lastName', field))}
                  onEmailChange={(field) => dispatch(updateEmailPrimary(field))}
                  dataCyEmail="email"
                  dataCyFirstName="firstName"
                  dataCyLastName="lastName"
                  isACHCSSAffiliate={props.isACHCSSAffiliate}
                  groupNameValue={props.groupName}
                  onGroupNameChange={(field) => dispatch(updateGroupName(field))}
                />
                {showPartnerInput &&
                <DetailCard
                  name="secondary"
                  title={<FormattedMessage id="startApp.yourPartnerDetails.yMAXNi" />}
                  expanded={showPartnerInput}
                  firstNameValue={props.partnerFirstName}
                  lastNameValue={props.partnerLastName}
                  hideEmailInput
                  onFirstNameChange={(field) => dispatch(updateHouseholdPropSecondary('firstName', field))}
                  onLastNameChange={(field) => dispatch(updateHouseholdPropSecondary('lastName', field))}
                  onEmailChange={(field) => dispatch(updateEmailSecondary(field))}
                  dataCyFirstName="partnerFirstName"
                  dataCyLastName="partnerLastName"
                />}
                <Button
                  name={`${props.mainProduct}-start-app-btn`}
                  id={`${props.mainProduct}-start-app-btn`}
                  type="submit"
                  dataCy="submit"
                  ref={buttonRef}
                  hidden={isMobile()}
                >
                  <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
                </Button>
              </UniformSpacingLayout>
            </Form>
          </MaxWidthContainer>
        </UniformSpacingLayout>
        <Spacer size="space2XL" />
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default StartWithBasics;