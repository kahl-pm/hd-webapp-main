import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getUrls } from '@policyme/global-libjs-utils';
import {
  Typography, Modal, Spacer, Alert, AwardIcon, Button,
  UniformSpacingLayout,
  isMobile,
} from '@policyme/global-libjs-designsystem';

import { handleStartNewApp, handleKeepPreviousApp } from '../../NewActions/handle';
import { State } from '../../store/types/State';
import { nextQuestion } from '../../NewActions/session';

type AccountsInProgressAppModalProps = {
  name: string;
  has_in_progress_policy: boolean;
  open: boolean;
}

const AccountsInProgressAppModal = ({ open }) => {
  const _state = useSelector<State, State>((state) => state);
  const userType = _state.userControl.currentUser;
  const dispatch = useDispatch();

  const _props: AccountsInProgressAppModalProps = {
    name: _state[userType].household.firstName ?? '',
    has_in_progress_policy: _state.metadata.hasInProgressPolicy,
    open,
  };

  const [showModal, setShowModal] = useState(_props.open);
  const [busy, setBusy] = useState(true);

  const dropLink = `${getUrls().accounts}/policies`;

  useEffect(() => {
    setShowModal(_props.open);
    setBusy(false);
  }, [_props.open]);

  useEffect(() => {
    // if no existing policy this modal should not be shown to the user
    if (!_props.has_in_progress_policy) {
      dispatch(nextQuestion());
    }
  }, [_props.has_in_progress_policy]);

  return (
    <Modal
      header={
        <FormattedMessage
          id="accountsInProgressAppModal.greatToHaveYouBack.VafVg1"
          values={_props.name ?
            { name: _props.name, isShortName: _props.name.length < 20 }
            : undefined}
        />
      }
      open={showModal}
      disableClose
      name="accountsInProgressAppModal"
      ariaLabelledBy="accountsInProgressAppModal"
      ariaDescribedBy="accountsInProgressAppModalBody"
    >
      <UniformSpacingLayout
        flexDirection="column"
        gap={isMobile() ? '1rem' : '1.5rem'}
        fullWidth
      >
        <Typography
          variant="body1"
          message={<FormattedMessage id="accountsInProgressAppModal.inProgressApplication.ajSKGA" />}
        />
        <Typography
          variant="body1"
          message={<FormattedMessage id="accountsInProgressAppModal.closeInProgressApplication.WKNmHj" />}
        />
        <Alert
          type="tip"
          icon={<AwardIcon />}
          text={
            <FormattedMessage
              id="accountsInProgressAppModal.emailedYouALink.rEPtDv"
            />
          }
        />
        <div>
          <Button
            loading={busy}
            onClick={() => { dispatch(handleKeepPreviousApp(dropLink)); }}
            variant="secondary"
            dataCy="keep-previous-application"
            name="keep-previous-application"
            aria-label="Keep Previous Application"
          >
            <Typography
              variant="CTALargeSecondary"
              message={<FormattedMessage id="accountsInProgressAppModal.keepPreviousApplication.qdWNaN" />}
            />
          </Button>
          <Spacer size="spaceSmall" />
          <Button
            onClick={() => { dispatch(handleStartNewApp()); }}
            dataCy="start-new-application"
            name="start-new-application"
            aria-label="Start New Application"
          >
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="accountsInProgressAppModal.startNewApplication.YTzN0L" />}
            />
          </Button>
        </div>
      </UniformSpacingLayout>
    </Modal>
  );
};

export default AccountsInProgressAppModal;
