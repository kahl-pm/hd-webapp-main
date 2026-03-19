import { updateHouseholdPropAll } from './household';
import { JOINT_ROLES, USER_TYPES } from '../utils/const';
import { saveJointQuoteToggleCookie } from './cookies';
import { updateSessionPropAllProducts } from './helpers/productSession';
import { sendSegmentIdentifyEvent } from './analytics';

export const initUserControl = (currentUser, hasPartnerApplication) => {
  return {
    type: `@@user_control/init`,
    currentUser,
    hasPartnerApplication,
  };
};

export const updateUserControlProp = (property, value) => {
  return {
    type: `@@user_control/update_property`,
    property,
    value,
  };
};

export const updateGroupName = (value) => {
  return {
    type: `@@user_control/update_group_name`,
    value,
  };
};

export const updateHasPartnerApplication = (hasPartnerApplication) => (dispatch, getState) => {
  dispatch(updateUserControlProp('hasPartnerApplication', hasPartnerApplication));
  const jointRolePrimary = hasPartnerApplication ? JOINT_ROLES.PRIMARY : JOINT_ROLES.NONE;
  const jointRoleSecondary = hasPartnerApplication ? JOINT_ROLES.SECONDARY : JOINT_ROLES.NONE;
  dispatch(updateSessionPropAllProducts('joint_role', jointRolePrimary, USER_TYPES.PRIMARY));
  dispatch(updateSessionPropAllProducts('joint_role', jointRoleSecondary, USER_TYPES.SECONDARY));
  // used to populate spouse information on household records
  dispatch(updateHouseholdPropAll('hasPartner', hasPartnerApplication));
  dispatch(saveJointQuoteToggleCookie(hasPartnerApplication));
  // Life/CI joint discounts removed — HD-only webapp
  dispatch(sendSegmentIdentifyEvent());
};
