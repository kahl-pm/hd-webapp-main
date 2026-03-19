import React, { useEffect, useState, useRef, useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Alert, MaxWidthContainer, PageContainer, Spacer, TextButton, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { onComponentLoad } from '../NewActions/session';
import { handleSendVerificationEmail } from '../NewActions/handle';
import { sendSegmentIdentifyEvent } from '../NewActions/analytics';
import store from '../store';

const Verification = (props) => {
  const timerRef = useRef(null);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [showSecurityText, setShowSecurityText] = useState(false);
  const dispatch = useDispatch();
  const state = store.getState();
  const currentUser = state.userControl.currentUser;
  useEffect(() => {
    dispatch(onComponentLoad(() => {
      dispatch(sendSegmentIdentifyEvent(state[currentUser].session.user_id));
    }));
  }, []);

  return (
    <PageContainer fullHeight>
      <MaxWidthContainer width="md">
        { showEmailSent && <EmailSent showSecurityText={showSecurityText} /> }
        <Typography
          variant="h1"
          message={<FormattedMessage
            id="verification.introduction.JzPmaX"
          />}
        />
        <Spacer size="spaceSmall" />
        <Typography
          variant="body1"
          component="h2"
          message={
            <FormattedMessage
              id="verification.emailConfirmation.lRIHtU"
            />
          }
        />
        <Spacer size="spaceMedium" />
        <Typography
          variant="body1"
          message={
            <FormattedMessage
              id="verification.emailLink.DC4r2a"
            />
          }
        />
        <Spacer size="spaceSmall" />
        <Typography
          variant="body1Bold"
          message={props.email}
        />
        <Spacer size="spaceMedium" />
        <UniformSpacingLayout flexDirection="row">
          <Typography
            variant="body1"
            message={<FormattedMessage
              id="verification.resend.M9ulIJ"
            />}
          />
          &nbsp;
          <TextButton
            label={
              <FormattedMessage
                id="verification.resendButtonText.XGg5Pa"
              />
            }
            name="resend"
            onClick={() => {
              const promiseResult = props.handleSendVerificationEmail();
              promiseResult.then(res => {
                setShowEmailSent(res.success);
                setShowSecurityText(true);
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                  setShowEmailSent(false);
                }, 5000);
              });
            }}
          />
        </UniformSpacingLayout>
      </MaxWidthContainer>
    </PageContainer>
  );
};

const mapStateToProps = state => ({
  email: state[state.userControl.currentUser].household.email,
});

const mapDispatchToProps = {
  handleSendVerificationEmail,
  onComponentLoad,
};

const EmailSent = ({ showSecurityText }) => {
  return (
    <><Alert
      type="low"
      heading={<FormattedMessage
        id="verification.emailSent.8w8BA6"
      />}
      text={showSecurityText &&
        <Typography
          variant="body1"
          message={<FormattedMessage
            id="verification.securityText.ExZ1FW"
            values={{
              span: chunks => <strong>{chunks}</strong>,
            }}
          />}
        />}
    /><Spacer size="spaceMedium" /></>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Verification);
