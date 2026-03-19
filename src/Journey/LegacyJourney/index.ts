/**
 * This is a catch-all dynamic Journey that wraps our legacy routing logic in the
 * new JourneyInterface. This is a temporary solution to allow us to incrementally
 * migrate our routing logic to the new Journey system.
 *
 * If you find yourself maintaining or changing code in here, please reconsider!
 * It would be much better to move the logic for your journey to a DeclarativeJourney!
 */

import { sentryError } from '@policyme/global-libjs-utils';
import { JourneyConstructor } from '../types';
import { firstQuestion, getApprovedNextStepsRoute, nextQuestion } from './routing';
import { isApprovedPage } from '../../Selectors/metadata';
import { JOURNEY_INGRESS_POINTS, ROUTES } from '../../utils/const';

const LegacyJourney:JourneyConstructor = (context) => {
  return {
    name: 'LegacyJourney',
    getFirstPage: () => {
      return firstQuestion();
    },
    getIngressPage: (ingressPoint) => {
      switch (ingressPoint) {
        case JOURNEY_INGRESS_POINTS.DECISION:
          return ROUTES.DECISION_DASHBOARD_PAGE;
        default:
          return null;
      }
    },
    getNextPage: (pathname) => {
      const next = isApprovedPage(pathname) || pathname === ROUTES.DECISION_DASHBOARD_PAGE
        ? getApprovedNextStepsRoute(context)
        : nextQuestion(pathname, context);
      if (!next) {
        sentryError('could not find route', { extras: { pathname } });
      }
      return next;
    },
    getSteps: () => {
      // We should never need to call this method for LegacyJourney,
      // which is good because calculating the full steps array would
      // be tricky and expensive.
      return [];
    },
  };
};

export default LegacyJourney;
