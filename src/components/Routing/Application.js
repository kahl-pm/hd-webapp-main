import React from 'react';
import { connect } from 'react-redux';
import { Route, useLocation } from 'react-router-dom';
import universal from 'react-universal-component';
import { CSSTransition } from 'react-transition-group';
import { Global, css } from '@emotion/react';
import { useCustomPages, Customisable } from '../Customisation';

import Container from '../Container';

import { ROUTES, ROUTE_REGEX, ROUTE_SECTIONS } from '../../utils/const';
import { getLoadingConfig, checkIfMigratedPage } from './utils';
import WithGoogleMaps from '../HOC/WithGoogleMaps';

export const CellPhone = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/CellPhone'),
  getLoadingConfig('split-application'),
);

const EmploymentIncomeAnnual = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/EmploymentIncomeAnnual'),
  getLoadingConfig('split-application'),
);

const BasicDetails = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/BasicDetails'),
  getLoadingConfig('split-application'),
);
const FullAddress = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/FullAddress'),
  getLoadingConfig('split-application'),
);

const PendingPolicies = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/PendingPolicies'),
  getLoadingConfig('split-application'),
);
const Referrer = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/Referrer'),
  getLoadingConfig('split-application'),
);
const Interest = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/Interest'),
  getLoadingConfig('split-application'),
);
const BirthLocation = universal(
  () => import(
    /* webpackChunkName: "split-application" */ '../../pages/application/BirthLocation'
  ),
  getLoadingConfig('split-application'),
);
// const PartnerEmail = universal(
//   () => import(/* webpackChunkName: "split-application" */
//  '../../pages/application/PartnerEmail'),
//   getLoadingConfig('split-application'),
// );
const PartnerInfo = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/PartnerInfo'),
  getLoadingConfig('split-application'),
);
const PartnerSameAddress = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/PartnerSameAddress'),
  getLoadingConfig('split-application'),
);

const PrimaryTransition = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/PrimaryTransition'),
  getLoadingConfig('split-application'),
);

const Authorization = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/application/Authorization'),
  getLoadingConfig('split-application'),
);

const DisclosureIntegration = universal(
  () => import(/* webpackChunkName: "split-application" */ '../../pages/DisclosureIntegration'),
  getLoadingConfig('split-application'),
);

// other pages
const NotFound = universal(
  () => import(/* webpackChunkName: "other" */ '../../pages/not-found'),
  getLoadingConfig('other'),
);

// future ab-tests involving a/b versions of pages should use routesA and routesB
export const routes = [
  { route: ROUTES.APPLICATION_BASIC_DETAILS, Component: BasicDetails },
  { route: ROUTES.APPLICATION_FULL_ADDRESS, Component: FullAddress },
  { route: ROUTES.APPLICATION_BIRTH_LOCATION, Component: BirthLocation },
  { route: ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL, Component: EmploymentIncomeAnnual },
  { route: ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF, Component: EmploymentIncomeAnnual },
  { route: ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER, Component: EmploymentIncomeAnnual },
  { route: ROUTES.APPLICATION_CELL_PHONE, Component: CellPhone },
  { route: ROUTES.APPLICATION_REFERRER, Component: Referrer },
  { route: ROUTES.APPLICATION_INTEREST, Component: Interest },
  { route: ROUTES.APPLICATION_PARTNER_INFO, Component: PartnerInfo },
  { route: ROUTES.APPLICATION_PARTNER_SAME_ADDRESS, Component: PartnerSameAddress },
  { route: ROUTES.APPLICATION_CONSENT, Component: Authorization },
  { route: ROUTES.APPLICATION_PRIMARY_TRANSITION, Component: PrimaryTransition },
  {
    route: ROUTES.APPLICATION_DISCLOSURE_INTEGRATION,
    Component: DisclosureIntegration,
    isRelativeRoute: true,
  },
];

