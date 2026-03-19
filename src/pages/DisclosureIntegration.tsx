import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { sentryError } from '@policyme/global-libjs-utils';
import { Button, Form, isMobile, MaxWidthContainer, PageContainer, Spacer, Tooltip, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import DisclosureComponents from '../components/Disclosure';

import { onComponentLoad } from '../NewActions/session';
import { handleSubmitDisclosure, handleUnknownDisclosure } from '../NewActions/handle';
import { makeAnswerCurrentQuestion, getAuraDisclosureSearch } from '../NewActions/disclosure';
import { DisclosureAnswer, DisclosureQuestion, getCurrentDisclosure, getCurrentDisclosureUserType } from '../Selectors/disclosure';
import { USER_TYPES } from '../utils/const';
import { isDisclosureIntegrationPage as isDisclosureIntegrationPageSelector } from '../Selectors/metadata';
import { getMainProduct } from '../Selectors/helpers/productApp';

import { isJoint as isJointSelector, hasDependents } from '../Selectors/userControl';
import { clearUnansweredDisclosures } from '../NewActions/metadata';
import { isEmptyObj, transformUserKey } from '../utils/helpers';
import { transformMemberPropsForDisclosure } from '../utils/transformMemberProps';
import { State } from '../store/types/State';
import ContextHeader from '../components/Disclosure/ContextHeader';
import IdentifierBanner from '../components/IdentifierBanner';
import BottomNavigation from '../components/BottomNavigation';

const TypographyTooltip = ({ question, productType }) => {
  return <Tooltip
    tooltipButtonName={`${question.text} tooltip`}
    ariaDescribedBy="disclosureHeaderTooltipBody"
    ariaLabel={`${question.text} tooltip`}
    variant="icon-only-without-heading"
    segmentPayload={{
      name: question.text,
      product_type: productType,
    }}
  >
    <Typography variant="body1" message={question.helpText} />
  </Tooltip>;
};

const Disclosure = () => {
  const dispatch = useDispatch();
  const [prom, setProm] = useState(null);
  const currentDisclosure = useSelector((state: State) => getCurrentDisclosure(state));
  const userTypeProp = useSelector((state: State) => getCurrentDisclosureUserType(state));
  const currRoute = useSelector((state: State) => state.metadata.currRoute);
  const action = useSelector((state: State) => state.router.action);
  const isDisclosureIntegrationPage = useSelector(
    (state: State) => isDisclosureIntegrationPageSelector(state.metadata.currRoute),
  );
  const isJoint = useSelector((state: State) => isJointSelector(state) || hasDependents(state));
  const productType = useSelector((state: State) => getMainProduct(
    state, getCurrentDisclosureUserType(state),
  ));
  const family_members = useSelector((state: State) => transformMemberPropsForDisclosure({
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
  // Due to the workaround to handle the forward press button disabling,
  // the backPressed in the redux state doesn't actually reflect if
  // we went back on an aura page as the workaround ends up pushing a new
  // page at the end.
  const [backPressed, setBackPresed] = useState(false);
  useEffect(() => {
    if (isDisclosureIntegrationPage) {
      dispatch(
        onComponentLoad(() => {
          if (action === 'POP') {
            setBackPresed(true);
            // NP2-2798 bit of a race condition issue where
            // we have the browserback logic occuring and this action triggering.
            // Since we no longer have the :userType in the url, we crash the page
            // this condition is here to protect against that
            if (userTypeProp) {
              dispatch(clearUnansweredDisclosures(userTypeProp));
            }
          } else if (action === 'PUSH') {
            // isDisclosureIntegrationPage is used in order to not run any of these
            // when we go from a disclosure page to a non-disclosure page
            // or vice-versa
            if (backPressed) {
              setBackPresed(false);
            }
          }
        }),
      );
    }
  }, [currRoute]);

  const {
    question = {} as DisclosureQuestion,
    answer = {} as DisclosureAnswer,
  } = currentDisclosure;

  const { value = '' } = answer;

  // if page reloads and redirects user to start, the disclosure page will still be rendered
  // isDisclosureIntegrationPage is true but question.type becomes undefined
  // we should not trigger a sentry error
  if (isDisclosureIntegrationPage && question.type && !DisclosureComponents[question.type]) {
    sentryError(`Question type ${question.type} does not exist in DisclosureComponents list of supported questions`);
  }
  const QuestionComponent = DisclosureComponents[question.type] || React.Fragment;
  const onSubmit = () => {
    setProm(true);
    // @ts-ignore https://stackoverflow.com/questions/67633259/property-then-does-not-exist-on-type-dispatch-any-promiseany-ts2339
    // TODO: Refactor store.js to ts and remove ts-ignore
    dispatch(handleSubmitDisclosure()).then(_ => {
      setProm(false);
    });
  };

  const onUnknown = () => {
    // TODO: add unknown logic
  };

  const retrieveCurrentUserInfo = () => {
    const [userType, dependentKey] = transformUserKey(userTypeProp);
    if (userType === USER_TYPES.PRIMARY) {
      return family_members.find(member => member.userType === USER_TYPES.PRIMARY) ?? {};
    } else if (userType === USER_TYPES.SECONDARY) {
      return family_members.find(member => member.userType === USER_TYPES.SECONDARY) ?? {};
    } else if (userType === USER_TYPES.DEPENDENT) {
      return family_members.find(member => member.userType
        === USER_TYPES.DEPENDENT && member.dependentKey === dependentKey) ?? {};
    }
    return family_members.find(member => member.userType === USER_TYPES.PRIMARY) ?? {};
  };

  const userInfo = retrieveCurrentUserInfo();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return <>
    <PageContainer fullHeight>
      <MaxWidthContainer width="xl">
        <UniformSpacingLayout gap="1.5rem" flexDirection="column">
          {isJoint && !isEmptyObj(userInfo) && <IdentifierBanner userInfo={userInfo} />}

          <ContextHeader data={question} />
        </UniformSpacingLayout>
        <Spacer size="spaceSmall" />
        {question.text && (
        <Typography
          variant="h1"
          message={question.text}
          id="disclosureHeader"
          tooltip={
            question.helpText ?
              <TypographyTooltip question={question} productType={productType} /> : undefined
          }
        />
        )}
      </MaxWidthContainer>
      <Spacer size="spaceXL" />
      <MaxWidthContainer width="md">
        <Form
          name="disclosure"
          onSubmit={onSubmit}
          segmentPayload={{
            name: question.text,
            product_type: productType,
          }}
        >
          <QuestionComponent
            data={question}
            userType={userTypeProp}
            onChange={(...args) => dispatch(makeAnswerCurrentQuestion(userTypeProp)(...args))}
            onSearch={(search) => dispatch(getAuraDisclosureSearch(userTypeProp, search))}
            onUnknown={() => dispatch(handleUnknownDisclosure())}
            value={value}
            key={`${userTypeProp}-${question.id}`}
          />
          <Spacer size="spaceSmall" />
          <Button variant="primary" type="submit" name="Next Button" dataCy="submit" loading={prom} ref={buttonRef} hidden={isMobile()}>
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="global.next.Q0fXUP" />}
            />
          </Button>
        </Form>
      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation
      buttonRef={buttonRef}
      position="sticky"
      isLoading={prom}
    />
  </>;
};

export default Disclosure;
