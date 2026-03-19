import React, { useEffect, useRef, useState } from 'react';
import { Form, MaxWidthContainer, PageContainer, Spacer, Typography, Button, Checkbox, isMobile, Alert } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LOCALE, segmentTrackEvent } from '@policyme/global-libjs-utils';
import { Customisable } from '../../components/Customisation';
import queryString from 'query-string';
import { AUTH0_RESPONSE_ERROR, FAMILY_COMPOSITION_VALUES_INDEX, LAST_DEPENDENT_INDEX, MAX_FAMILY_MEMBERS_ALLOWED, PM_PRODUCT_PREFIX, USER_TYPES } from '../../utils/const';
import { isCAAEnvironment } from '../../tenant/helpers';

import { State } from '../../store/types/State';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';
import { addDependent, removeDependent, updateDependentHousehold } from '../../NewActions/dependents';
import { isJoint as isJointSelector } from '../../Selectors/userControl';
import { initFbPixel } from '../../utils/facebookHelpers';
import { handleSelectFamilyComposition, submitQuotesCompareSubmission, handleRemovePartnerHousehold } from '../../NewActions/handle';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { nextQuestion } from '../../NewActions/session';
import QuotesInputCard, { AddPartnerActionButton, AddDependentActionButton } from '../../components/QuotesInputCard';
import ProvinceMismatchBlockerModal from '../../components/ProvinceMismatchBlockerModal';
import BottomNavigation from '../../components/BottomNavigation';
import { QuotesInputProps } from './QuotesCompare';
import { getSamplePolicyContract } from '../../Selectors/household';
import { sendSegmentIdentifyEvent } from '../../NewActions/analytics';

