import { connect } from 'react-redux';
import React, { useState, createContext, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { calcAge } from '@policyme/global-libjs-utils';
import PropTypes from 'prop-types';
import { makeUpdateHouseholdProp } from '../../NewActions/household';
import { updateMetadata } from '../../NewActions/metadata';
import { MODAL_FIELDS, USER_TYPES } from '../../utils/const';
import { shouldEnablePermForPermMilestonV2AgeRequirement } from '../../utils/helpers';

/**
 * @type {React.Context<Partial<{
 *   values: Record<MODAL_FIELDS, any>,
 *   setValues: React.Dispatch,
 *   persistedValues: Record<string, any>,
 *   updateUserType: USER_TYPES,
 *   currentUserType: USER_TYPES,
 *   isUpdatingPartner: boolean,
 *   hasPartnerApplication: boolean,
 *   persistValues: Function,
 *   setFieldValue: Function
 * }>>}
 */
export interface UserDetailsContextType {
  values: string;
  setValues: Dispatch<SetStateAction<string>>;
  persistedValues: string;
  updateUserType: 'primary' | 'secondary';
  currentUserType: 'primary' | 'secondary';
  isUpdatingPartner: boolean;
  hasPartnerApplication: boolean;
  persistValues: () => void;
  setFieldValue: (field: string, value: string | boolean | number) => void;
}
const UserDetailsContext = createContext<UserDetailsContextType>({
  values: '',
  setValues: () => {},
  persistedValues: '',
  updateUserType: 'primary',
  currentUserType: 'primary',
  isUpdatingPartner: false,
  hasPartnerApplication: false,
  persistValues: () => {},
  setFieldValue: () => {},
});

const _UserDetailsProvider = (props) => {
  const {
    persistedValues,
    updateUserType,
    currentUserType,
    hasPartnerApplication,
    updateHouseholdProp,
    children,
  } = props;
  const [values, setValues] = useState(persistedValues);
  const isUpdatingPartner = updateUserType !== currentUserType;
  const setFieldValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };
  /**
   * Persist all modal values into redux store for the user of type `userType`.
   */
  const persistValues = () => {
    updateHouseholdProp(
      updateUserType,
      'userGender',
      values[MODAL_FIELDS.USER_GENDER],
    );
    updateHouseholdProp(updateUserType, 'smoke', values[MODAL_FIELDS.SMOKE]);
    updateHouseholdProp(
      updateUserType,
      'birthdate',
      values[MODAL_FIELDS.BIRTHDATE],
    );
    updateHouseholdProp(
      updateUserType,
      'province',
      values[MODAL_FIELDS.PROVINCE],
    );

    // Perm Life v2 requirement: If either primary or secondary is over 60, show perm life
    // https://policyme.atlassian.net/browse/PART-407
    const primaryAge = isUpdatingPartner
      ? calcAge(props.primaryBirthday)
      : calcAge(values[MODAL_FIELDS.BIRTHDATE]);
    const secondaryAge = isUpdatingPartner
      ? calcAge(values[MODAL_FIELDS.BIRTHDATE])
      : props.secondaryBirthday && calcAge(props.secondaryBirthday);

    // Use effective partner application: Redux may not have updated yet when
    // persistValues runs right after dispatching updateHasPartnerApplication(true).
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- need OR: when hasPartnerApplication is false and isUpdatingPartner is true we want true
    const hasEffectivePartnerApplication = hasPartnerApplication || isUpdatingPartner;
    if (
      shouldEnablePermForPermMilestonV2AgeRequirement(
        primaryAge, secondaryAge, hasEffectivePartnerApplication,
      )
    ) {
      props.updateIsPermLifeMetadata(true);
    }
  };

  return (
    <UserDetailsContext.Provider
      value={{
        values,
        setValues,
        persistedValues,
        updateUserType,
        currentUserType,
        isUpdatingPartner,
        hasPartnerApplication,
        persistValues,
        setFieldValue,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

const mapStateToPropsProvider = (state, props) => {
  /** @type {USER_TYPES} */
  const userType = props.updateUserType;
  return {
    currentUserType: state.userControl.currentUser,
    hasPartnerApplication: state.userControl.hasPartnerApplication,
    primaryBirthday: state.primary.household.birthdate,
    secondaryBirthday: state.secondary.household.birthdate,
    persistedValues: {
      [MODAL_FIELDS.USER_GENDER]: state[userType].household.userGender,
      [MODAL_FIELDS.SMOKE]: state[userType].household.smoke,
      [MODAL_FIELDS.BIRTHDATE]: state[userType].household.birthdate,
      [MODAL_FIELDS.PROVINCE]: state[userType].household.province,
    },
  };
};

const mapDispatchToPropsProvider = (dispatch) => ({
  updateHouseholdProp: (userType, field, value) => {
    dispatch(makeUpdateHouseholdProp(userType)(field, value));
  },
  updateIsPermLifeMetadata: (value) => dispatch(updateMetadata('isPermLifeEnabled', value)),
});

/**
 * Provides necessary values for the joint quotes modal.
 */
export const UserDetailsProvider = connect(
  mapStateToPropsProvider,
  mapDispatchToPropsProvider,
)(_UserDetailsProvider);

export const UserDetailsConsumer = UserDetailsContext.Consumer;

export const useUserDetailsContext = (): UserDetailsContextType => {
  const contextValue = useContext(UserDetailsContext);
  if (!contextValue) {
    throw new Error('UserDetailsModal must be wrapped inside UserDetailsProvider. ' +
        'If you imported this component, please import from "components/UserDetailsModal". ' +
        'Please do NOT import from "components/UserDetailsModal/UserDetailsModal".');
  }
  return contextValue;
};
