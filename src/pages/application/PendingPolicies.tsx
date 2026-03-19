import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Typography, Button, RadioGroup, Form, PageContainer, MaxWidthContainer, Spacer, isMobile } from '@policyme/global-libjs-designsystem';
import PolicyCard from '../../components/PolicyCard';

import { handlePendingPoliciesFlag, handlePendingPoliciesKeepingFlag } from '../../NewActions/handle';
import { nextQuestion, onComponentLoad } from '../../NewActions/session';

import {
  SESSION_STORAGE_LOGGING,
} from '../../utils/const';
import { hasValue, updateMultipleSessionStorageKeys } from '../../utils/helpers';
import { State } from '../../store/types/State';
import BottomNavigation from '../../components/BottomNavigation';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" />, next: true },
];
const PendingPolicies = () => {
  const dispatch = useDispatch();
  const hasPendingPolicies =
    useSelector((state: State) => state.metadata.existingPolicies?.hasPendingPolicies);
  const isKeepingPendingFlag =
    useSelector((state: State) => state.metadata.existingPolicies?.existingPoliciesPendingKeepingFlag);
  const hasPartnerApplication =
    useSelector((state: State) => state.userControl.hasPartnerApplication);

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  // The following question is hardcoded in our policy document
  // If you need to change this copy you also need to change the policy document to match
  const POLICY_DOCUMENT_QUESTION_REPLACING_POLICIES_DO_NOT_CHANGE =
    <FormattedMessage
      id="policyDocumentQuestion.havePendingPolicies.AI15XH"
      values={{
        hasPartnerApplication,
        isLifeMainProduct: false,
      }}
    />;

  // The following question is hardcoded in our policy document
  // If you need to change this copy you also need to change the policy document to match
  const POLICY_DOCUMENT_QUESTION_KEEPING_DO_NOT_CHANGE = <FormattedMessage
    id="policyDocumentQuestion.keepPendingPolicies.Wx3bDW"
    values={{
      hasPartnerApplication,
    }}
  />;
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer fullHeight>
      <Typography
        variant="h1"
        message={POLICY_DOCUMENT_QUESTION_REPLACING_POLICIES_DO_NOT_CHANGE}
      />
      <Spacer size="spaceXL" />
      <MaxWidthContainer width="md">
        <Form
          onSubmit={() => {
            dispatch(nextQuestion());
          }}
          name="Pending Policies"
          segmentPayload={{
            name: POLICY_DOCUMENT_QUESTION_REPLACING_POLICIES_DO_NOT_CHANGE,
            product_type: 'hd',
          }}
        >
          <RadioGroup
            labelledBy=""
            variant="outlined"
            options={YES_NO_Y_N}
            value={hasValue(hasPendingPolicies) ? hasPendingPolicies ? 'Y' : 'N' : ''}
            onChange={(e, value) => {
              const isPendingPolicy = value === 'Y';
              dispatch(handlePendingPoliciesFlag(isPendingPolicy));
              // log to session storage
              updateMultipleSessionStorageKeys({
                [SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS]: [
                  { path: [SESSION_STORAGE_LOGGING.IS_PENDING_POLICIES], value: isPendingPolicy },
                  { path: [SESSION_STORAGE_LOGGING.CHANGE_HISTORY], value: `Clicked ${isPendingPolicy ? 'yes' : 'no'} to pending policies`, append: true },
                ],
              });
            }}
            name="pending_policies"
            required
            orientation="horizontal"
            data-cy="pendingPolicies"
          />
          {hasPendingPolicies &&
          <>
            <Spacer size="spaceMedium" />
            <Typography
              variant="h2"
              message={POLICY_DOCUMENT_QUESTION_KEEPING_DO_NOT_CHANGE}
            />
            <Spacer size="spaceMedium" />
            <RadioGroup
              labelledBy=""
              options={YES_NO_Y_N}
              variant="outlined"
              value={hasValue(isKeepingPendingFlag) ? isKeepingPendingFlag ? 'Y' : 'N' : ''}
              onChange={(e, value) => {
                const isReplacingPendingPolicy = value === 'Y';
                dispatch(handlePendingPoliciesKeepingFlag(isReplacingPendingPolicy));
                // log to session storage
                updateMultipleSessionStorageKeys({
                  [SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS]: [
                    { path: [SESSION_STORAGE_LOGGING.IS_REPLACING_PENDING_POLICIES],
                      value: isReplacingPendingPolicy },
                    { path: [SESSION_STORAGE_LOGGING.CHANGE_HISTORY], value: `Clicked ${isReplacingPendingPolicy ? 'yes' : 'no'} to replacing pending policies`, append: true },
                  ],
                });
              }}
              name="keep_pending_policies"
              required
              orientation="horizontal"
              data-cy="keepPendingPolicies"
            />
            {isKeepingPendingFlag && (
              <>
                <Spacer size="spaceMedium" />
                <Typography
                  variant="h2"
                  message={<FormattedMessage
                    id="pendingPolicies.provideMoreDetails.a4iHSX"
                  />}
                />
                <Spacer size="spaceMedium" />
                <PolicyCard pending />
              </>
            )}
          </>}
          <Spacer size="spaceSmall" />
          <Button type="submit" name="submit" className="btn-primary" dataCy="pending-policies-submit" hidden={isMobile()} ref={buttonRef}>
            <Typography
              variant="CTALargePrimary"
              message={
                <FormattedMessage id="global.next.Q0fXUP" />
              }
            />
          </Button>
          {/* <SecureFooter noRelative /> */}
        </Form>
      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>;
};

export default PendingPolicies;