const QuotesInputHd = (props: QuotesInputProps) => {
  const { openProvinceMismatchBlockerModal, provinceMismatchCheckEnabled } = props;

  const search = useSelector((state: State) => state.router.location.search);
  const auth0Resp = useSelector((state: State) => state.metadata.auth0Resp);
  const params = queryString.parse(search);
  const [hasReachedMaxMembers, setHasReachedMaxMembers] = useState(false);
  const [hasExceededMaxMembers, setHasExceededMaxMembers] = useState(false);
  const [residentsCheckboxVal, setResidentsCheckboxVal] = useState(false);
  // const [documentsCheckboxVal, setDocumentsCheckboxVal] = useState(false);
  const [hasIssue, setHasIssue] = useState(false); // for red outlining the last dependent card
  const user = useSelector((state: State) => ({
    healthcard_province: state.primary.household.healthcard_province,
    province: state.primary.household.province,
    birthdate: state.primary.household.birthdate,
    userGender: state.primary.household.userGender,
    smoke: state.primary.household.smoke,
    hasPartner: state.primary.household.hasPartner,
    application_language: state.primary.household.application_language,
  }));
  const partner = useSelector((state: State) => ({
    healthcard_province: state.secondary.household.healthcard_province,
    province: state.secondary.household.province,
    firstName: state.secondary.household.firstName,
    lastName: state.secondary.household.lastName,
    birthdate: state.secondary.household.birthdate,
    userGender: state.secondary.household.userGender,
    smoke: state.secondary.household.smoke,
  }));
  const dependents = useSelector((state: State) => state.dependents.dependents);
  const dependentKeys = useSelector((state: State) => state.dependents.dependent_keys);
  const mainProduct = useSelector(state => getMainProduct(state, USER_TYPES.PRIMARY));
  const isJoint = useSelector(isJointSelector);
  const [healthCardProvince, setHealthCardProvince] = useState(user.healthcard_province);
  const dispatch = useDispatch();

  useEffect(() => {
    // need to set the province and language of the deps to be the same as primary
    if (dependentKeys) {
      dependentKeys.forEach((depKey) => {
        dispatch(updateDependentHousehold(depKey, 'healthcard_province', healthCardProvince));
        dispatch(updateDependentHousehold(depKey, 'application_language', user.application_language));
      });
    }
  }, [dependentKeys, healthCardProvince]);

  useEffect(() => {
    let currentMembers = (dependentKeys?.length ?? 0) + 1; // +1 for primary
    if (isJoint) {
      currentMembers += 1;
    }
    setHasReachedMaxMembers(currentMembers >= MAX_FAMILY_MEMBERS_ALLOWED);
    setHasExceededMaxMembers(currentMembers > MAX_FAMILY_MEMBERS_ALLOWED);
  }, [dependentKeys, isJoint]);

  useEffect(() => {
    // props.onComponentLoad();
    return () => {
      dispatch(initFbPixel());
    };
  }, []);

  const updateFamilyComp = () => {
    let hasDeps = true;
    if (dependentKeys.length === 0) {
      hasDeps = false;
    }

    // update family comp based on whether there is a partner or kids
    if (hasDeps && isJoint) {
      dispatch(handleSelectFamilyComposition(
        FAMILY_COMPOSITION_VALUES_INDEX.MYSELF_PARTNER_KIDS,
      ));
    } else if (hasDeps) {
      dispatch(handleSelectFamilyComposition(
        FAMILY_COMPOSITION_VALUES_INDEX.MYSELF_KIDS,
      ));
    } else if (isJoint) {
      dispatch(handleSelectFamilyComposition(
        FAMILY_COMPOSITION_VALUES_INDEX.MYSELF_PARTNER,
      ));
    } else {
      dispatch(handleSelectFamilyComposition(
        FAMILY_COMPOSITION_VALUES_INDEX.MYSELF,
      ));
    }
  };

  const onSubmit = () => {
    if (provinceMismatchCheckEnabled &&
      isJoint &&
      user.healthcard_province !== partner.healthcard_province) {
      openProvinceMismatchBlockerModal();
      return;
    }

    if (hasExceededMaxMembers) {
      setHasIssue(true);
      return;
    }
    setHasIssue(false);
    updateFamilyComp();
    dispatch(sendSegmentIdentifyEvent());
    // All CAA tenants will fetch quotes after the CAA member page
    if (!isCAAEnvironment()) {
      dispatch(submitQuotesCompareSubmission());
    } else {
      dispatch(nextQuestion());
    }
  };

  function getErrorMessage() {
    if ([params?.res, auth0Resp].some(val => val === AUTH0_RESPONSE_ERROR.EMAIL_NOT_FOUND || val === AUTH0_RESPONSE_ERROR.APPLE_RELAY_EMAIL)) {
      return <FormattedMessage id="error.unableToLogin.0a32d1" />;
    }
    return null;
  }
  const errorMessage = getErrorMessage();

  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer fullHeight>
        {errorMessage ? <><Alert type='high' text={errorMessage} /><Spacer size="spaceMedium" /></> : null }
        <Typography
          variant="h1"
          align="center"
          message={<FormattedMessage id="quotesCompareInputs.whoWouldYoulikeCoverageFor.hIbIDt" />}
        />
        <Spacer size="spaceXL" />
        <Typography
          variant="body2"
          align="center"
          message={<FormattedMessage
            id="quotesCompareInputs.weRecommendCoverageFor.AsOIVx"
            values={{ b: chunks => <strong>{chunks}</strong> }}
          />}
        />
        <Spacer size="spaceMedium" />
        <MaxWidthContainer
          width="md"
        >
          <Form
            name="quotes_inputs_form"
            onSubmit={onSubmit}
            segmentPayload={{
              name: (
                <FormattedMessage id="quotesCompareInputs.whoWouldYoulikeCoverageFor.hIbIDt" />
              ),
              product_type: mainProduct,
            }}
          >
            <QuotesInputCard
              header={<FormattedMessage id="quotesCompareInputs.yourDetails.FVp6Po" />}
              product={mainProduct}
              deleteEnabled={false}
              updateHouseholdProp={(property, value) => {
                dispatch(updateHouseholdPropPrimary(property, value));
                if (property === 'healthcard_province') {
                  setHealthCardProvince(value);
                }
              }}
              user={user}
              name={USER_TYPES.PRIMARY}
              active
            />
            <Spacer size="spaceMedium" />
            {isJoint && (
              <>
                <QuotesInputCard
                  header={<FormattedMessage id="quotesCompareInputs.yourPartnersDetails.Rahugl" />}
                  product={mainProduct}
                  updateHouseholdProp={(property, value) => {
                    dispatch(updateHouseholdPropSecondary(property, value));
                  }}
                  user={partner}
                  name={USER_TYPES.SECONDARY}
                  active
                  onCardDelete={() => {
                    dispatch(handleSelectFamilyComposition(
                      FAMILY_COMPOSITION_VALUES_INDEX.MYSELF,
                    ));
                    dispatch(handleRemovePartnerHousehold(mainProduct));
                  }}
                />
                <Spacer size="spaceMedium" />
              </>
            )}
            {
              dependentKeys.map((depKey, index) => {
                return (
                  <>
                    <QuotesInputCard
                      key={depKey}
                      header={<FormattedMessage
                        id="quotesCompareInputs.dependentIndex.2ZbVsp"
                        values={{ dependentIndex: (index + 1) }}
                      />}
                      product={mainProduct}
                      updateHouseholdProp={(property, value) => {
                        dispatch(updateDependentHousehold(depKey, property, value));
                      }}
                      user={dependents[depKey].household}
                      name={`${depKey}-card`}
                      active
                      onCardDelete={() => {
                        dispatch(removeDependent(depKey));
                      }}
                      hasIssue={index === LAST_DEPENDENT_INDEX && hasIssue}
                      isDependent
                    />
                    <Spacer size="spaceMedium" />
                  </>
                );
              })
            }
            {hasIssue && (
              <Typography
                variant="body3"
                align="center"
                message={<FormattedMessage id="quotesCompareInputs.maxDependentsExceeded.T6wx2q" />}
                error
              />
            )}
            <AddPartnerActionButton
              mainProduct={mainProduct}
              hasReachedMaxMembers={hasReachedMaxMembers}
              isJoint={isJoint}
              dataCy="add-secondary-button"
              onClick={() => {
                dispatch(
                  handleSelectFamilyComposition(
                    FAMILY_COMPOSITION_VALUES_INDEX.MYSELF_PARTNER,
                  ),
                );
              }}
            />
            <AddDependentActionButton
              hasReachedMaxMembers={hasReachedMaxMembers}
              onClick={() => {
                dispatch(addDependent());
              }}
            />
            <Checkbox
              name={'residents_confirmation'}
              containerVariant="card"
              label={
                <Typography
                  variant="body2"
                  align="left"
                  message={<FormattedMessage id="quotesCompareInputs.authorizeCitizenship.tjDj79" />}
                />
              }
              checked={residentsCheckboxVal}
              onChange={(val) => { setResidentsCheckboxVal(val.target.checked); }}
              required
              errorMessage={<FormattedMessage
                id="authorization.authorizeMIBRequiredMessage.VmIRci"
              />}
              dataCy="checkbox-quotes-input"
            />
            <Spacer size="spaceMedium" />
            {/* <Checkbox
              name={'providedDocumentConfirmation'}
              containerVariant="card"
              label={
                <Typography
                  variant="body2"
                  align="left"
                  message={<FormattedMessage
                    id="quotesCompareInputs.providedDocumentConfirmation.suU982"
                    values={{
                      a: chunks => <Link
                        label={chunks}
                        href={getSamplePolicyContract(mainProduct, LOCALE.FR_CA)}
                        target="_blank"
                        rel="noopener noreferrer"
                      />,
                    }}
                  />}
                />
              }
              checked={documentsCheckboxVal}
              onChange={(val) => { setDocumentsCheckboxVal(val.target.checked); }}
              required
              errorMessage={<FormattedMessage
                id="authorization.authorizeMIBRequiredMessage.VmIRci"
              />}
              dataCy="checkbox-quotes-provided-docs"
            /> */}
            {/* <Spacer size="spaceMedium" /> */}
            <Button
              type="submit"
              variant="primary"
              name="Next Button"
              dataCy="submit"
              ref={buttonRef}
              hidden={isMobile()}
            >
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

export default QuotesInputHd;
