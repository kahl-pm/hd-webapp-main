/* eslint-disable max-len */
import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getUrls } from '@policyme/global-libjs-utils';
import { MaxWidthContainer, Typography, Button, PageContainer } from '@policyme/global-libjs-designsystem';
import { jumpToVerification, jumpToStart } from '../NewActions/session';
import { handleSendVerificationEmail } from '../NewActions/handle';
import { VERIFICATION_ERROR_TYPE } from '../utils/const';
import { PM_ENABLE_ACCOUNT_DASHBOARD } from '../config';

const VerificationError = (props) => {
  const isMaxRetriesErr = props.errorType === VERIFICATION_ERROR_TYPE.MAX_RETRIES;

  return (
    <PageContainer>
      <MaxWidthContainer width="md">
        <Typography
          variant="h1"
          message={isMaxRetriesErr ?
            <FormattedMessage id="verificationError.maxRetries.OgbDtC" />
            :
            <FormattedMessage id="verificationError.expired.TvLMpP" />}
        />
        {isMaxRetriesErr ?
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="verificationError.maxRetries.cE7f7O"
                values={{
                  span: chunks => <span className="bold-text">{chunks}</span>,
                }}
              />
            }
          /> :
          <Typography
            variant="body1"
            message={<FormattedMessage id="verificationError.expired.CO3HOD" />}
          />}
        <br />
        <Button
          className="btn btn-primary"
          type="button"
          name="backButton"
          onClick={() => {
            PM_ENABLE_ACCOUNT_DASHBOARD === '1' ? window.location.href = getUrls().accounts.concat('/login') : window.location.href = window.location.origin;
          }}
        >
          <Typography
            variant="CTALargePrimary"
            message={PM_ENABLE_ACCOUNT_DASHBOARD === '1'
              ? <FormattedMessage id="verificationError.maxRetriesCta.JHDcv1" />
              : <FormattedMessage id="auraStartError.backButtonText.x3SFGG" />}
          />
        </Button>
      </MaxWidthContainer>
    </PageContainer>
  );
};

const mapStateToProps = (state, props) => {
  const errorType = (props.match && props.match.params.errorType) ||
    VERIFICATION_ERROR_TYPE.EXPIRED;
  return {
    errorType,
  };
};

const mapDispatchToProps = {
  jumpToVerification,
  jumpToStart,
  handleSendVerificationEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationError);
