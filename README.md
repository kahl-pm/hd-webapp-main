# Overview

This project serves the Health & Dental (HD) insurance advice and application workflows. This application runs an nginx server which reverse proxies requests to a node express server running the react application. It is deployed to AWS elastic beanstalk and uses other API projects like hd-restapi-main and hd-restapi-quotes.

## Getting Started

* Download Node (v16.17.1) and NPM
* Run ```npm install``` in this project
* Run the project using: `npm run dev` or `npm run start`
* ```brew install watchman``` (for npm run test-watch)

### Dev vs Start
Dev is used for local testing and makes use of hot module swapping, linting, caching and writing files to disk, and stricter build rules for missing variables. Start is used by AWS elastic beanstalk when deploying the project and does not contain the features mentioned above for Dev. Additionally, start does not fail production deploys because of missing variables.
Both dev and start contain a BundleAnalyzerPlugin that is commented out. On uncommenting these plugins, you will be able to profile the build size of the bundle and see how much each package is contributing to the bundle.
Both dev and start make use of code splitting and server side rendering. Code splitting allows for minimal code to be passed upfront to improve page-load times, the rest of the code is loaded on demand when required. Server side rendering allows for JavaScript to be rendered on the server rather than the brower to allow for faster page load time.

### `start` vs `serve`
`start`: This command bootstraps the applications and removes files `build` and `buildServer` directory assuming that they are old files then start fresh to create and load new files. This process takes a significant time (in some cases>10 mins) to bootstrap the application. This makes this command not ideal for deploying application on the server.
`serve`: This command does everything the same as `start` except one thing that is not removing files from the `build` and `buildServer`. This command assumes that the package is freshly built via CI/CD pipeline (CircleCI) and is ready-to-run. So, it is advisable that run `npm install && npm run build` commands via CI/CD pipeline to create a ready-to-run application. This command bootstraps the application in a couple of seconds.

### Component library npm token
The project requires a npm auth token in order to install policyme's private npm packages (global-libjs-layout). You will have to input this token in your .bash_profile file. Include ```export NPM_PRIVATE_TOKEN=<TOKEN>``` in your .bash_profile file. Ask a developer for this token. Run source ~/.bash_profile after making the changes. In your user npmrc file in the root directory of the cloned repo, check that there is a line that says ```//registry.npmjs.org/:_authToken=${NPM_PRIVATE_TOKEN}```. This will get the policyme token which you previously added in your .bash_profile file. You can find your user npmrc file under ~/.npmrc in the cloned repo directory.

### Https
The project can also be run with https, use either npm run dev-https or npm run start-https to run this project with https. Make sure you add a key.pem and cert.pem to your working folder as the setup will require it.
https://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server

## Redux

The application makes use of redux for managing state. The state of the appliation is kept in the redux store which can be used by the entire application. If changes are needed to be made to the store then an action is dispatched to a reducer. The reducer handles the action and modifies the state of the application which is then passed back to the entire application.

## Developing with i18n
All strings in this project must be internationalized. We are using FormatJS + ReactIntl to help with this process. To upload/download our translation files, we are using Lokalise TMS to host all our translations.
Full translation documentation instructions here: https://policyme.atlassian.net/wiki/spaces/EN/pages/2764013571/Translation+HOW+TO

### Development process summary:
<b>Adding keys</b>

1. Write your string in a <FormattedMessage id="<page/component>.<description>.<randomid>" defaultMessage="<your string>" /> component format
2. Run `npm run extract-merge` to extract your string into `lang/en_CA.json` file.
3. Delete `defaultMessage` from your components
4. Commit your changes and push to github. (This immediately triggers a webhook in Lokalise to pull your new keys)

<b>Download translations</b>

1. Once keys are translated in Lokalise and ready for download, click `Build` in Lokalise
2. Lokalise makes a PR to the repo with the translations for `lang/fr_CA.json`
3. Once Lokalise PR is merged, we need to create another PR to compile these language files with `npm run compile-en` and `npm run compile-fr` which generates the compiled files in `compiled-lang/`

<b>Updating keys</b>

1. Editing the copy of an existing key <FormattedMessage id="quotesPage.header.abc123" />
2. Look for `quotesPage.header.abc123` in `lang/en_CA.json`.
3. Modify the copy there.
4. Generate a new 6 digit randomid for this key eg (`ng12oq`)
5. Replace `abc123` with `ng12oq` in the FormattedMessage component and in the json
6. This is to ensure there's no conflict with other copy modifications to the same key in Lokalise
7. Commit your changes and push to github. (This immediately triggers a webhook in Lokalise to pull your new keys)
8. DO NOT DELETE old key in lokalise since other releases might be still using it

