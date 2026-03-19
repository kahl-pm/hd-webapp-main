import { ROUTES } from '../../src/utils/const';

// This test checks for potential route collisions in the ROUTES object.
// It ensures that no two routes have conflicting paths that could lead to unexpected behavior.
// The test uses regular expressions to replace route parameters
// (e.g., /:product) with a wildcard (.*),
// allowing for flexible matching of route paths when comparing to other routes.
describe('ROUTES object', () => {
  it('should not have any potential route collisions', () => {
    const routeValues = Object.values(ROUTES);
    const routePaths = routeValues.map(route => route.replace(/\/:\w+/g, '/.*'));

    for (let i = 0; i < routePaths.length; i++) {
      for (let j = i + 1; j < routePaths.length; j++) {
        const regex = new RegExp(`^${routePaths[i]}$`);
        if (regex.test(routePaths[j])) {
          throw new Error(`Route collision detected: ${routeValues[i]} and ${routeValues[j]}`);
        }
      }
    }
  });
});
