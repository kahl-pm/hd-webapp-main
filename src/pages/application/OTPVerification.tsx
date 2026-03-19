import React, { useEffect, useState } from 'react';
import { Typography, Spacer, Input, TextButton, Button, Form, Alert, TriangleAlertIcon, isMobile, MaxWidthContainer, PageContainer, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { styled, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../store/types/State';
import { handleSendOTPEmail, handleVerifyOTP } from '../../NewActions/auth0';
import { IPostSendOTPResponse, IVerifyOTPResponse } from '../../NewActions/fetch';

import { getTimeXMinutesAfter } from '../../utils/helpers';
import { updateIsLoading } from '../../NewActions/helpersMetadata';
import BottomNavigation from '../../components/BottomNavigation';

/**
 * All containers will be imported from the design system, currently
 * they are in a different release branch
 */

const AlertContainer = styled('div')`
  width: 70%;
  margin: 0 auto;
`;

const LoadingContainer = styled('div')(({ theme }) => `
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  z-index: 9999;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  `);

const HorizontalContentWithGap = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const TextButtonContainer = styled('div')`
  width: max-content;
`;

const ERROR_ALERT_CONTENT_MAP = {
  INVALID_ATTEMPTS: {
    heading: <FormattedMessage id="OTPVerification.invalidVerificationCode.heading.23xa4a" />,
    text: (numAttempts: number) => <FormattedMessage
      id="OTPVerification.invalidVerificationCode.text.xnCAcC"
      values={{
        numAttempts,
      }}
    />,
    inputErrorVerification: <FormattedMessage id="OTPVerification.input.invalidVerificationCode.23xa4a" />,
  },
  EXPIRED_CODE: {
    heading: <FormattedMessage id="OTPVerification.expiredCode.heading.a4SHMO" />,
    text: (numAttempts: number, options: IAlertActionOptions) => {
      return (
        <HorizontalContentWithGap>
          <FormattedMessage
            id="OTPVerification.expiredCode.text.fsmsGd"
            values={{
              numAttempts,
            }}
          />
          <TextButtonContainer>
            <TextButton
              name="resendCode"
              label={<FormattedMessage id="OTPVerification.resendCodeButtonText.7a4SHM" />}
              onClick={options.onClick}
              disabled={options.disabled}
              aria-disabled={options.disabled}
              aria-live="polite"
              aria-label={!options.disabled ? 'Resend code' : 'Resend code disabled'}
            />
          </TextButtonContainer>
        </HorizontalContentWithGap>
      );
    },
    inputErrorVerification: <FormattedMessage id="OTPVerification.input.invalidVerificationCode.expiredCode.vujc1I" />,
  },
  MAX_ATTEMPTS_REACHED: {
    heading: <FormattedMessage id="OTPVerification.maxAttemptsReached.heading.3a4SHM" />,
    text: (numAttempts: number, options: IAlertActionOptions) => {
      return (
        <HorizontalContentWithGap>
          <FormattedMessage
            id="OTPVerification.maxAttemptsReached.text.7a4SHM"
            values={{
              time: options?.enableTime,
            }}
          />
          <TextButtonContainer>
            <TextButton
              name="resendCode"
              label={<FormattedMessage id="OTPVerification.resendCodeButtonText.7a4SHM" />}
              onClick={options.onClick}
              disabled={options.disabled}
              aria-disabled={options.disabled}
              aria-live="polite"
              aria-label={!options.disabled ? 'Resend code' : 'Resend code disabled'}
            />
          </TextButtonContainer>
        </HorizontalContentWithGap>
      );
    },
    inputErrorVerification: <FormattedMessage id="OTPVerification.input.invalidVerificationCode.maxattempts.Tm8Ooy" />,
  },
};

const ERROR_TYPES = {
  INVALID_ATTEMPTS: 'INVALID_ATTEMPTS',
  EXPIRED_CODE: 'EXPIRED_CODE',
  MAX_ATTEMPTS_REACHED: 'MAX_ATTEMPTS_REACHED',
} as const;

interface IAlertActionOptions {
  onClick?: () => void;
  disabled?: boolean;
  enableTime?: string;
}

interface IAlertContent {
  heading: React.ReactNode;
  text: (numAttempts?: number, options?: IAlertActionOptions) => React.ReactNode;
  inputErrorVerification: React.ReactNode;
}

const getAlertContent = (alertType: keyof typeof ERROR_ALERT_CONTENT_MAP): IAlertContent => {
  switch (alertType) {
    case 'INVALID_ATTEMPTS':
      return ERROR_ALERT_CONTENT_MAP.INVALID_ATTEMPTS;
    case 'EXPIRED_CODE':
      return ERROR_ALERT_CONTENT_MAP.EXPIRED_CODE;
    case 'MAX_ATTEMPTS_REACHED':
      return ERROR_ALERT_CONTENT_MAP.MAX_ATTEMPTS_REACHED;
    default:
      throw new Error('Invalid alert type');
  }
};

const getErrorType = (verificationData: IVerifyOTPResponse['data'], retryData: IPostSendOTPResponse['data']): keyof typeof ERROR_TYPES => {
  if (retryData?.num_attempts_remaining === 0
    && verificationData?.num_otp_attempts_remaining === 0) {
    return ERROR_TYPES.MAX_ATTEMPTS_REACHED;
  }
  if (verificationData?.num_otp_attempts_remaining !== 0) {
    return ERROR_TYPES.INVALID_ATTEMPTS;
  }
  return ERROR_TYPES.EXPIRED_CODE;
};

const MINUTES_TO_DISABLE_FOR = 15;

const OTPVerification: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, showError] = useState(false);
  const [verifyOTPData, setVerifyOTPData] = useState<IVerifyOTPResponse['data'] | null>(null);
  const [resendOTPData, setResendOTPData] = useState<IPostSendOTPResponse['data'] | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [enableTime, setEnableTime] = useState<string>('');

  const email = useSelector<State, string>((state: State) => state.primary.household.email);
  const isLoading = useSelector<State, boolean>((state: State) => state.metadata.isLoading);
  const theme = useTheme();
  const dispatch = useDispatch();
  const intl = useIntl();

  const resolveErrorAlertTextArguments = (
    errorType: keyof typeof ERROR_TYPES,
  ): [number, IAlertActionOptions] => {
    switch (errorType) {
      case 'INVALID_ATTEMPTS':
        return [verifyOTPData?.num_otp_attempts_remaining, {}];
      case 'EXPIRED_CODE':
        return [resendOTPData?.num_attempts_remaining,
          { onClick: handleResendCode, disabled, enableTime }];
      case 'MAX_ATTEMPTS_REACHED':
        return [resendOTPData?.num_attempts_remaining,
          { onClick: handleResendCode, disabled, enableTime }];
      default:
        throw new Error('Invalid alert type');
    }
  };

  useEffect(() => {
    /**
     * On page load, send OTP email if not already sent
     */
    if (!resendOTPData) {
      dispatch(updateIsLoading(true));
      const fetchRetryData = async () => {
        const _retryData: IPostSendOTPResponse['data'] | {} = await dispatch(handleSendOTPEmail());
        setResendOTPData(_retryData ? _retryData as IPostSendOTPResponse['data'] : null);
      };
      fetchRetryData();
      dispatch(updateIsLoading(!!resendOTPData));
    }
  }, []);

  useEffect(() => {
    /**
     * Show error message if OTP verification fails
     * This is controlling the error state in the input component
     */
    showError(!!verifyOTPData?.failed);
  }, [verifyOTPData?.failed]);

  useEffect(() => {
  /**
   * Disable the resend code button if the user has reached the maximum number of attempts
   * Disable the submit button if the user has reached the maximum number of attempts
   * Enable the submit button after 15 minutes
   * on enable, send OTP email
   */
    if (resendOTPData?.num_attempts_remaining === 0
    && verifyOTPData?.num_otp_attempts_remaining === 0) {
    // Disable the button immediately
      setDisabled(true);

      // Set the time when the button will be re-enabled
      setEnableTime(getTimeXMinutesAfter(new Date(), MINUTES_TO_DISABLE_FOR));

      // Schedule the button to be enabled after 15 minutes (900000 ms)
      const timer = setTimeout(() => {
        setDisabled(false);
      }, MINUTES_TO_DISABLE_FOR * 60 * 1000); // 15 minutes in ms

      // Cleanup the timer when the component unmounts
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [resendOTPData?.num_attempts_remaining, verifyOTPData?.num_otp_attempts_remaining]);

  const errorType: keyof typeof ERROR_TYPES = getErrorType(verifyOTPData, resendOTPData);

  const handleInputChange = (e: string) => {
    /**
     * Clear error message on input change, and set the verification code
     * When the user types, the previous data should be cleared because we want to validate
     * against the new data
     */
    verifyOTPData?.num_otp_attempts_remaining !== 0 && setVerifyOTPData(null);
    setCode(e);
  };

  const handleResendCode = async () => {
    /**
     * Resend OTP email, and update the resend data
     */
    dispatch(updateIsLoading(true));
    setVerifyOTPData(null);
    const _retryData: IPostSendOTPResponse['data'] | {} = await dispatch(handleSendOTPEmail());
    setResendOTPData(_retryData ? _retryData as IPostSendOTPResponse['data'] : null);
    dispatch(updateIsLoading(false));
  };

  const handleSubmit = async () => {
    /**
     * Verify OTP code, and update the verification data
     * Handle the submission of the form
     * On success -> start 2fa verification / aura flow
     */
    dispatch(updateIsLoading(true));
    const _data: IVerifyOTPResponse['data'] | {} = await dispatch(handleVerifyOTP(code));
    setVerifyOTPData(_data ? _data as IVerifyOTPResponse['data'] : null);
    dispatch(updateIsLoading(false));
  };

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      {/* TODO: use fullHeight after using the design system page container */}
      <PageContainer fullHeight>
        {(disabled || (!isLoading && verifyOTPData?.failed)) && (<AlertContainer>
          <Alert
            type="high"
            icon={<TriangleAlertIcon variant="default" />}
            heading={getAlertContent(errorType).heading}
            text={getAlertContent(errorType).text(
              ...resolveErrorAlertTextArguments(errorType),
            )}
          />
          <Spacer size="spaceLarge" />
        </AlertContainer>)}
        <Typography
          variant="h1"
          message={<FormattedMessage id="OTPVerification.heading.mf2TRZ" />}
          align="center"
        />
        <Spacer size="spaceLarge" />
        <MaxWidthContainer
          width="md"
        >
          <Form
            onSubmit={handleSubmit}
            name="otpVerificationForm"
          >
            <UniformSpacingLayout gap="1rem" flexDirection="column">
              <Typography
                variant="body1"
                message={<FormattedMessage id="OTPVerification.subheading.JIyaWw" />}
                align="center"
                component="h2"
              />
              <Typography variant="h3" message={email} align="center" />
              <Input
                label={intl.formatMessage({ id: 'OTPVerification.input.verificationCode.BNcnXT' })}
                value={code}
                onChange={(e) => handleInputChange(e)}
                name="verificationCode"
                required
                error={error}
                type="number"
                maxLength={6}
                data-cy="verificationCode"
                errorMessage={getAlertContent(errorType).inputErrorVerification}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Typography
                  variant="body1"
                  message={
                    <FormattedMessage
                      id="OTPVerification.didntReceiveCode.fYtdTe"
                    />
                }
                  align="center"
                />
                <div style={{
                  width: 'max-content',
                }}
                >
                  <TextButton
                    name="resendCode"
                    label={intl.formatMessage({ id: 'OTPVerification.resendCodeButtonText.7a4SHM' })}
                    onClick={handleResendCode}
                    disabled={disabled}
                    aria-disabled={disabled}
                    aria-label={!disabled ? 'Resend code' : 'Resend code disabled'}
                    aria-live="polite"
                  />
                </div>
              </div>
              <Button
                variant="primary"
                name="OTPVerificationCTA"
                type="submit"
                dataCy="submit"
                disabled={disabled}
                aria-disabled={disabled}
                aria-live="polite"
                hidden={isMobile()}
                ref={buttonRef}
              >
                <Typography
                  variant="CTALargePrimary"
                  message={<FormattedMessage
                    id="global.next.Q0fXUP"
                  />}
                />
              </Button>
            </UniformSpacingLayout>
          </Form>
        </MaxWidthContainer>
        {/* <SecureFooter /> */}
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" isDisabled={disabled} />
    </>
  );
};

export default OTPVerification;
