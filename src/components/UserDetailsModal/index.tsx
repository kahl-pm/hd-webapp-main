import React from 'react';
import { UserDetailsProvider } from './UserDetailsContext';
import UserDetailsModal from './UserDetailsModal';

const UserDetailsModalWrapper = (props) => {
  const { updateUserType, ...otherProps } = props;
  return (
    <UserDetailsProvider updateUserType={updateUserType}>
      <UserDetailsModal {...otherProps} />
    </UserDetailsProvider>
  );
};

UserDetailsModalWrapper.defaultProps = {
  isOpen: false,
  setOpen: () => {},
};

export default UserDetailsModalWrapper;
