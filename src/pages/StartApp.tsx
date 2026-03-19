import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Customisable } from '../components/Customisation';
import { initFbPixel } from '../utils/facebookHelpers';
import { onComponentLoad } from '../NewActions/session';
import { isACHCSSAffiliate, isJoint, isLoggedInUser } from '../Selectors/userControl';
import StartAppHD from '../components/MigratedComponents/StartAppHD';
import { INSURANCE_OWNERSHIP_TYPES, JOINT_ROLES, PM_PRODUCT_PREFIX, USER_TYPES } from '../utils/const';
import { getAppInsuranceOwnershipType, getAppUnderwritingMethod, getMainProduct } from '../Selectors/helpers/productApp';
import { authGetUserInfo } from '../NewActions/auth';
import type { State } from '../store/types/State';
import { StartAppProps, ValidateStartAppUrlProps } from './types/StartApp.types';
import { getPreAppMainProduct } from '../Selectors/metadata';
import EmailCheckModal from '../components/EmailCheckModal';
import { changeSuggestedEmailAndNext } from '../NewActions/household';
import { getHealthcardProvince } from '../Selectors/household';
import { goToDogHomePage } from '../utils/helpers';

export const ValidateStartAppUrlComponent = (props: ValidateStartAppUrlProps) => {
  // INFO: This component is used to validate the state of the startapp component
  const { insurance_ownership_type, mainProduct, redirectToPage } = props;
  useEffect(() => {
    if (mainProduct === PM_PRODUCT_PREFIX.HD) {
      // Group insurance is not allowed unless enabled for a tenant
      if (insurance_ownership_type === INSURANCE_OWNERSHIP_TYPES.GROUP) {
        redirectToPage();
      }
    }
  }, []);
  return null;
};

export const CustomisableValidateStartAppUrl = Customisable(ValidateStartAppUrlComponent);

// No-op stub: Life/CI start app removed for HD-only webapp
export const NonHDStartApp = (_props: StartAppProps) => {
  return null;
};

const StartApp = () => {
  const _state = useSelector<State, State>((state) => state);
  const userType = _state.userControl.currentUser;
  const { hd_application_id } = _state[userType].session;
  const hasAppId = !!hd_application_id;
  const mainProduct = getMainProduct(_state, USER_TYPES.PRIMARY);

  const province = getHealthcardProvince(USER_TYPES.PRIMARY)(_state);
  const insurance_ownership_type =
    getAppInsuranceOwnershipType(_state, USER_TYPES.PRIMARY, mainProduct);

  const props: StartAppProps = {
    ...(_state.primary.session || {}),
    email: _state.primary.household.email,
    firstName: _state.primary.household.firstName,
    lastName: _state.primary.household.lastName,
    firstNameDisabled: false,
    lastNameDisabled: false,
    emailDisabled: _state.metadata.isShadowAccountStartApp
      || false // joint_role check removed (Life-specific)
      || isLoggedInUser(_state)
      || (_state.metadata.fromStartApp && hasAppId)
      || (_state.metadata.completedStartApp)
      || (!!_state.primary.household.email && _state.primary.household.isValidEmail),
    partnerFirstName: _state.secondary.household.firstName,
    partnerLastName: _state.secondary.household.lastName,
    suggestedEmail: _state.metadata.suggestedEmail,
    isJoint: isJoint(_state),
    fromStartApp: _state.metadata.fromStartApp,
    disableStartAppInput: _state.metadata.isShadowAccountStartApp,
    dependent_keys: _state.dependents.dependent_keys,
    dependents: _state.dependents.dependents,
    underwriting_method: getAppUnderwritingMethod(_state,
      USER_TYPES.PRIMARY, getPreAppMainProduct(_state)),
    mainProduct,
    loggedInUser: isLoggedInUser(_state),
    isACHCSSAffiliate: isACHCSSAffiliate(_state),
    groupName: _state.userControl.affiliate.group_name,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onComponentLoad(() => {
      // HD-only: no Life/CI group insurance checks needed
    }));

    async function checkAuthNeeded() {
      if (props.loggedInUser) {
        // INFO: since we skip verification flow, we need to hydrate user info data
        // Usually done by magic link verification callback
        await dispatch(authGetUserInfo());
      }
    }

    return () => {
      sendAnalytics();
      checkAuthNeeded();
    };
  }, []);

  const sendAnalytics = () => {
    // need to do this here in case we have postponed initialization
    // for advancedMatching criteria, and this page is the first one
    // where we collect the last name
    dispatch(initFbPixel());
  };

  return (
    <>
      <CustomisableValidateStartAppUrl
        province={province}
        insurance_ownership_type={insurance_ownership_type}
        mainProduct={mainProduct}
        redirectToPage={goToDogHomePage}
      />
      <EmailCheckModal
        onSelect={
          (emailWasAccepted, callbackUserType) => {
            dispatch(changeSuggestedEmailAndNext(emailWasAccepted, callbackUserType));
          }
        }
        userType={USER_TYPES.PRIMARY}
      />
      <StartAppHD {...props} />
    </>
  );
};

export default StartApp;