## Environment Variables

These are the environment variables that should be kept in .env (dev) or Environmental Variables (prod).
**Note: None of these variables are required for dev to run.**

| Name  | Description | Required |
|---|---|---|
| PM_ENVIRONMENT | The type of environment, one of local,dev,prod,ondemand | |
| PM_FACEBOOK_PIXEL | Facebook pixel id| |
| PM_GOOGLE_MAPS_API_KEY | Api key for google maps | |
| PM_HOTJAR_ENABLED | Hotjar Enabled Boolean | |
| PM_HOTJAR_SITE_ID | The site id for hotjar tracking | |
| PM_HOTJAR_SNIPPET_VERSION | The snippet version for hotjar tracking | |
| PM_INTERCOM_APP_ID | Intercom app id | |
| PM_INTERCOM_ENABLED | Intercom enabled boolean | |
| PM_GLOBAL_MAIN_ENDPOINT | Endpoint for global-restapi-main | |
| PM_DOCUSIGN_ENDPOINT | Endpoint for global-restapi-docusign | |
| PM_HD_MAIN_ENDPOINT | Endpoint for hd-restapi-main | |
| PM_HD_QUOTES_ENDPOINT | Endpoint for hd-restapi-quotes | |
| PM_AURA_ENDPOINT | The endpoint for aura | |
| PM_ANALYTICS_ENDPOINT | The endpoint for analytics | |
| PM_ACCOUNTS_ENDPOINT | The endpoint for accounts | |
| SENTRY_AUTH_TOKEN | Sentry authorization token | |
| SENTRY_DSK | Link to organization endpoint for sentry | |
| SENTRY_ORG | Organization name under sentry | |
| SENTRY_PROJECT | Project name under sentry organization | |
| SENTRY_TRACE_SAMPLE_RATE | send sample events to sentry for tracing/profiling betwen (0-1) 10% can be 0.1|
| PM_JOINT_DISCOUNTS | Set to 1 to enable joint discounts | |
| PM_ENABLE_DEFAULT_MONTHLY_PAYMENT | Set to 1 to make all users pay monthly | |
| NPM_PRIVATE_TOKEN | NPM token to install private component library | |
| PM_INTERNAL_ENDPOINT | Set to global-restapi-internal endpoint | |
| PM_JIRA_CLIENT_ID | get from JIRA console  https://developer.atlassian.com/console/myapps/<app_id>/authorization/auth-code-grant | |
| PM_JIRA_CLIENT_SECRET | get from JIRA console https://developer.atlassian.com/console/myapps/<app_id>/authorization/auth-code-grant | |
| PM_JIRA_REDIRECT_URL | get from JIRA console https://developer.atlassian.com/console/myapps/<app_id>/authorization/auth-code-grant | |
| PM_ENABLE_ACCOUNT_DASHBOARD |  Set to 1 to enable account dashboard | |
| STRIPE_PUBLIC_KEY_PM | Get from the Stripe dashboard https://dashboard.stripe.com/test/dashboard | |
| STRIPE_LIVE_KEY_PM | Get from Stripe dashboard https://dashboard.stripe.com/dashboard | |
| STRIPE_PUBLIC_KEY_CAA | Get from the Stripe dashboard for CAA account https://dashboard.stripe.com/test/dashboard | |
| STRIPE_LIVE_KEY_CAA | Get from the Stripe dashboard for CAA account https://dashboard.stripe.com/dashboard | |
| PM_STRIPE_PUBLIC_KEY_{tenant} | Get from the Stripe dashboard https://dashboard.stripe.com/test/dashboard | |
| PM_SEGMENT_KEY_PM | Get from the Segment dashboard for PM - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAA | Get from the Segment dashboard for CAA - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAAAMA | Get from the Segment dashboard for CAAAMA - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAAATL | Get from the Segment dashboard for CAAATL - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAABCAA | Get from the Segment dashboard for CAABCAA - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAAMAN| Get from the Segment dashboard for CAAMAN - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAANEO | Get from the Segment dashboard for CAANEO - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAANIA | Get from the Segment dashboard for CAANIA - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAAQUE | Get from the Segment dashboard for CAAQUE - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAASCON | Get from the Segment dashboard for CAASCON - hd-webapp-main source | |
| PM_SEGMENT_KEY_CAASASK | Get from the Segment dashboard for CAASASK - hd-webapp-main source | |
| PM_SEGMENT_KEY_CIBC | Get from the Segment dashboard for CIBC - hd-webapp-main source | |
| PM_ENABLE_QUEBEC_PRODUCT | '1' to enable quebec product | |
| PM_ENABLE_FULLY_UW_HD | '1' to enable UW for HD | |
| PM_ONDEMAND_ENV | ondemand environment | |

