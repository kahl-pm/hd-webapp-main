/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import queryString from 'query-string';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * This import is required for the design system's theme to be
 * accessible post module augmentation of the base mui theme.
 */
// import '@policyme/global-libjs-designsystem';

import { ThemeProvider as NewUIThemeProvider, WithThemeProvider } from '@policyme/global-libjs-designsystem/';
import { ThemeKey } from '@policyme/global-libjs-designsystem/ThemeProvider.types';
import { getUrls, getTheme, initSentry, segmentSetAnonymousId, hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { goBack, push } from 'connected-react-router';
import React, { useEffect, Suspense } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CustomisationProvider, useCustomPages, useAllEntryPointOverrides, useActiveEntryPointOverrides } from './components/Customisation';
import CanonicalLink from './components/CanonicalLink';
import PageTitle from './components/PageTitle';
import WithBlockerHandler from './components/HOC/WithBlockerHandler';
import ErrorBoundaryHOC from './components/HOC/ErrorBoundaryHOC';
import WithInternationalization from './components/HOC/WithInternationalization';
import Loading from './components/Loading';
import Application from './components/Routing/Application';
import WarningBannerWithUserInfo from './components/WarningBannerWithUserInfo';
import Approved from './components/Routing/Approved';
import Debug from './components/Routing/Debug';
import Docusign from './components/Routing/Docusign';
import { checkTraceId } from './NewActions/session';
import { handleSegmentInit } from './NewActions/analytics';
import { changeSuggestedEmailAndNext, updateHouseholdPropAll } from './NewActions/household';
import { initLocationData, updateMetadata } from './NewActions/metadata';
import { isMortgageBroker, isPolicymePartner as isPolicymePartnerSelector } from './Selectors/userControl';
import ExternalRedirect from './components/ExternalRedirect';
import WithHydration from './components/HOC/WithHydration';
import LoadingComponent from './components/LoadingOverlay';
import {
  PM_ENVIRONMENT, RELEASE_VERSION, APP_ENV,
  PM_ONDEMAND_ENV, SENTRY_DSK,
  PM_DEMO_ENV,
  PM_ENABLE_SENTRY_SESSION_REPLAY,
} from './config';
import store from './store';
import { muiTheme } from './styles/components/materialTheme';
import { ACCOUNT_ROUTES, ROUTES, ROUTE_SECTIONS, PM_PRODUCT_PREFIX, USER_TYPES } from './utils/const';
import { getGenericRoute, getRouteWithProductType, getRouteWithUserType, isSocialSignOnFeatureEnabled, userConsentToTracking } from './utils/helpers';
import QuotesCompare from './pages/QuotesInput/QuotesCompare';
import QuotesHD from './pages/QuotesHD';
import CAAMember from './pages/CAAMember';
import KeepExistingPolicyPage from './pages/KeepExistingPolicyPage';
import { getTenantCustomisationConfig } from './tenant/customisation';
import WithConsentManager from './components/HOC/WithConsentManager';
import { ACTIVE_TESTS } from './ABTests';
import { getABTestBand } from './Selectors/metadata';
import { getRoutePageOptions } from './config/pageOptionsConfig';
import PageContentWithNav from './components/PageContentWithNav';
import ConfirmationModal from './components/ConfirmationModal';
import { isInExternalAdvisorMode, isInBackdoorMode } from './Selectors/productApp';
import CombinedCheckoutPage from './pages/health-and-dental/CombinedCheckoutPage';
import GenericError from './components/GenericError';
import GlobalCSS from './GlobalCSS';
import ScrollToTopWithRouter from './components/ScrollToTop';
import AirmilesNumber from './pages/health-and-dental/AirmilesNumber';
import HouseholdIncomePage from './pages/HouseholdIncome';

