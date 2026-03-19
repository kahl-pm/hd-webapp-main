import React from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';
// import { flushToHTML } from 'styled-jsx/server';
import { StaticRouter } from 'react-router';
import { createIntl, createIntlCache } from 'react-intl';
import { Provider } from 'react-redux';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { server, LOCALE, rollABTestBand, sentryError, sentryFatalError } from '@policyme/global-libjs-utils';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import App from '../src/App';
import { createNewStore } from '../src/store';
import { OptanonWrapper } from './minified_ssr_fuctions';
import getMetadata from './metadata';
import { GLOBAL_ROUTE } from '../config/const';
import { parseQueryParams } from '../src/store/helpers';
import { initABTestBand } from '../src/NewActions/metadata';
import { userConsentToTracking, getABTestBandCookie } from '../src/utils/helpers';
import { mapTenantToPublicKeys } from './public_keys';
import { handleRenderError } from './error';
import enMessages from '../lang/en_CA.json';
import frMessages from '../lang/fr_CA.json';
import { TENANT_TEXT_KEYS } from '../src/tenant/consts';
import tenantMessages from '../src/tenant/tenantKeys';
import { PM_ENVIRONMENT } from '../src/config';

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/api/#createintl
const cache = createIntlCache();
// https://github.com/formatjs/formatjs/issues/1441
const enIntl = createIntl({
  locale: LOCALE.EN_CA,
  messages: enMessages,
}, cache);

const frIntl = createIntl({
  locale: LOCALE.FR_CA,
  messages: frMessages,
}, cache);

// This gets the clientStats from webpackHotServerMiddleware, you can see a
// middleware is returned which then sends the html response.
// For prod you'd pass in the clientStats manually after building with webpack.
const getInitialLocationChangeAction = (pathname) => {
  return {
    type: '@@router/LOCATION_CHANGE',
    payload: {
      location: {
        pathname,
        search: '',
        hash: '',
        key: '',
      },
      action: 'POP',
      isFirstRendering: false,
    },
  };
};

/**
 * Determines the data domain ID for a tenant based on the tenant information and request hostname.
 * @param {Object} tenantInfo - The tenant information object,
 * which may include suborg and consent details.
 * @param {Object} req - The HTTP request object, containing the hostname property.
 * @returns {string} - The data domain ID, adjusted for the environment (e.g., production or test).
 */
export function getDataDomainId(tenantInfo, req) {
  let dataDomainId;
  const isVieSanteTenant = req.hostname.includes('vie-sante');
  const isCroixBleueTenant = req.hostname.includes('croixbleue');

  if (tenantInfo?.suborg) {
    if (isVieSanteTenant) {
      if (!tenantInfo.suborg.consent?.oneTrust?.alternateDataDomainId) {
        sentryFatalError('No alternate data domain id found for vie-sante suborg', { tenantInfo });
      } else {
        dataDomainId = tenantInfo.suborg.consent?.oneTrust?.alternateDataDomainId;
      }
    } else {
      dataDomainId = tenantInfo.suborg.consent?.oneTrust?.dataDomainId;
    }
  } else if (isCroixBleueTenant) {
    if (!tenantInfo.consent?.oneTrust?.alternateDataDomainId) {
      sentryFatalError('No alternate data domain id found for croixbleue tenant', { tenantInfo });
    } else {
      dataDomainId = tenantInfo.consent?.oneTrust?.alternateDataDomainId;
    }
  } else {
    dataDomainId = tenantInfo.consent?.oneTrust?.dataDomainId;
  }

  if (!dataDomainId) {
    sentryFatalError('No data domain id found for tenant, be warned that analytics will not work', { tenantInfo });
  }

  dataDomainId = PM_ENVIRONMENT === 'prod' ? dataDomainId : `${dataDomainId}-test`;
  return dataDomainId;
}

