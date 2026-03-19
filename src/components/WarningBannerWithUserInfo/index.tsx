import React from 'react';
import { useSelector } from 'react-redux';
import { WarningBanner } from '@policyme/global-libjs-designsystem/';
import { getCurrentUserInfo } from '../../Selectors/userControl';
import { isInExternalAdvisorMode, isInBackdoorMode } from '../../Selectors/productApp';

const WarningBannerWithUserInfo: React.FC = () => {
  const userInfo = useSelector(getCurrentUserInfo);
  const isAdvisorMode = useSelector(isInExternalAdvisorMode);
  const isBackdoorMode = useSelector(isInBackdoorMode);

  if (!isAdvisorMode && !isBackdoorMode) {
    return null;
  }

  const { firstName, lastName, email } = userInfo;
  const userDetails = email ? `: Logged in as ${firstName} ${lastName} (${email})` : '';

  const mode = isAdvisorMode ? 'Advisor' : 'Backdoor';

  return <WarningBanner message={`You are in ${mode} Mode${userDetails}`} />;
};

export default WarningBannerWithUserInfo;