// Lazy-loaded pages (code splitting via React.lazy)
const NotFound = React.lazy(() => import('./pages/not-found'));
const Intent = React.lazy(() => import('./pages/Intent'));
const StartApp = React.lazy(() => import('./pages/StartApp'));
const AuraStartError = React.lazy(() => import('./pages/AuraStartError'));
const JiraLogin = React.lazy(() => import('./pages/JiraLogin'));
const DecisionDashboardPage = React.lazy(() => import('./pages/DecisionDashboardPage'));
const DecisionDashboardCallback = React.lazy(() => import('./pages/DecisionDashboardCallback'));
const Callback = React.lazy(() => import('./pages/docusign/Callback'));
const SkipMagicLinkCallback = React.lazy(() => import('./pages/SkipMagicLinkCallback'));
const MagicLinkAuthCallback = React.lazy(() => import('./pages/MagicLinkAuthCallback'));
const AffiliateLogoRow = React.lazy(() => import('./components/AffiliateLogoRow'));
const RebrandDebugMenu = React.lazy(() => import('./components/RebrandNav/DebugMenu'));
const Verification = React.lazy(() => import('./pages/Verification'));
const VerificationError = React.lazy(() => import('./pages/VerificationError'));
const GroupBenefits = React.lazy(() => import('./pages/GroupBenefits'));
const CoverageFitQuestion = React.lazy(() => import('./pages/CoverageFitQuestion'));
const ExistingCoverageHd = React.lazy(() => import('./pages/ExistingCoverage'));
const CoverPrescriptions = React.lazy(() => import('./pages/CoverPrescriptions'));
const PrescriptionDrugs = React.lazy(() => import('./pages/PrescriptionDrugs'));
const TwoFactorOtp = React.lazy(() => import('./pages/application/TwoFactorOtp'));
const TwoFactorMaxAttempts = React.lazy(() => import('./pages/application/TwoFactorMaxAttempts'));
const DigitalConsentDashboardPage = React.lazy(() => import('./pages/DigitalConsentDashboardPage'));
const OTPVerification = React.lazy(() => import('./pages/application/OTPVerification'));
const FamilyCompositionPage = React.lazy(() => import('./pages/FamilyCompositionPage'));

/**
 * Initializes analytics components based on user consent and tenant.
 *
 * @param {boolean} isPmTenant - Indicates whether the current tenant is a PM tenant.
 */
export const initAnalytics = () => {
  if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
    store.dispatch(handleSegmentInit());
    return;
  }
  if (userConsentToTracking()) {
    store.dispatch(handleSegmentInit());
  }
};

if (process.env.BROWSER) {
  let sentryEnv = APP_ENV;

  if (PM_DEMO_ENV === 'demo') {
    sentryEnv = 'demo';
  } else if (APP_ENV === 'test' && PM_ONDEMAND_ENV !== undefined) {
    sentryEnv = PM_ONDEMAND_ENV;
  }

  initSentry({
    env: sentryEnv,
    dsn: SENTRY_DSK,
    release: RELEASE_VERSION,
    store,
    mapStateToExtras: (state) => ({
      ab_test_band: getABTestBand(state),
    }),
    enableSessionReplay: PM_ENABLE_SENTRY_SESSION_REPLAY,
  });
  store.dispatch(initLocationData());
}