const ApplicationComponent = (props) => {
  const currentLocation = useLocation();
  const customPages = useCustomPages({ includedSections: [ROUTE_SECTIONS.APPLICATION] });
  const allRoutes = [
    ...customPages.map(([path, component]) => ({
      route: path,
      Component: component,
    })),
    ...routes,
  ];
  // see: https://reactcommunity.org/react-transition-group/with-react-router
  /* Can't use Switch from react-router-dom here or it will break the animation
    * But we want a route displayed if no route gets rendered (which normally uses Switch)
    * So check ourselves to see if any of the below routes will be displayed
    * and if not show the not found component
    */
  const currentPath = props.location.pathname;
  let hasRoute = allRoutes.some(r => (
    r.route === currentPath
  ));
  hasRoute = hasRoute
    || currentPath.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION)
    || currentPath.match(ROUTE_REGEX.APPLICATION_BASIC_DETAILS)
    || currentPath.match(ROUTE_REGEX.APPLICATION_FULL_ADDRESS)
;
  const animationTime = 500;

  const isNewDesignSystemMigratedPage = checkIfMigratedPage(currentLocation);

  return <>
    <Container className="application" hasFixedBanner isNewDesignSystemMigratedPage={isNewDesignSystemMigratedPage}>
      {hasRoute ? <>
        { allRoutes.map(r => <Route
          exact={!r.isRelativeRoute}
          key={r.route}
          path={r.route}
        >
          {({ match }) => (<CSSTransition
            in={match != null}
            timeout={{
              /**
               * This is the time it takes to enter/exit a page after navigating to the route.
               * In the a11y releases, we removed page transitions and
               * therefore, these page exit animations caused a flicker.
               * Temporarily setting this to 0 until we figure out
               * transition animations for the new design system.
               */
              enter: 0,
              exit: 0, // this needs to be
              // shorter to avoid a flicker of the exiting page
            }}
            classNames="fade"
            unmountOnExit
          >
            <div className={`fade ${props.backPressed ? 'back' : 'forward'}`}>
              <r.Component match={match} {...r.componentProps} />
              {/** TODO: Replace the transition code here with updated animations from
               * the design system.
               */}
              {/* <Global
                styles={css`
          .fade {
            position: absolute;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
padding: ${(r.route === ROUTES.APPLICATION_CONSENT || r.route === ROUTES.APPLICATION_CELL_PHONE) ?
                  `0 0rem` : `0 1rem`};
          }
          .fade-enter {
          }

          .fade-enter-active.back,
          .fade-enter-done.back {
            animation: fadein 500ms, slideinleft 500ms;
          }
          .fade-enter-active.forward,
          .fade-enter-done.forward {
            animation: fadein 500ms, slideinright 500ms;
          }
          .fade-exit {
          }
          .fade-exit-active.back,
          .fade-exit-done.back {
            animation: fadeout 500ms, slideoutright 500ms;
          }
          .fade-exit-active.forward,
          .fade-exit-done.forward {
            animation: fadeout 500ms, slideoutleft 500ms;
          }
          .fade-exit-done {
            display: none;
          }
          .fade-exit-active :global(.btn),
          .fade-exit-done :global(.btn) {
            display: none;
          }
          @keyframes slideinright {
            0% {
              transform: translateX(8rem);
            }
            40% {
              transform: translateX(2rem);
            }
            100% {
              transform: translateX(0);
            }
          }
          @keyframes slideoutleft {
            0% {
              transform: translateX(0rem);
            }
            40% {
              transform: translateX(-6rem);
            }
            100% {
              transform: translateX(-8rem);
            }
          }
          @keyframes slideinleft {
            0% {
              transform: translateX(-8rem);
            }
            40% {
              transform: translateX(-2rem);
            }
            100% {
              transform: translateX(0);
            }
          }
          @keyframes slideoutright {
            0% {
              transform: translateX(0rem);
            }
            40% {
              transform: translateX(6rem);
            }
            100% {
              transform: translateX(8rem);
            }
          }
          @keyframes fadein {
            0% {
              opacity: 0;
            }
            40% {
              opacity: 0.1;
            }
            100% {
              opacity: 1;
            }
          }
          @keyframes fadeout {
            0% {
              opacity: 1;
              transform: translateX(0);
            }
            40% {
              opacity: 0.1;
              transform: translateX(-6rem);
            }
            100% {
              opacity: 0;
              transform: translateX(-8rem);
            }
          }
        `}
              /> */}
            </div>
          </CSSTransition>)}
        </Route>) } </> : <Route path="*" component={NotFound} />}
    </Container>
  </>;
};

const mapStateToProps = state => ({
  backPressed: state.metadata.backPressed,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(
  WithGoogleMaps(ApplicationComponent),
);
