import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { MaxWidthContainer, PageContainer, Spacer } from '@policyme/global-libjs-designsystem';
import WithReviewsIO from '../components/HOC/WithReviewsIO';
import { onComponentLoad } from '../NewActions/session';
import { handleApprovedStepsPage, handleUpsertHDExclusionsDeclaration } from '../NewActions/handle';
import { updateUserControlProp } from '../NewActions/userControl';
import { updateMetadata } from '../NewActions/metadata';
import NewDecisionDashboardPageHD from '../components/NewDecisionPage/DecisionPageDashboardHD';
import NewSpeakToExperts from '../components/SpeakToExperts';
import { getDecisionPageProps } from '../Selectors/decisionPage';

const DecisionDashboardPage = (props) => {
  useEffect(() => {
    props.onComponentLoad();
  }, []);

  return (
    <PageContainer textAlign="left">
      <MaxWidthContainer width="md">
        <NewDecisionDashboardPageHD {...props} />
        <Spacer size="spaceMedium" />
        <NewSpeakToExperts postDecision />
      </MaxWidthContainer>
    </PageContainer>
  );
};

const mapStateToProps = state => ({
  ...getDecisionPageProps(state),
});

const mapDispatchToProps = {
  onComponentLoad,
  handleApprovedStepsPage,
  updateUserControlProp,
  updateMetadata,
  handleUpsertHDExclusionsDeclaration,
};

export default WithReviewsIO()(
  connect(mapStateToProps, mapDispatchToProps)(DecisionDashboardPage),
);
