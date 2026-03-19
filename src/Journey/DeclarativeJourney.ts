import { getRouteWithProductType } from '../utils/helpers';
import {
  JourneyConstructor,
  JourneyContext,
  JourneyDefinition,
  JourneyStep,
} from './types';

const findIndecies = (pathname:string, steps:JourneyStep[]) => {
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
    const step = steps[stepIndex];
    for (let pathIndex = 0; pathIndex < step.paths.length; pathIndex++) {
      if (step.paths[pathIndex] === pathname) {
        return { step: stepIndex, path: pathIndex };
      }
    }
  }
  return null;
};

const resolveJourney = (journey:JourneyDefinition, context:JourneyContext) => {
  const resolvedSteps:JourneyStep[] = [];

  journey.steps.forEach((step) => {
    if (typeof step === 'function') {
      // This is a subjourney that needs resolving
      const subJourney = step(context);
      resolvedSteps.push(...subJourney.getSteps());
    } else {
      const paths = Array.isArray(step) ? step : step.paths;
      resolvedSteps.push({
        paths: paths.map((path) => {
          if (typeof path === 'string') {
            return getRouteWithProductType(path, context.mainProduct);
          }
          if (path.if(context)) {
            return getRouteWithProductType(path.path, context.mainProduct);
          }
          return null;
        }).filter(Boolean),
        canSkip: (Array.isArray(step) || !step.canSkip) ? false : step.canSkip(context),
      });
    }
  });

  return { steps: resolvedSteps };
};

const DeclarativeJourney = (journey:JourneyDefinition):JourneyConstructor => (context) => {
  const { steps } = resolveJourney(journey, context);
  return {
    name: journey.name,
    getFirstPage: () => steps.find(step => !step.canSkip)?.paths[0],
    getIngressPage: (ingressPoint) => journey.ingressPoints?.[ingressPoint] ?? null,
    getNextPage: (pathname) => {
      const indecies = findIndecies(pathname, steps);
      if (indecies) {
        const stepPaths = steps[indecies.step].paths;
        if (indecies.path + 1 < stepPaths.length) {
          // Next path in the same step
          return stepPaths[indecies.path + 1];
        }
        const nextStep = steps
          .slice(indecies.step + 1)
          .find(step => !step.canSkip);
        if (nextStep) {
          // First path in the next step
          return nextStep.paths[0];
        }
      }
      return null;
    },
    getSteps: () => steps,
  };
};

export default DeclarativeJourney;