const Routes = () => {
  const { search, pathname } = useLocation(); // to preserve query params for redirects

  const customPages = useCustomPages({ excludeSections: [
    ROUTE_SECTIONS.APPLICATION,
    ROUTE_SECTIONS.APPROVED,
    ROUTE_SECTIONS.DOCUSIGN,
  ] });

  // Get all entry point overrides for the current user's AB test band,
  // filtered by their isActive conditions
  const allEntryPointOverrides = useAllEntryPointOverrides(ACTIVE_TESTS);
  const entryPointOverrides = useActiveEntryPointOverrides(allEntryPointOverrides);

  return (
    <Suspense fallback={<LoadingComponent />}>
    <Switch>
      {/* Redirect root to HD entry point */}
      <Redirect
        exact
        from="/"
        to={getRouteWithProductType(ROUTES.USER_INTENT, PM_PRODUCT_PREFIX.HD)}
      />
      <Redirect
        exact
        from="/family"
        to={getRouteWithProductType(ROUTES.FAMILY, PM_PRODUCT_PREFIX.HD)}
      />
      <Redirect
        exact
        from="/intent"
        to={getRouteWithProductType(ROUTES.USER_INTENT, PM_PRODUCT_PREFIX.HD)}
      />
      <Redirect
        strict
        from="/start-app"
        to={{
          pathname: getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD),
          search,
        }}
      />
      {entryPointOverrides.map(({ from, to }) => (
        <Redirect
          key={from}
          exact
          from={from}
          to={to}
        />
      ))}
      { /* Customisation framework pages */
        customPages.map(([path, component]) => (
          <Route
            key={path}
            path={path}
            component={component}
          />
        ))
      }

      <Route path={ROUTES.USER_INTENT} component={Intent} />
      <Route path={ROUTES.FAMILY_COMPOSITION} component={FamilyCompositionPage} />
      <Route path={ROUTES.HOUSEHOLD_INCOME} component={HouseholdIncomePage} />
      <Route path={ROUTES.GROUP_BENEFITS} component={GroupBenefits} />
      <Route path={ROUTES.COVERAGE_FIT_QUESTION} component={CoverageFitQuestion} />
      <Route path={ROUTES.EXISTING_COVERAGE_HD} component={ExistingCoverageHd} />
      <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />
      <Route path={ROUTES.PRESCRIPTION_DRUGS} component={PrescriptionDrugs} />
      <Route path={ROUTES.AIRMILES_COLLECTOR_PAGE} component={AirmilesNumber} />
      <Route path={ROUTES.CAA_MEMBER} component={CAAMember} />
      <Route path={ROUTES.KEEP_EXISTING_APP} component={KeepExistingPolicyPage} />
      <Route
        exact
        path={ROUTES.QUOTES_COMPARE}
        component={QuotesCompare}
      />
      <Route
        exact
        path={ROUTES.QUOTES_COMPARE_CONTINUED}
        component={QuotesHD}
      />
      <Route
        exact
        path={ROUTES.START_APP}
        component={StartApp}
      />
      <Route
        exact
        path={ROUTES.VERIFICATION}
        component={Verification}
      />
      <Route
        exact
        path={ROUTES.VERIFICATION_ERROR}
        component={VerificationError}
      />
      <Route
        exact
        path={ACCOUNT_ROUTES.POLICIES}
      >
        <ExternalRedirect redirectTo={`${getUrls().accounts}`} />
      </Route>
      <Route
        exact
        path={ROUTES.TWO_FACTOR_VERIFICATION_CODE}
        component={TwoFactorOtp}
      />
      <Route
        exact
        path={ROUTES.TWO_FACTOR_MAX_ATTEMPTS}
        component={TwoFactorMaxAttempts}
      />
      <Route path={ROUTE_SECTIONS.DOCUSIGN} component={Docusign} />
      <Route path={ROUTE_SECTIONS.APPLICATION} component={Application} />
      <Route path={ROUTE_SECTIONS.APPROVED} component={Approved} />
      <Route path={ROUTES.POLICY_DOWNLOAD_CALLBACK} component={Callback} />
      <Route path={ROUTES.AURA_START_ERROR} component={AuraStartError} />
      {PM_ENVIRONMENT !== 'prod' && <Route exact path={ROUTES.JIRA_LOGIN} component={JiraLogin} />}
      <Route
        exact
        path={ROUTES.DECISION_DASHBOARD_PAGE}
        component={DecisionDashboardPage}
      />
      <Route
        path={ROUTES.DECISION_DASHBOARD_CALLBACK}
        component={DecisionDashboardCallback}
      />
      <Route
        path={ROUTES.COMBINED_CHECKOUT_HD}
        component={CombinedCheckoutPage}
      />
      <Route path={ROUTES.SKIP_MAGIC_LINK_CALLBACK} component={SkipMagicLinkCallback} />
      <Route path={ROUTES.MAGIC_LINK_AUTH_CALLBACK} component={MagicLinkAuthCallback} />
      <Route
        exact
        path={ROUTES.DIGITAL_CONSENT_DASHBOARD_PAGE}
        component={DigitalConsentDashboardPage}
      />
      {PM_ENVIRONMENT !== 'prod' && <Route path={ROUTE_SECTIONS.DEBUG} component={Debug} />}

      {useSelector(isInExternalAdvisorMode) && <Route
        path={ROUTES.OTP_VERIFICATION}
        component={OTPVerification}
      />}

      <Route path="*" component={NotFound} />
    </Switch>
    </Suspense>
  );
};

