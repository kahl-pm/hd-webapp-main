/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Alert, Button, Form, Input, Spacer, TextButton, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

import { formatPhoneNumber,phoneMaskWithStars } from '../../utils/helpers';

export function capitalizeFirstLetter(str) {
  if (!str) { return ''; }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function padZeros(number, length) {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
}

const TwoFactorVerify = (props) => {
  const [showError, setShowError] = useState(false);
  const [showCodeSentBanner, setShowCodeSentBanner] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const { dispatch } = props;

  useEffect(() => {
    if (props.isHydrated && props.hasPreExistingPhone) {
      sendVerificationCode();
    }
  }, [props.isHydrated]);

  const onSubmit = async () => {
    setLoading(true);
    dispatch(props.handleVerifyOtp(verificationCode))
      .then(({ success, num_otp_attempts_remaining }) => {
        if (!success) {
          setAttemptsRemaining(num_otp_attempts_remaining);
          setShowError(true);
        }
      }).finally(() => {
        setLoading(false);
      });
  };

  const sendVerificationCode = () => {
    return dispatch(props.handleValidatePhoneNumberFor2FA(props.phone));
  };

  const onResend = () => {
    sendVerificationCode().then((res) => {
      if (res?.success) {
        setShowCodeSentBanner(true);
        // hide the banner after 5 seconds
        setTimeout(() => {
          setShowCodeSentBanner(false);
        }, 5000);
      }
    });
  };

  const intl = useIntl();

  return <>
    {showError && (<><Alert
      type="high"
      heading={<FormattedMessage id="OTPVerification.invalidVerificationCode.heading.23xa4a" />}
      text={<FormattedMessage id="verificationErrorMessage.attemptsLeft.5gM8lI" values={{ attemptsRemaining }} />}
    /><Spacer size="spaceMedium" /></>)}
    {showCodeSentBanner && <Alert
      type="tip"
      text={<FormattedMessage id="accessCode.pageSubHeading.A4pfK7" />}
    />}
    <Typography variant="h1" message={props.heading} />
    <Spacer size="spaceMedium" />
    <Typography
      variant="body1"
      message={<FormattedMessage id="twoFactorVerify.verifyItsYou.FtztWz" />}
    />
    <Form
      name={props.formName}
      onSubmit={onSubmit}
    >
      <Typography
        variant="body1"
        message={<FormattedMessage id="twoFactorVerify.enterCode.0KyRsd" />}
      />
      <Typography
        variant="h3"
        message={formatPhoneNumber(phoneMaskWithStars(props.phone))}
      />
      <Spacer size="spaceMedium" />
      <div className="input-container">
        <Input
          label={intl.formatMessage({ id: 'twoFactorVerify.verificationCode.rGj0Sx' })}
          type="number"
          value={verificationCode}
          maxLength={6}
          onChange={setVerificationCode}
          required
          requiredMessage={<FormattedMessage id="twoFactorVerify.enterVerificationCode.CGzOIg" />}
          name="verification_code"
          data-cy="verificationCode"
        />
      </div>

      <UniformSpacingLayout>
        <Typography
          variant="body1"
          message={<FormattedMessage id="twoFactorVerify.noCode.J0Z76q" />}
        />
          &nbsp;
        <TextButton
          name="resend"
          onClick={onResend}
          label={
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="twoFactorVerify.noCode.tfjeSo"
                  values={{ u: chunks => <u>{chunks}</u> }}
                />
              }
            />
            }
        />
      </UniformSpacingLayout>
      <Spacer size="spaceMedium" />
      <Button
        name="submit"
        type="submit"
        className="btn-primary btn-narrow"
        data-cy="login-submit"
        loading={loading}
      >
        <Typography
          variant="CTALargePrimary"
          message={<FormattedMessage id="global.next.Q0fXUP" />}
        />
      </Button>
    </Form>
  </>;
};

TwoFactorVerify.propTypes = {
  heading: PropTypes.node.isRequired,
  formName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  isHydrated: PropTypes.bool.isRequired,
  hasPreExistingPhone: PropTypes.bool.isRequired,
  handleVerifyOtp: PropTypes.func.isRequired,
  handleValidatePhoneNumberFor2FA: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default TwoFactorVerify;
