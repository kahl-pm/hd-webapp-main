import { USER_TYPES } from '../../../src/utils/const';

const logA11yResult = (violations) => {
  // get the test name and replace spaces with underscores. Used for the test report file name
  const testName = Cypress.currentTest.title.replace(/\s/g, '_');

  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`,
  );

  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }),
  );

  cy.task('table', violationData);
  cy.task('logA11yTestResult', { testName, violations });
};

Cypress.Commands.add('runA11yCheck', (context, options) => {
  // For context, see axe-core context doc https://github.com/dequelabs/axe-core/blob/develop/doc/context.md
  // For options, see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter for axe-core run options
  cy.injectAxe();
  cy.checkA11y({
    ...context,
    exclude: ['.navbar', '.right-items', ...(context?.exclude || [])], // Exclude the nav bar and debug panel buttons.
  }, {
    runOnly: {
      type: 'tag',
      // We only want to run the following tag rules. see https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags for list of tags
      values: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
    },
    ...options,
  }, logA11yResult);
});

Cypress.Commands.add('MultiChoice', (question, choices, userType = USER_TYPES.PRIMARY) => { // use for solo tests, userType = primary
  cy.task('log', `Multi Choice: ${question}: answer: ${JSON.stringify(choices)} userType: ${userType}`);
  choices.forEach((choice) => {
    cy.get(`[data-cy="${question}-${choice}-${userType}"]`)
      .click({ force: true });
  });

  cy.get('[data-cy=submit]')
    .last()
    .click({ force: true });
});
