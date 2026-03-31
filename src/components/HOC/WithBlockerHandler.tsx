import React, { useContext, Suspense } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider as NewUIThemeProvider } from '@policyme/global-libjs-designsystem/';
import { ThemeKey } from '@policyme/global-libjs-designsystem/ThemeProvider.types';
import { getTheme } from '@policyme/global-libjs-utils';
import { muiTheme } from '../../styles/components/materialTheme';
import {
  isDecisionIsMadeBlocker,
  isPolicyIsSetupBlocker,
} from '../../Selectors/blocker';
import PageContentWithNav from '../PageContentWithNav';
import GlobalCSS from '../../GlobalCSS';
import LoadingComponent from '../LoadingOverlay';

const PolicyIsSetUp = React.lazy(
  () => import('../../pages/lockedPages/PolicyIsSetUp'),
);

const DecisionIsMade = React.lazy(
  () => import('../../pages/lockedPages/DecisionIsMade'),
);

const BlockerStyleComponent = (props) => {
  const currentTheme = getTheme();
  return (
    <NewUIThemeProvider
      theme={currentTheme as ThemeKey}
      mergeThemes={[muiTheme]}
      useRebrandTheme={props.isRebrandDesignEnabled}
    >
      <div className="App">
        <PageContentWithNav>
          <main id="main" className="main">
            {props.children}
          </main>
        </PageContentWithNav>
        <GlobalCSS />
      </div>
    </NewUIThemeProvider>
  );
};

const WithBlockerHandler = (WrappedComponent) => (props) => {
  const { isCurrentlyHydratingData, showPolicyIsSetupBlocker,
    showDecisionIsMadeBlocker,
    ...passThroughProps } = props;

  // disable blocker logic while we are currently hydrating data

  if (!isCurrentlyHydratingData && showPolicyIsSetupBlocker) {
    return <BlockerStyleComponent>
      <Suspense fallback={<LoadingComponent />}>
        <PolicyIsSetUp {...passThroughProps} />
      </Suspense>
    </BlockerStyleComponent>;
  }

  if (!isCurrentlyHydratingData && showDecisionIsMadeBlocker) {
    return <BlockerStyleComponent>
      <Suspense fallback={<LoadingComponent />}>
        <DecisionIsMade {...passThroughProps} />
      </Suspense>
    </BlockerStyleComponent>;
  }

  return <WrappedComponent {...passThroughProps} />;
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, props) => {
  const userType = (props.match && props.match.params.userType) || state.userControl.currentUser;
  return {
    showPolicyIsSetupBlocker: isPolicyIsSetupBlocker(state, userType),
    showDecisionIsMadeBlocker: isDecisionIsMadeBlocker(state),
    isCurrentlyHydratingData: state.metadata.isCurrentlyHydratingData,
  };
};

// connecting HOC to a redux store requires it to be a function
// https://stackoverflow.com/questions/61571091/using-redux-state-inside-hoc-in-reactjs
// https://stackoverflow.com/questions/57386155/how-to-connect-a-higher-order-component-to-a-redux-store
export default (WrappedComponent) => connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithBlockerHandler(WrappedComponent));
