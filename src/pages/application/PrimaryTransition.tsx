import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Form,
  isMobile,
  MaxWidthContainer,
  PageContainer,
  Spacer,
  Typography,
  UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { nextQuestion, onComponentLoad } from '../../NewActions/session';

import { USER_TYPES } from '../../utils/const';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { transformMemberPropsForDisclosure } from '../../utils/transformMemberProps';
import { State } from '../../store/types/State';
import IdentifierBanner from '../../components/IdentifierBanner';
import BottomNavigation from '../../components/BottomNavigation';

const PrimaryTransition = () => {
  const dispatch = useDispatch();
  const productPrefix = useSelector(
    (state:State) => getMainProductEventPrefix(state, USER_TYPES.PRIMARY),
  );
  const family_members = useSelector((state:State) => transformMemberPropsForDisclosure({
    primary: {
      first_name: state.primary.household.firstName,
      last_name: state.primary.household.lastName,
    },
    secondary: {
      first_name: state.secondary.household.firstName,
      last_name: state.secondary.household.lastName,
    },
    dependent_keys: state.dependents.dependent_keys,
    dependents: state.dependents.dependents,
  }));

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer fullHeight>
        <UniformSpacingLayout flexDirection="column" alignItems="center">
          <Typography
            variant="h2"
            message={
              <FormattedMessage
                id="primaryTransition.pageTitle.z9qXSW"
              />
            }
            component="p"
          />
          <Spacer size="spaceSmall" />
          <MaxWidthContainer width="lg">
            <Typography
              variant="h1"
              message={
                <FormattedMessage
                  id="primaryTransition.bothAnsweringQuestions.HrPnyx"
                />
                }
              align="center"
            />
            <Spacer size="spaceMedium" />
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="primaryTransition.tagsHelpKeepTrack.dPgN4J"
                />
              }
              align="center"
            />
            <Spacer size="spaceMedium" />
          </MaxWidthContainer>
          <MaxWidthContainer width="md">
            <Form
              onSubmit={() => {
                dispatch(nextQuestion());
              }}
              name="Primary User Transition"
              segmentPayload={{
                name: <FormattedMessage id="primaryTransition.bothAnsweringQuestions.HrPnyx" />,
                product_type: productPrefix,
              }}
            >
              <UniformSpacingLayout flexDirection="column" alignItems="center" gap="1rem">
                {
                  family_members.map((member) => {
                    return (
                      <IdentifierBanner
                        key={member.userPosition}
                        userInfo={member}
                      />
                    );
                  })
                }
              </UniformSpacingLayout>
              <Spacer size="spaceMedium" />
              <Button name="next-btn" type="submit" dataCy="submit" hidden={isMobile()} ref={buttonRef}>
                <Typography
                  message={<FormattedMessage
                    id="global.next.Q0fXUP"
                  />}
                  variant="CTALargePrimary"
                />
              </Button>
              {/* <SecureFooter noRelative /> */}
            </Form>
          </MaxWidthContainer>
        </UniformSpacingLayout>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default PrimaryTransition;
