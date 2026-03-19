import React, { useState } from 'react';
import { Avatar, Menu, UserIcon, Modal, Typography, Button, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';

type LogInProps = {
  onClick: () => void;
};

export function Login({ onClick }: LogInProps) {
  return (<Avatar variant="interactive" onClick={onClick} icon={<UserIcon variant="interactive" />} />);
}

export const ACTION_TYPES = {
  MYACCOUNT: 'my-account',
  LOGOUT: 'log-out',
};

export const ACTIONS = {
  [ACTION_TYPES.MYACCOUNT]: {
    header: <FormattedMessage id="logged_in_modal.dGhRjKl" />,
    confirmText: <FormattedMessage id="logged_in_modal.sNmBfYx" />,
  },
  [ACTION_TYPES.LOGOUT]: {
    header: <FormattedMessage id="logged_in_modal.QbFmXeR" />,
    confirmText: <FormattedMessage id="logged_in_modal.vKsLpTa" />,
  },
};

type LoggedInProps = {
  confirmAction: (string) => void;
  firstName: string,
  lastName: string,
  isPickWhereYouLeftOff?: boolean,
  isInExternalAdvisorMode?: boolean,
  skipConfirmationModal?: boolean,
}

export function LoggedIn({
  confirmAction,
  firstName,
  lastName,
  isPickWhereYouLeftOff = false,
  isInExternalAdvisorMode = false,
  skipConfirmationModal = false,
}: LoggedInProps) {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const handleButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let options = [
    {
      label: intl.formatMessage({ id: 'loggedinMenu.myAccount.aKTGhB' }),
      value: ACTION_TYPES.MYACCOUNT,
      onClick: () => {
        if (skipConfirmationModal) {
          confirmAction({ action: ACTION_TYPES.MYACCOUNT });
        } else {
          setModalType(ACTION_TYPES.MYACCOUNT);
          setIsModalOpen(true);
        }
      },
      'data-cy': ACTION_TYPES.MYACCOUNT,
    },
    {
      label: intl.formatMessage({ id: 'loggedinMenu.logOut.klNmKT' }),
      value: ACTION_TYPES.LOGOUT,
      onClick: () => {
        if (skipConfirmationModal) {
          confirmAction({ action: ACTION_TYPES.LOGOUT });
        } else {
          setModalType(ACTION_TYPES.LOGOUT);
          setIsModalOpen(true);
        }
      },
      'data-cy': ACTION_TYPES.LOGOUT,
    },
  ];

  if (isInExternalAdvisorMode) {
    options.filter((option) => option.value !== ACTION_TYPES.MYACCOUNT);
  }

  const initials = firstName[0].toLocaleUpperCase() + lastName[0].toLocaleUpperCase();
  return (
    <>
      <Avatar
        variant="interactive"
        content={initials}
        onClick={(e) => handleButtonClick(e)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        options={options}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        data-cy="logged-in-menu"
      />
      <Modal
        name="loggedInModal"
        header={ACTIONS[modalType]?.header}
        handleClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        ariaLabelledBy={`${modalType}-modal-header`}
        ariaDescribedBy={`${modalType}-modal-description`}
      >
        <UniformSpacingLayout flexDirection="column" gap="1rem">
          <Typography
            variant="body1"
            mb="1rem"
            message={
              isPickWhereYouLeftOff ? (
                <FormattedMessage id="loggedIn.pickWhereYouLeftOff.mWq57j" />
              ) : (
                <FormattedMessage id="logged_in_modal.uWTJpCZ" />
              )
            }
          />
          <Button variant="primary" onClick={() => confirmAction({ action: modalType })}>
            <Typography variant="CTALargePrimary" message={ACTIONS[modalType]?.confirmText} />
          </Button>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            <Typography variant="CTALargeSecondary" message={<FormattedMessage id="global.cancel.ONKKss" />} />
          </Button>
        </UniformSpacingLayout>
      </Modal>
    </>
  );
}
