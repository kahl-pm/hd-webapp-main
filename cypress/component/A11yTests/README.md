# A11y Testing with Cypress

We are using axe-core for accessibility testing. This tool is integrated with Cypress Component Test to check for accessibility issues. While axe-core is effective in ensuring that web pages and components meet the required a11y (accessibility) standards, it is not a replacement for manual testing to guarantee full accessibility for all users. To integrate axe-core with Cypress, we use the cypress-axe package, which wraps axe-core to enable running tests in the Cypress environment. Additionally, we use axe-html-reporter to generate reports of the a11y issues found during tests. These reports are saved as HTML files in a folder called axe-report in the root directory and can be viewed in a browser. The reports are also uploaded as artifacts in CircleCI, allowing them to be reviewed within the CircleCI job.

## A11y WCAG Standards
The Web Content Accessibility Guidelines (WCAG) are a set of guidelines that are used to ensure that web content is accessible to all users. The guidelines are divided into three levels of conformance: A, AA, and AAA. WCAG currently has three levels of success criteria: A, AA, and AAA. Level A refers to the lowest level of conformance (minimum) and Level AAA is the highest (maximum). WCAG has four principles that are used to guide the development of accessible content. These principles are: Perceivable, Operable, Understandable, and Robust. [Source](https://www.deque.com/wcag/)

## How to write a11y page tests
Before writing any tests, keep the following in mind:
- Tests should be written in the `cypress/component/A11yTests` directory. Tests added outside this directory will not be executed.
- Tests currently run with the rebrand theme applied. If the page you're testing uses components that haven't been updated to the new design system, tests may fail. As part of the migration plan, we are only adding tests for pages that have been migrated to the new design system components.
- Links to relevant axe-core documentation and resources are provided at the end of this document.

## Steps to Write A11y Tests
1. Create a Cypress test in the `cypress/component/A11yTests` directory. Refer to the `IntentPage` example for guidance.
2. Render the page component using the Cypress command `cy.mountFullAppWithNavBar`. This command will render the page with the navbar and the page component you want to test. Ensure that any data your page requires from network requests or Redux states is stubbed/set as needed. This approach allows us to test the full page as it would be rendered in the user's browser, rather than testing a component in isolation.
   - Note: If your page contains interactive or dynamic elements, create different test cases for each state. For example, if a page has a modal that opens when a button is clicked, create separate test cases for the page with the modal closed and another for when it is open.
   - Always add an individual `it` test case for Desktop and Mobile viewports.
3. Run the a11y check using the `cy.runA11yCheck()` command after the page is rendered. This command runs the axe-core accessibility tests on the page and generates a report if any issues are found. The report will be saved in the `axe-report` folder in the root directory. It is an HTML file named after the test case, and can be opened in a browser to view the issues and the violated a11y rules. In CircleCI, the report is uploaded as an artifact and can be viewed in the CircleCI job.
   - **Note**: The report for a specific test case is overwritten each time the test is run and fails. Therefore, you cannot run the `cy.runA11yCheck()` command multiple times in the same test case expecting to get multiple reports. If you want to run multiple tests, create separate test cases.

## Running A11y Tests
To run the a11y tests, you can use the following commands:
- Run all a11y tests in cypress headed mode: `npm run cypress-run-ally`. You have to chose the test you want to run from the list of tests that will be displayed in the a11y folder.
- Run all a11y tests in cypress headless mode: `npm run cypress-run-ally-headless`

## Relevant links and resources
- **Cypress-axe library**: The library we use to run axe-core tests in the Cypress environment. It wraps axe-core for use in Cypress. [cypress-axe](https://www.npmjs.com/package/cypress-axe)
- **Axe-core Documentations**: https://github.com/dequelabs/axe-core/tree/develop/doc
- **Axe-core Javascript API documentation**: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md
- **Axe-core Rules and Tags**: This is a list of all the rules that axe-core uses to test for accessibility issues. Each rule has a tag that describes the type of issue it tests for. This is useful for understanding what the issue is and how to fix it. We also use these tags to filter the rules we want to run in the tests. Currently we're only running rules with the tags `wcag2a`, `wcag21a`, `wcag2aa`, `wcag21aa`, `wcag22aa`. Since we're using cypress-axe, we can filter the rules we want to run by passing the tags as an argument to the `cy.runA11yCheck()` command. See the command definition in the `cypress/component/A11yTests/A11yCommands.js` file and [cypress-axe](https://www.npmjs.com/package/cypress-axe) documentation for more information. You can find more information on rule descriptions and tags here:
  - *Axe Tags*: https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
  - *Rule Descriptions*: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- **Axe-core axe.run API**: This is the underlying API that cypress-axe uses to run the axe-core tests. [axe.run](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axerun)
- **Example Blog Post on a11y testing with cypress and axe-core**: https://timdeschryver.dev/blog/setting-up-cypress-with-axe-for-accessibility#assert-a-pages-accessibility