export default ({ clientStats }) => (req, res) => {
  const lang = (req.get('Accept-Language') ?? '').split(',')[0];
  let intl = enIntl;
  if (lang === 'fr-CA' || lang === 'fr') {
    intl = frIntl;
  }

  const localPath = req.path.substring(GLOBAL_ROUTE.length);
  const store = createNewStore();
  store.dispatch(getInitialLocationChangeAction(localPath));

  if (process.env.BROWSER) {
    parseQueryParams(store, req.query, req.cookies);

    const state = store.getState();

    const cookieBand = getABTestBandCookie(req.cookies);
    const testBand = cookieBand ?? rollABTestBand(state.metadata.disableABTestFlag);
    store.dispatch(initABTestBand(testBand));
  }

  const tenantInfo = server.getTenantInfo(req.hostname);
  if (!tenantInfo) {
    // No tenant means we can't render a site
    handleRenderError(res, `Unable to find tenant for hostname ${req.hostname}`);
    return;
  }

  const context = {}; // This is required for StaticRouter but currently not used
  const app = ReactDOM.renderToString(<Provider store={store}>
    <StaticRouter location={localPath} context={context}>
      <App theme={server.getTenantTheme(tenantInfo)} />
    </StaticRouter>
  </Provider>);
  const helmet = Helmet.renderStatic();
  // const chunkNames = flushChunkNames();
  const chunkNames = flushChunkNames();
  const {
    js,
    styles,
    cssHash,
  } = flushChunks(clientStats, {
    chunkNames,
  });
  // const styledJSXStyles = flushToHTML();

  // const {
  //   js,
  //   styles,
  //   cssHash,
  //   scripts,
  //   stylesheets,
  // } = flushChunks(clientStats, { chunkNames });
  const metadata = getMetadata();

  // console.log('PATH', req.path);
  // console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames);
  // console.log('SCRIPTS SERVED', scripts);
  // console.log('STYLESHEETS SERVED', stylesheets);
  // console.log(styledJSXStyles);
  // console.log(flushToHTML);

  const tenantScript = server.getTenantInjectionScript(
    req.hostname,
    tenantInfo,
    mapTenantToPublicKeys,
  );
  const favicon = server.getTenantFavicon(tenantInfo);

  const tenantFontLinkHrefs = tenantInfo.font?.fontLinkHrefs || [];
  const tenantFontLinks = tenantFontLinkHrefs
    .map(tenantFontLinkHref => `<link href="${tenantFontLinkHref}" rel="stylesheet">`)
    .join('\n');
  const tenantFontBase64 = tenantInfo.font?.fontBase64 ?? '';

  let pageTitle;
  try {
    pageTitle = intl.formatMessage(tenantMessages[`${tenantInfo.code}_${TENANT_TEXT_KEYS.PAGE_TITLE}`]);
  } catch (e) {
    sentryError('Error getting tenant based formatted text', e, { tenantInfo });
    pageTitle = '';
  }
  let dataDomainId = getDataDomainId(tenantInfo, req);

  const result = `<!doctype html>
  <html lang="en">
    <head>
    ${dataDomainId ? `<!-- OneTrust Cookies Consent Notice start for ${dataDomainId} -->
      <script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"  type="text/javascript" charset="UTF-8" data-domain-script="${dataDomainId}" ></script>
      <script type="text/javascript">
        ${OptanonWrapper}
      </script>
      <!-- OneTrust Cookies Consent Notice end for ${dataDomainId} -->` : ''}

      <!-- Segment Analytics Consent Wrapper -->
      ${dataDomainId ? `<script src="https://cdn.jsdelivr.net/npm/@segment/analytics-consent-wrapper-onetrust@latest/dist/umd/analytics-onetrust.umd.js"></script>` : ''}
      <!-- Segment Analytics Consent Wrapper end -->
      ${userConsentToTracking() ? `<!-- Google Tag Manager -->
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-WK74TX8');</script>
      <!-- End Google Tag Manager -->` : ''}

      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <meta name="robots" content="noindex">
      <link rel='icon' href=${favicon} type='image/x-icon'></link>
      <link rel="shortcut icon" href=${favicon}></link>
      <link rel="icon" type="image/png" href=${favicon}></link>
      <link rel="apple-touch-icon" href=${favicon}></link>
      <link rel="mask-icon" href=${favicon} color="#141516"></link>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     
      ${tenantFontLinks || ''}
      <title>${pageTitle}</title>
      ${helmet.link.toString()}
      ${metadata}
      ${styles}
      ${tenantFontBase64 && `<style>${tenantFontBase64}</style>`}
    </head>
    <body>
      ${tenantScript}
      <div id="root">${app}</div>
      ${cssHash}
      <script type='text/javascript' src='${GLOBAL_ROUTE}/environment.js?v=2' defer='defer'></script>
      ${js}
    </body>
  </html>`;

  res.header({
    'Cache-Control': 'no-cache', // tell the browser to at minimum verify this file has not changed before using cache
  });

  res.send(
    result,
  );
};