## Debugging

If you're trying to test against a local version of any of the REST APIs (ie. `hd-restapi-main`), then make sure to comment out necessary URL in `src/config.js`.

If you're testing pages AFTER coming back from docusign signing, you will be redirected to `eng2|dev|test`.policyme.com. To remain local, you will need to have your network tab
open and look in the doc tab to check what URL docusign redirects you to. Switch that URL from `eng2|dev|test`.policyme.com to your localhost URL.

Debug mode can be activated in the url params to display your session id.
```
http://localhost:3000/hd?debug=1
```
The program can also be run with ```npm run dev-init```, this pre-populates the redux state with data that can be useful with testing and traversing the application.

Other useful tools for debugging include:
* Redux DevTools
* React Developer Tools
* Axe Accessibility Checker
* Page Ruler
* Browser Stack
* Facebook Pixel Helper
* Colorzilla (color picker)
* Segment Events Tracker

Debugging issues with duplicate react versions when using global-libjs-layout (this will appear as an Invalid Hook Syntax error):
https://reactjs.org/warnings/invalid-hook-call-warning.html

### IE11 Issues
* Call to googleapi for Googlemaps from server/render causes issues, shifted to HOC
* Googlemaps does not currently work on dev (should load when we reach the citizenship page)
* query_string package should not be updated to 6.*.* and above as it has compatibility issues with IE11
* webpack-hot-middleware on IE11 requires event-source-polyfill, we have added it to plugins

## Testing

### Unit Testing

