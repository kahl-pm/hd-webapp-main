import React, { useContext } from 'react';
import jsCookie from 'js-cookie';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getUrls, accountIdWrapper } from '@policyme/global-libjs-utils';

import { Button, Modal, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { retryRequest, cancelRequest, closeErrorModal } from '../../NewActions/metadata';
import { JOURNEY_START_PAGE_NAMES } from '../../utils/const';
import { logout } from '../../NewActions/session';

function GenericError(props) {
  const dispatch = useDispatch();
  const isUnauthenticated = props.error?.statusCode === 401;
  let header = isUnauthenticated ? <FormattedMessage id="genericError.unauthorizedHeader.bw17rQ" /> : <FormattedMessage id="genericError.somethingWentWrong.8UG2Ai" />;
  let content = isUnauthenticated ? <p>
    <FormattedMessage id="genericError.unauthorizedContent.be8AqR" />
  </p> : <p>
    <FormattedMessage
      id="genericError.engineersNotifiedSolution.jZC6eh"
      values={{ br: <br /> }}
    />
  </p>;

  // create a separate error for when the internet connectivity
  // is the culprit
  if (process.env.BROWSER && !window.navigator.onLine) {
    header = <FormattedMessage id="genericError.lostConnection.mScIGw" />;
    content = <Typography
      variant="body1"
      message={
        <FormattedMessage
          id="genericError.connectionLostPleaseTryAgain.QaQPLE"
          values={{ br: <br /> }}
        />
    }
    />;
  }

  const showCancel = JOURNEY_START_PAGE_NAMES.indexOf(props.pathname) === -1;

  const handleLogoutUserId = () => {
    jsCookie.get('user_id') ? dispatch(logout()) : window.location.replace(getUrls().accounts.concat('/login'))
  };

  const handleLogoutAccountId = () => {
    jsCookie.get('account_id') ? dispatch(logout()) : window.location.replace(getUrls().accounts.concat('/login'))
  };

  return (
    <Modal
      name="genericErrorModal"
      header={header}
      open={props.hasError}
      data-cy="genericErrorModal"
      ariaDescribedBy="genericErrorModalBody"
      ariaLabelledBy="genericErrorModal"
      disableClose
    >
      <div>
        {content}
        <Spacer size="spaceMedium" />
        {isUnauthenticated ? <Button
          name="confirm"
          onClick={() => accountIdWrapper(handleLogoutUserId, handleLogoutAccountId)}
          dataCy="genericErrorModal-to-accounts"
        >
          <Typography
            variant="CTALargePrimary"
            message={<FormattedMessage id="verificationError.maxRetriesCta.JHDcv1" />}
          />
        </Button> : <>
          <Button
            name="confirm"
            onClick={() => props.retryRequest()}
            dataCy="genericErrorModal-confirm"
          >
            <Typography
              variant="CTALargePrimary"
              message={
                <FormattedMessage id="global.retry.qlRmFg" />
          }
            />
          </Button>
          {showCancel && <>
            <Spacer size="spaceMedium" />
            <Button
              name="cancel"
              variant="secondary"
              onClick={() => props.cancelRequest()}
              dataCy="genericErrorModal-cancel"
            >
              <Typography
                variant="CTALargeSecondary"
                message={
                  <FormattedMessage id="global.back.Est6xJ" />
          }
              />
            </Button>
            </>}
        </>}
      </div>
    </Modal>
  );
}

const mapStateToProps = state => ({
  ...state.metadata,
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = {
  retryRequest,
  cancelRequest,
  closeErrorModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(GenericError);