const App = (props) => {
  if (props.segmentAnonymousId) {
    segmentSetAnonymousId(props.segmentAnonymousId);
  }
  useEffect(() => {
  });

  const abTestBand = useSelector(getABTestBand);

  useEffect(() => {
    const doLogging = false;
    doLogging && console.log('=== start useEffect ===');
    if (props.action === 'POP') {
      if (props.isFirstRendering) {
        doLogging && console.log('isFirstRendering, skip App.js re-routing events');
      } else if (props.backPressed) {
        doLogging && console.log('backPressed');
        if (props.currRoute === props.prevRoute) {
          doLogging && console.log(`same route ${props.currRoute}`);
          if (props.hasLocalHistory) {
            doLogging && console.log('going back');
            props.goBack();
          }
        } else {
          // If user clicks back on full address page or quotes page to return to address page
          // we always want to redo the hydration process
          if (
            isSocialSignOnFeatureEnabled() ?
            (props.prevRoute ===
              ROUTES.APPLICATION_BASIC_DETAILS && ![ROUTES.SKIP_MAGIC_LINK_CALLBACK, ROUTES.MAGIC_LINK_AUTH_CALLBACK].includes(
              props.currRoute,
            )) ||
            (props.currRoute ===
              ROUTES.APPLICATION_BASIC_DETAILS &&
              getGenericRoute(props.prevRoute) === ROUTES.QUOTES_COMPARE)
            :
            (props.prevRoute ===
              getRouteWithUserType(
                ROUTES.APPLICATION_FULL_ADDRESS,
                USER_TYPES.PRIMARY,
              ) && ![ROUTES.SKIP_MAGIC_LINK_CALLBACK, ROUTES.MAGIC_LINK_AUTH_CALLBACK].includes(
              props.currRoute,
            )) ||
            (props.currRoute ===
              getRouteWithUserType(
                ROUTES.APPLICATION_FULL_ADDRESS,
                USER_TYPES.PRIMARY,
              ) &&
              getGenericRoute(props.prevRoute) === ROUTES.QUOTES_COMPARE)
          ) {
            store.dispatch(updateMetadata('isforceRedoStartApp', true));
          }
          doLogging && console.log('NOT same route');
          props.push(props.currRoute);
        }
      } else {
        doLogging && console.log('NOT back pressed');
        props.push(props.currRoute);
      }
    } else {
      doLogging && console.log('NOT pop');
    }
    doLogging && console.log('=== end useEffect ===');
    if (process.env.PM_ENV !== 'local') {
      store.dispatch(checkTraceId());
    }
  }, [props.pathName]);

  // Do not show affiliateLogo at the top for pages with PolicyDetailsBanner or payment form page
  const AffiliateLogo = () => {
    const pageOption = getRoutePageOptions(abTestBand, props.currRoute);
    return props.isPolicymePartner && !pageOption.hideAffiliateLogo && (
      <AffiliateLogoRow />
    );
  };

  return (
    <div className="App">
      <NewUIThemeProvider
        theme={getTheme() as ThemeKey}
        mergeThemes={[muiTheme]}
        useRebrandTheme={props.isRebrandDesignEnabled}
      >
        <Suspense fallback={<LoadingComponent />}>
        <ErrorBoundaryHOC>
          <CustomisationProvider
            abTestConfig={ACTIVE_TESTS}
            abTestBand={abTestBand}
            tenantConfig={getTenantCustomisationConfig()}
          >
            <ScrollToTopWithRouter>
              <PageContentWithNav>
                <main id="main" className="main">
                  <WarningBannerWithUserInfo />
                  <Routes />
                  <RebrandDebugMenu />
                </main>
              </PageContentWithNav>
              <CanonicalLink />
              <PageTitle />
              <GenericError />
              <ConfirmationModal />
              <Loading />
            </ScrollToTopWithRouter>
            <GlobalCSS />
          </CustomisationProvider>
        </ErrorBoundaryHOC>
        </Suspense>
      </NewUIThemeProvider>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let { search } = state.router.location;
  let params = queryString.parse(search);

  return {
    currRoute: state.metadata.currRoute,
    prevRoute: state.metadata.prevRoute,
    backPressed: state.metadata.backPressed,
    hasLocalHistory: state.metadata.hasLocalHistory,
    isFirstRendering: state.metadata.isFirstRendering,
    action: state.router.action,
    pathName: state.router.location.pathname,
    isPolicymePartner: isPolicymePartnerSelector(state),
    isMortgageBroker: isMortgageBroker(state),
    theme: ownProps.theme ? ownProps.theme : getTheme(),
    segmentAnonymousId: params ? params.anonymous_id : null,
    isRebrandDesignEnabled: state.metadata.isRebrandDesignEnabled,
  };
};

const mapDispatchToProps = {
  push,
  goBack,
  changeSuggestedEmailAndNext,
  updateHouseholdPropAll,
};

export default
connect(mapStateToProps, mapDispatchToProps)(
  WithThemeProvider(
    WithInternationalization(
      WithBlockerHandler(
        WithConsentManager(
          WithHydration(
            App,
          ),
        ),
      ),
    ),
  ),
);
