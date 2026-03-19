import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { MaxWidthContainer, PageContainer } from '@policyme/global-libjs-designsystem';
import { nextQuestion } from '../../NewActions/session';
import TwoFactorVerifyPage from '../../components/TwoFactorVerifyPage';
import { handlePostPhoneNumberFor2Fa, handleVerify2FaOtp } from '../../NewActions/auth0';

const TwoFactorOtp = (props) => {
  const dispatch = useDispatch();
  const defaultValues = {
    heading: <FormattedMessage id="twoFactorVerification.enterCodeHeading.DkCNEA" />,
    formName: '',
    phone: props.phone ?? '',
    isHydrated: true,
    hasPreExistingPhone: true,
    handleVerifyOtp: handleVerify2FaOtp,
    handleValidatePhoneNumberFor2FA: handlePostPhoneNumberFor2Fa,
    dispatch,
  };
  return (
    <PageContainer fullHeight>
      <MaxWidthContainer width="md">
        <TwoFactorVerifyPage {...defaultValues} />
      </MaxWidthContainer>
    </PageContainer>
  );
};

const mapDispatchToProps = {
  nextQuestion,
  handleVerify2FAOtp: handleVerify2FaOtp,
  handlePostPhoneNumberFor2FA: handlePostPhoneNumberFor2Fa,
};

const mapStateToProps = (state, props) => {
  return {
    firstName: '',
    lastName: '',
    phone: state.primary.household.phone ?? '',
    hasPreExistingPhone: state.metadata.hasPreExistingPhoneNumber,
    isHydrated: false,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorOtp);
