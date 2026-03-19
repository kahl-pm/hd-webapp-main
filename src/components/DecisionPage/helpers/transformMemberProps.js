import { FormattedMessage } from 'react-intl';
import React from 'react';
import { USER_TYPES } from '../../../utils/const';

const userPositionFamilyMembers = (familyMembers) => {
  return familyMembers.map((famMam, idx) => {
    return {
      ...famMam,
      userPosition: idx,
    };
  });
};

export const transformMemberProps = (props) => {
  const primary = (props.primary && props.primary.first_name) ? {
    firstName: props.primary.first_name,
    lastName: props.primary.last_name,
    role: <FormattedMessage id="hdDecision.primaryApplicant.7lvl6n" />,
    userType: USER_TYPES.PRIMARY,
  } : null;

  const secondary = (props.secondary && props.secondary.first_name) ? {
    firstName: props.secondary.first_name,
    lastName: props.secondary.last_name,
    role: <FormattedMessage id="hdDecision.secondaryApplicant.QgTxAT" />,
    userType: USER_TYPES.SECONDARY,
  } : null;

  const deps = (props.dependent_keys && props.dependent_keys.length > 0) ?
    props.dependent_keys.map((key, index) => {
      const dep = props.dependents[key];
      return {
        firstName: dep.household.firstName,
        lastName: dep.household.lastName,
        role: <FormattedMessage id="hdDecision.dependentApplicant.LCx3Vi" />,
        userType: USER_TYPES.DEPENDENT,
      };
    }) : [];

  const familyMembers = [
    primary,
    secondary,
    ...deps,
  ].filter(Boolean);

  const doesPrimaryFamMemberExist = familyMembers
      && familyMembers.length > 0
      && familyMembers[0]?.userType === USER_TYPES.PRIMARY;

  return doesPrimaryFamMemberExist ? userPositionFamilyMembers(familyMembers) : [];
};
