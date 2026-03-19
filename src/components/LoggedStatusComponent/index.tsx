import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortalUrl, getUrls } from '@policyme/global-libjs-utils';
import { isLoggedInUser } from '../../Selectors/userControl';
import { State } from '../../store/types/State';
import { disableBeforeUnload } from '../../NewActions/metadata';
import { logout, navigateToAccounts } from '../../NewActions/session';
import { doesPolicyIdExist } from '../../Selectors/session';
import { getUserFromURL } from '../../utils/helpers';
import { isInExternalAdvisorMode } from '../../Selectors/productApp';
import { LoggedIn, Login } from '../Login';

const LoggedStatusComponent = () => {
  const dispatch = useDispatch();
  const userType = useSelector<State, string>(
    (state) => getUserFromURL(state.router.location.pathname) ??
    state.userControl.currentUser,
  );
  const isUserLoggedIn = useSelector<State, boolean>((state) => isLoggedInUser(state));
  const firstName = useSelector<State, string>((state) => state.metadata.navbarFirstName || '');
  const lastName = useSelector<State, string>((state) => state.metadata.navbarLastName || '');

  const isPickWhereYouLeftOff = useSelector<State, boolean>(
    (state) => doesPolicyIdExist(state, userType) ?? false,
  );
  const isExternalAdvisor = useSelector<State, boolean>(
    (state) => isInExternalAdvisorMode(state),
  );
  return (
    <>{isUserLoggedIn && firstName && lastName ?
      <LoggedIn
        confirmAction={({ action }) => {
          if (action === 'log-out') {
            dispatch(disableBeforeUnload());
            dispatch(logout());
          }

          if (action === 'my-account') {
            dispatch(disableBeforeUnload());
            dispatch(navigateToAccounts());
          }
        }}
        firstName={firstName}
        lastName={lastName}
        isPickWhereYouLeftOff={isPickWhereYouLeftOff}
        isInExternalAdvisorMode={isExternalAdvisor}
      /> :
      <Login onClick={() => {
        let redirecUrl = isExternalAdvisor ?
          getPortalUrl() : getUrls().accounts.concat('/login');
        window.location.href = redirecUrl;
      }}
      />}
    </>);
};

export default LoggedStatusComponent;
