import React, { useContext } from 'react';
import { Typography } from '@policyme/global-libjs-designsystem';
import { NEW_PROD_MULTI_LIFE_BODY, PRIMARY_LIFE_BODY, NEW_PROD_MULTI_LIFE_BODY_EMPLOYEE_DISCOUNT } from '../../utils/const';
import { useUserDetailsContext } from './UserDetailsContext';

const UserDetailsHeader = ({ isPolicymeEmployee, mainProduct }) => {
  const {
    isUpdatingPartner,
  } = useUserDetailsContext();

  const headerText = isPolicymeEmployee
    ? NEW_PROD_MULTI_LIFE_BODY_EMPLOYEE_DISCOUNT
    : NEW_PROD_MULTI_LIFE_BODY;
  return (
    <Typography
      data-cy="userDetailsHeader"
      variant="body2"
      message={isUpdatingPartner ? headerText : PRIMARY_LIFE_BODY}
    />
  );
};

export default UserDetailsHeader;
