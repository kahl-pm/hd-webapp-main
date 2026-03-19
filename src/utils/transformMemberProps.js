import { FormattedMessage } from 'react-intl';
import React from 'react';
import { HD_EXCLUSIONS_MESSAGES } from '@policyme/global-libjs-utils';
import { USER_TYPES } from './const';

const userPositionFamilyMembers = (familyMembers) => {
  return familyMembers.map((famMam, idx) => {
    return {
      ...famMam,
      userPosition: idx,
    };
  });
};

export const formatExclusions = (intl, exclusions) => {
  return exclusions?.map(exclusion => intl.formatMessage(HD_EXCLUSIONS_MESSAGES[exclusion.code]));
};

const generateFamilyMembers = (primary, secondary, deps) => {
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

export const transformMemberPropsForDecision = (props) => {
  const {
    primary: primaryExclusions,
    secondary: secondaryExclusions,
    dependents: dependentsExclusions,
  } = props?.family?.family_exclusions ?? {};
  const primaryExclusionsLen = primaryExclusions?.length;
  const primary = (props.primary && props.primary.first_name) ? {
    firstName: props.primary.first_name,
    lastName: props.primary.last_name,
    name: `${props.primary.first_name} ${props.primary.last_name}`,
    role: primaryExclusionsLen ?
      <FormattedMessage
        id={`hdDecision.readMoreAboutExclusions.static.39AvPy`}
      /> :
      <FormattedMessage id="hdDecision.primaryApplicant.7lvl6n" />,
    userType: USER_TYPES.PRIMARY,
    hasExclusions: primaryExclusionsLen > 0,
    exclusions: formatExclusions(props.intl, primaryExclusions),
  } : null;

  const secondaryExclusionsLen = secondaryExclusions?.length;
  const secondary = (props.secondary && props.secondary.first_name) ? {
    firstName: props.secondary.first_name,
    lastName: props.secondary.last_name,
    name: `${props.secondary.first_name} ${props.secondary.last_name}`,
    role: secondaryExclusionsLen ?
      <FormattedMessage
        id="hdDecision.readMoreAboutExclusions.static.39AvPy"
      /> :
      <FormattedMessage id="hdDecision.secondaryApplicant.QgTxAT" />,
    userType: USER_TYPES.SECONDARY,
    hasExclusions: secondaryExclusionsLen > 0,
    exclusions: formatExclusions(props.intl, secondaryExclusions),
  } : null;

  const deps = (props.dependent_keys && props.dependent_keys.length > 0) ?
    props.dependent_keys.map((key, index) => {
      const dep = props.dependents[key];
      const dependentsExclusionsLen = dependentsExclusions[key]?.length ?? 0;
      return {
        firstName: dep.household.firstName,
        lastName: dep.household.lastName,
        dependentKey: key,
        name: `${dep.household.firstName} ${dep.household.lastName}`,
        role: dependentsExclusionsLen ?
          <FormattedMessage
            id="hdDecision.readMoreAboutExclusions.static.39AvPy"
          /> : <FormattedMessage id="hdDecision.dependentApplicant.LCx3Vi" />,
        userType: USER_TYPES.DEPENDENT,
        hasExclusions: dependentsExclusionsLen > 0,
        exclusions: formatExclusions(props.intl, dependentsExclusions[key]),
      };
    }) : [];

  return generateFamilyMembers(primary, secondary, deps);
};

export const transformMemberPropsForDisclosure = (props) => {
  const primary = (props.primary && props.primary.first_name) ? {
    firstName: props.primary.first_name,
    lastName: props.primary.last_name,
    name: `${props.primary.first_name} ${props.primary.last_name}`,
    role: <FormattedMessage id="hdDecision.primaryApplicant.7lvl6n" />,
    userType: USER_TYPES.PRIMARY,
  } : null;

  const secondary = (props.secondary && props.secondary.first_name) ? {
    firstName: props.secondary.first_name,
    lastName: props.secondary.last_name,
    name: `${props.secondary.first_name} ${props.secondary.last_name}`,
    role: <FormattedMessage id="hdDecision.secondaryApplicant.QgTxAT" />,
    userType: USER_TYPES.SECONDARY,
  } : null;

  const deps = (props.dependent_keys && props.dependent_keys.length > 0) ?
    props.dependent_keys.map((key, index) => {
      const dep = props.dependents[key];
      return {
        firstName: dep.household.firstName,
        lastName: dep.household.lastName,
        dependentKey: key,
        name: `${dep.household.firstName} ${dep.household.lastName}`,
        role: <FormattedMessage id="hdDecision.dependentApplicant.LCx3Vi" />,
        userType: USER_TYPES.DEPENDENT,
      };
    }) : [];

  return generateFamilyMembers(primary, secondary, deps);
};
