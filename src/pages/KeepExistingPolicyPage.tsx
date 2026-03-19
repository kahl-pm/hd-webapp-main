import React from 'react';
import { PageContainer } from '@policyme/global-libjs-designsystem';
import AccountsInProgressAppModal from '../components/AccountsInProgressAppModal';

const KeepExistingPolicyPage: React.FC = () => {
  return (
    <PageContainer>
      <AccountsInProgressAppModal open />
    </PageContainer>
  );
};

export default KeepExistingPolicyPage;
