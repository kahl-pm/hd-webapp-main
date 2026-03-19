import React from 'react';
import { Spacer, Tabs } from '@policyme/global-libjs-designsystem';
import { useSelector, useDispatch } from 'react-redux';

import { USER_TYPES, UserType } from '../../utils/const';
import { updateUserControlProp } from '../../NewActions/userControl';

type UserOptionToggleProps = {
  userType?: UserType;
  primaryChildren: React.ReactNode;
  secondaryChildren: React.ReactNode;
};

const UserOptionToggle = (props: UserOptionToggleProps) => {
  const { userType, primaryChildren, secondaryChildren } = props;
  const dispatch = useDispatch();

  const firstName = useSelector((state) => state[USER_TYPES.PRIMARY].household.firstName);
  const partnerFirstName = useSelector((state) => state[USER_TYPES.SECONDARY].household.firstName);

  const tabItems = [{
    id: 'primary',
    label: firstName,
    value: 'primary',
    dataCy: 'primaryNextSteps',
    children: <div><Spacer size="spaceMedium" />{primaryChildren}</div>,
  }, {
    id: 'secondary',
    label: partnerFirstName,
    value: 'secondary',
    dataCy: 'secondaryNextSteps',
    children: <div><Spacer size="spaceMedium" />{secondaryChildren}</div>,
  }];

  const handleTabChange = (newSelectedTab) => {
    dispatch(updateUserControlProp('dashboardUser', newSelectedTab === 'primary' ? USER_TYPES.PRIMARY : USER_TYPES.SECONDARY));
  };

  return (
    <Tabs
      variant="default"
      tabItems={tabItems}
      ariaLabel="users-toggle"
      name="users"
      onTabChange={handleTabChange}
      defaultValue={userType}
    />
  );
};

export default UserOptionToggle;