[Jest.js](https://jestjs.io/) is used for unit testing.  run ```npm run test``` to run the test suite and exit, or ```npm run test-watch``` in a separate terminal from your dev server to have test results updates in real time.  ```npm run test-coverage``` launches an express server that shows how much of each file is covered by tests

NOTE: You may need to remove your local ```.yalc``` folder in order to make the test suite run properly.

### Manual Testing

Testing for this application is done manually using browser stack.
When in debug mode you can activate/deactivate ab tests which can help with testing various features.
```
http://localhost:3000/hd?debug=1&ab_test_1=yes
```

### Cypress Testing
[Cypress](https://www.cypress.io/) is used for testing the website by emulating a human going through the site.
To start the server with the appropriate NODE_ENV, run ```npm run server --nodeenv=cypressserver``` and to open the
cypress application and use a local server for testing, run ```npm run cypress-open --cypress_config=local```. <br />
To open the cypress application and use dev.policyme.com for testing run ```npm run cypress-open --cypress_config=dev```. <br/>
Once the application opens up, click on the file with the tests you want to run. <br/>

Cypress command usage:
* ```npm run server --nodeenv=[cypressserver|development|production]```
* ```npm run cypress-open --cypress_config=[local|test|dev|prod] --ab=[a|b|c]``` (`--ab` flag only required for NewProduct)

When running cypress tests, the `cypress` and `debug` flags need to be set in the url as follows
```
http://localhost:3000/hd?cypress=1&debug=1
```

This is to let docusign know to run in integration mode in order to skip past the document signing step.

The descriptions of each test case can be found here [link](cypress/README.md)

For some Cypress test cases, in order to run them fully end to end locally you may need to have accounts running locally as well. To do this, you can spin up global-webapp-accounts locally and then follow these steps:
1. In `global-webapp-accounts`, remove `secure` from the setCookie in `updateUserId` and `updateUserJwtToken`
2. In `hd-webapp-main`, add `experimentalSessionAndOrigin: true` in cypress config file, and replace the line going to the accounts URL (will look something like `cy.visit(Cypress.env('baseAccountsURL')`) with the following code:
```
cy.getCookie('user_id').then((userIdCookie) => {
	cy.getCookie('user_jwt_token').then((cookie) => {
		cy.origin(`${Cypress.env('baseAccountsURL')}`, { args: { cookie, userIdCookie } }, ({ cookie, userIdCookie }) => {

			Cypress.on('uncaught:exception', (err) => {
				return false;
			});

			cy.visit(`${Cypress.env('baseAccountsURL')}`, {
			onBeforeLoad(win) {
				win.document.cookie = `${cookie.name}=${cookie.value}; domain=localhost; path=/`;
				win.document.cookie = `${userIdCookie.name}=${userIdCookie.value}; domain=localhost; path=/`;
				},
			});
		});
	});
});
```

You should now be able to run the test case fully end to end locally with accounts working.

### Internal Testing
Run ```npm run cypress-run-internal-tool-tests-all --cypress_config=local``` to run the test cases on a local server <br/>
Run ```npm run cypress-run-internal-tool-tests-all --cypress_config=dev``` to run the test cases on dev.policyme.com <br/>

Note: If a test fails due to waiting for follow up times for internal testing on dev ( due to cypress speed most likely ),
due to another error/failure, you can
    - Rerun the command to run all tests again or
    - Run command for specific test cases

That second command can also be used to generate a single session id for a test.

When those run, check the terminal to see the session ids for the tests:
pm_TestCaseNUMBER: SESSION_ID <br/>
Cypress command usage:

* ```npm run cypress-run-internal-tool-tests-all --cypress_config=[local|test|dev|prod] --ab[a|b|c]```
* ```npm run cypress-run-internal-tool-tests-single --cypress_config=[local|test|dev|prod] --ab[a|b|c] --test=TESTCASENUMBER```


### Pre-populating your redux states
1. Run ```npm run dev-init``` to start the server with debug stores
2. Open another terminal and run ```npm run dev-debug -- [-h] [-t TEMPLATE] [-c]``` where ```-t``` is an optional flag to
preset the redux states.
```
usage: redux.js [-h] [-t TEMPLATE] [-c] [-e EMAIL]

Populate redux states script

optional arguments:
  -h, --help            show this help message and exit
  -t TEMPLATE, --template TEMPLATE
                        redux state to initialise [approved|underwriter|declined|postponed|custom]
  -c, --clear           delete latest redux state from db
  -e EMAIL, --email EMAIL
                        email address to be used for this session (default: test@policyme.com)
```
NOTE: `--` is required for npm to recognise that the args provided after it should be passed to the node script
3. For your own custom redux state, copy the redux state in redux devtools and paste it in custom.js to use that custom redux state

For more details, refer to this confluence doc: https://policyme.atlassian.net/wiki/spaces/EN/pages/1795620869/Auto+populate+redux+debug+stores+for+quick+development

### Linking with global-libjs-layout
!! NOTE delete your node_modules to ensure to start from a clean state
Example steps below use `hd-webapp-main` as the project that is importing global-libjs-layout
1. npm install from hd-webapp-main
2. npm run link-local from global-libjs-layout
3. npm link @policyme/global-libjs-layout from hd-webapp-main
4. npm run dev from hd-webapp-main
## Architecture

System architecture can be found by following this link, https://policyme.atlassian.net/wiki/spaces/EN/pages/2686977/System+Architecture.

## URLs to web apps
|URL|local|non-local
|---|---|---|
|HOMEPAGE_URL|localhost:3000|https://${SUBDOMAIN}.policyme.com
|WEBAPP_ACCOUNT_URL|localhost:3001|https://accounts.test.policyme.com

# A11y Testing
See [A11y Testing with Cypress](cypress/component/A11yTests/README.md)

### Skipping magic link running locally
* Add `PM_SKIP_MAGIC_LINK="1"` to `.env`

### Setting CAA tenant locally
* `PM_ENVIRONMENT=local`
* `LOCAL_TENANT=CAA_NATIONAL`
* `LOCAL_TENANT_ID=7abf0512-ce2f-4d1d-90c4-560742cbdfbb`
* `LOCAL_TENANT_SUBORGANIZATION=AMA`
* `LOCAL_TENANT_SUBORGANIZATION_ID=bd7692da-65d7-4a1a-a865-9cc4bcd6305d`

### What does the local proxy server do?
- When you start an app on localhost, a proxy server is also started to route all api requests through the server to the destination.
- Why is this needed? Because our auth cookies for api requests are set on the server side and are http-only, in order to allow cross-domain requests (localhost -> cro-1234.ondemand/test.policyme.com), we have to use this proxy to intercept the requests and set/forward the cookies.
- How does it affect my local development? It doesn't. You should still set your target api routes in your `.env` when you want specific services to point to your ondemand service, and the rest of the services will automatically be pointed to `test`.
- How does the proxy know whether to forward the api request to `ondemand` or `test`?
  - The middleware `fetchWithLocalProxyMiddleware` intercepts the initial api request, and grabs the host information from the original api url.
	- It adds a header `X-target-host` to the request to save the original host that the api was supposed to hit and route the request to hit the proxy server
	- Proxy server receives this api request and reads the value of `x-target-host` to know where it should forward the request to.
