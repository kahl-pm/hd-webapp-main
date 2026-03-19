/**
 * This file contains all of the logic required to select the correct Journey
 * based on session state. Once a Journey is selected and rendered,
 * it will remain static.
 */
import { useSelector } from 'react-redux';

import type { Journey, JourneyContext } from './types';
import LegacyJourney from './LegacyJourney';
import { getContextDiff, getContextHash, getJourneyContext } from './JourneyContext';
import { PM_DEBUG_JOURNEYS } from '../config';

let _previousContext = null;
let _previousJourney = null;
export const getJourneyFromState = (state:any):Journey => {
  const context = getJourneyContext(state);

  if (getContextHash(context) === getContextHash(_previousContext)) {
    return _previousJourney;
  }

  const journey = LegacyJourney(context);
  if (PM_DEBUG_JOURNEYS) {
    console.log('[Journey] Previous Context:', _previousContext);
    console.log('[Journey] Previous Journey:', _previousJourney?.name);
    console.log('[Journey] Context changed:', getContextDiff(_previousContext, context));
    console.log('[Journey] New journey:', journey.name, journey.getSteps());
  }
  _previousContext = context;
  _previousJourney = journey;
  return journey;
};

export const useJourney = () => {
  return useSelector<any, Journey>(getJourneyFromState);
};
