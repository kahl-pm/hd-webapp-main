/**
 * This Journey handles the disclosure flow, which requires fetching question
 * information from Aura and dynamically constructing the steps.
 */

import { getDisclosureRoute, getNextDisclosureIDFromCurrent } from '../../Selectors/disclosure';
import { ROUTE_REGEX } from '../../utils/const';
import { JourneyContext, JourneyConstructor, JourneyStep } from '../types';

const resolveSteps = (context:JourneyContext):JourneyStep[] => {
  return context.disclosureSections.map(section => ({
    paths: section?.question_ids.map(id => getDisclosureRoute(context.currentUser, id)) ?? [],
    canSkip: false,
    ingressPoint: null,
  }));
};

const DisclosureJourney:JourneyConstructor = (context) => {
  const steps = resolveSteps(context);
  return {
    name: 'DisclosureJourney',
    getFirstPage: () => {
      // THIS METHOD IS NOT CALLED. TODO: Allow resolveJourney in DeclarativeJourney to override
      // it's own method with this so we can customize behavior even more for journeys.
      // Ticket: https://policyme.atlassian.net/browse/CRO-954
      const disclosureId = context.disclosureOrder[0];
      return getDisclosureRoute(context.currentUser, disclosureId);
    },
    // THIS METHOD IS NOT CALLED. TODO: Allow resolveJourney in DeclarativeJourney to override
    // this so we can customize behavior even more for journeys.
    getIngressPage: () => null, // Always gotta start at the beginning
    getNextPage: (pathname) => {
      // THIS METHOD IS NOT CALLED. TODO: Allow resolveJourney in DeclarativeJourney to override
      // it's own method with this so we can customize behavior even more for journeys.
      // Ticket: https://policyme.atlassian.net/browse/CRO-954
      if (!pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION)) {
        return null;
      }
      const nextDisclosureId = getNextDisclosureIDFromCurrent(
        context.currentDisclosureId,
        context.disclosureOrder,
      );
      return getDisclosureRoute(context.currentUser, nextDisclosureId);
    },
    getSteps: () => {
      return steps;
    },
  };
};

export default DisclosureJourney;
