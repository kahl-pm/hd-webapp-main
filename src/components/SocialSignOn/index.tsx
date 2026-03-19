import { Button, Divider, Input, ResponsiveImage, Spacer, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import GOOGLE_ICON from '../../static/images/social-sign-on/google.svg';
import APPLE_ICON from '../../static/images/social-sign-on/apple.svg';
import FACEBOOK_ICON from '../../static/images/social-sign-on/facebook.svg';
import { SSO_CONNECTION_TYPES } from '../../constants/socialSignOn';
import { updateMetadata } from '../../NewActions/metadata';
import { isInBackdoorMode, isInExternalAdvisorMode } from '../../Selectors/productApp';

interface SocialSignOnProps {
  emailValue: string;
  isEmailDisabled: boolean;
  isSignOnDisabled: boolean;
  onEmailChange: (field: string) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>
}

const SocialSignOn = (props: SocialSignOnProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const isAdvisorMode = useSelector(isInExternalAdvisorMode);
  const isBackdoorMode = useSelector(isInBackdoorMode);

  const handleGoogleClick = () => {
    dispatch(updateMetadata('login_method', SSO_CONNECTION_TYPES.GOOGLE));
    props.onSubmit();
  };

  const handleAppleClick = () => {
    dispatch(updateMetadata('login_method', SSO_CONNECTION_TYPES.APPLE));
    props.onSubmit();
  };

  const handleFacebookClick = () => {
    dispatch(updateMetadata('login_method', SSO_CONNECTION_TYPES.FACEBOOK));
    props.onSubmit();
  };

  const isSocialSignOnDisabled = props.isSignOnDisabled || isAdvisorMode || isBackdoorMode;

  return <UniformSpacingLayout flexDirection="column">
    <UniformSpacingLayout flexDirection="column" gap="1rem">
      <SocialSignOnButton disabled={isSocialSignOnDisabled} icon={GOOGLE_ICON} onClick={handleGoogleClick} label={<FormattedMessage id="sso.google.LNln12" />} />
      <SocialSignOnButton disabled={isSocialSignOnDisabled} icon={APPLE_ICON} onClick={handleAppleClick} label={<FormattedMessage id="sso.apple.N4o91o" />} />
      <SocialSignOnButton disabled={isSocialSignOnDisabled} icon={FACEBOOK_ICON} onClick={handleFacebookClick} label={<FormattedMessage id="sso.facebook.xjxan9" />} />
    </UniformSpacingLayout>
    <Spacer size="spaceMedium" />
    <Divider>
      <Typography
        variant="body1"
        textTransform="lowercase"
        message={<FormattedMessage id="global.or.OPeHDL" />}
      />
    </Divider>
    <Spacer size="spaceLarge" />
    <Input
      value={props.emailValue}
      onChange={props.onEmailChange}
      disabled={props.isEmailDisabled}
      name={`emailInputPrimary`}
      label={intl.formatMessage({ id: 'detailCard.email.13IA0F' })}
      autoComplete="email"
      data-cy="email"
      email
    />
  </UniformSpacingLayout>;
};

const SocialSignOnButton = (props: {
  icon: string,
  label: React.ReactNode,
  onClick: () => void,
  disabled?: boolean,
}) => {
  return (
    <Button
      variant="secondary"
      style={{
        position: 'relative',
        justifyContent: 'center',
      }}
      onClick={props.onClick}
      type="button"
      disabled={props.disabled}
    >
      <ResponsiveImage
        style={{
          position: 'absolute',
          left: '1rem',
          height: '2rem',
          width: '2rem',
        }}
        src={props.icon}
        alt="cards"
      />
      <Typography color="black" variant="CTALargePrimary" message={props.label} />
    </Button>
  );
};

export default SocialSignOn;
