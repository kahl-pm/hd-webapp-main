/* eslint-disable global-require */
/*
Configure of this file is influenced by this documentation
https://github.com/faceyspacey/webpack-flush-chunks/blob/master/docs/webpack-stats.md
*/
const express = require('express');
const webpack = require('webpack'); // aliased to webpack-universal
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const cookieParser = require('cookie-parser');

/* eslint-disable import/no-extraneous-dependencies */
// const compression = require('compression');
/* eslint-enable import/no-extraneous-dependencies */
const app = express();
const fs = require('fs');
const https = require('https');
const path = require('path');

// app.use(compression());

let isBuilt = false;
let PORT = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver' ? 3000 : 8080;
if (process.env.PM_IS_DOCKER !== undefined && String(process.env.PM_IS_DOCKER) === '1') {
  PORT = 3003;
}

// If running `npm run start` locally,
// change this port to 8080 if you want to start the proxy server
if (PORT === 3000) {
  const { createProxyMiddleware,
    debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
    loggerPlugin, // log proxy events to a logger (ie. console)
    errorResponsePlugin, // return 5xx response on proxy error
    proxyEventsPlugin,
  } = require('http-proxy-middleware');
  const cors = require('cors');
  // Enable CORS
  app.use(cors());

  const proxyRequestFn = (proxyReq, req, res) => {
    console.log('Received request:', req.method, req.url);

    // Set the request headers
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Accept', 'application/json');
    if (req.headers['x-skip-magic-link']) {
      proxyReq.setHeader('X-skip-magic-link', req.headers['x-skip-magic-link']);
    }
    if (req.headers['x-integration-test']) {
      proxyReq.setHeader('x-integration-test', req.headers['x-integration-test']);
    }
  };

  const proxyResultFn = (proxyRes, req, res) => {
    // Extract the 'user_jwt_token_pri' cookie from the Flask server response
    const jwtCookieIndex = proxyRes.headers['set-cookie']?.findIndex(cookie => cookie.startsWith('user_jwt_token_pri'));
    if (jwtCookieIndex > -1) {
      const jwtCookie = proxyRes.headers['set-cookie'][jwtCookieIndex];
      // Split the cookie string to modify the SameSite attribute
      const cookieParts = jwtCookie.split(';');
      let modifiedCookie = '';

      // Modify the SameSite attribute to 'None'
      for (let i = 0; i < cookieParts.length; i++) {
        if (cookieParts[i].trim().startsWith('SameSite')) {
          modifiedCookie += ' SameSite=None;';
        } else {
          modifiedCookie += cookieParts[i] + ';';
        }
      }
      proxyRes.headers['set-cookie'][jwtCookieIndex] = modifiedCookie;
    }
    if (proxyRes.headers['set-cookie']) {
      console.log('set-cookie header:', proxyRes.headers['set-cookie']);
    }
  };

  app.use('/api/global-accounts/v1/email_link/:twilioToken/validate', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-accounts/v1/email_link/dummytoken/validate`;
      }

      // fallback/default target
      return 'https://test.policyme.com/api/global-accounts/v1/email_link/dummytoken/validate';
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-accounts/v2/email/:twilioToken/validate', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-accounts/v2/email/dummytoken/validate`;
      }

      // fallback/default target
      return 'https://test.policyme.com/api/global-accounts/v2/email/dummytoken/validate';
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-accounts/v1/users', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-accounts/v1/users`;
      }

      // fallback/default target
      return 'https://test.policyme.com/api/global-accounts/v1/users';
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-accounts/v2/accounts', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-accounts/v2/accounts`;
      }

      // fallback/default target
      return 'https://test.policyme.com/api/global-accounts/v2/accounts';
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-main/v1/policy/:app_id/journey', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-main/v1/policy/${req.params.app_id}/journey`;
      }

      // fallback/default target
      return `https://test.policyme.com/api/global-main/v1/policy/${req.params.app_id}/journey`;
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-main/v2/policy/:app_id/journey', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-main/v2/policy/${req.params.app_id}/journey`;
      }

      // fallback/default target
      return `https://test.policyme.com/api/global-main/v2/policy/${req.params.app_id}/journey`;
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use('/api/global-main/v1/household_infos', createProxyMiddleware({
    router: (req) => {
      // Example: extract from custom header or query param
      const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
      console.log('router hostname:', hostname);
      if (hostname) {
        const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
        return `${protocol}://${hostname}/api/global-main/v1/household_infos`;
      }

      // fallback/default target
      return 'https://test.policyme.com/api/global-main/v1/household_infos';
    },
    changeOrigin: true,
    protocolRewrite: (req) => {
      const hostname = req.headers['x-target-host'];
      return hostname.startsWith('localhost') ? 'http' : 'https';
    },
    pathRewrite: (pathX, req) => {
      console.log('path:', pathX);
      return pathX.replace('/', '');
    },
    cookieDomainRewrite: 'localhost', // allows us to set the cookie to localhost when response is received
    on: {
      proxyReq: proxyRequestFn,
      proxyRes: proxyResultFn,
    },
    ejectPlugins: true,
    plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
    logger: console,
  }));

  app.use(
    '/api',
    createProxyMiddleware({
      router: (req) => {
        // Example: extract from custom header or query param
        const hostname = req.headers['x-target-host']; // e.g., 'cro-1578.ondemand.policyme.com'
        console.log('router hostname:', hostname);
        //  if localhost we probably have ports at the end of the hostname
        //  so we just check if the hostname starts with localhost.
        if (hostname) {
          const protocol = hostname.startsWith('localhost') ? 'http' : 'https';
          return `${protocol}://${hostname}/api`;
        }

        // fallback/default target
        return 'https://test.policyme.com/api';
      },
      changeOrigin: true,
      protocolRewrite: (req) => {
        const hostname = req.headers['x-target-host'];
        return hostname.startsWith('localhost') ? 'http' : 'https';
      },
      secure: (req) => {
        const hostname = req.headers['x-target-host'];
        return !hostname.startsWith('localhost');
      },
      pathRewrite: (pathX, req) => {
        console.log('path:', pathX);
        return pathX;
      },
      on: {
        proxyReq: proxyRequestFn,
      },
      ejectPlugins: true,
      plugins: [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin],
      logger: console,
    }),
  );
}

const done = () => {
  if (isBuilt) {
    return;
  }

  if (process.env.PM_HTTPS && process.env.PM_HTTPS === 'true') {
    const options = {
      key: fs.readFileSync(path.resolve('./key.pem')),
      cert: fs.readFileSync(path.resolve('./cert.pem')),
    };

    const server = https.createServer(options, app);

    server.listen(PORT, () => {
      isBuilt = true;
      console.log(`BUILD COMPLETE -- Listening @ https://localhost:${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      isBuilt = true;
      console.log(`BUILD COMPLETE -- Listening @ http://localhost:${PORT}`);
    });
  }
};

const getBuildTimeFromWebpackStats = (webpackStats) => {
  return Math.round(webpackStats.time / 1000);
};

// Automatically return 200 for ELB health checks
// This could be moved to libjs-utils
const healthCheckMiddleware = (req, res, next) => {
  if (req.get('User-Agent') === 'ELB-HealthChecker/2.0') {
    res.sendStatus(200);
    return;
  }
  next();
};

const startServer = async (clientConfigProd, clientStats) => {
  if (process.env.SKIP_SERVER === '1') {
    return;
  }

  const clientConfig = await clientConfigProd();
  const publicPath = clientConfig.output.publicPath;
  const outputPath = clientConfig.output.path;

  app.use(healthCheckMiddleware);
  app.use(cookieParser());
  app.use(publicPath, express.static(outputPath, { // options: https://expressjs.com/en/4x/api.html#express.static
    // immutable: true, // if set, browsers will not check max-age anymore, default to false
    // 1 year in milliseconds, we can use this high because we have a hash in the file name
    maxAge: 31536000000,
  }));

  const serverRender = require('../buildServer/main').default;
  if (clientStats === null) {
    // eslint-disable-next-line no-param-reassign, import/no-dynamic-require
    clientStats = require(path.resolve(outputPath, 'stats.json'));
  }

  app.use(serverRender({ clientStats }));

  done();
};

const startApp = async () => {
  // Note for .babelrc
  // - stage-2 preset is required to use `import`
  // - universal-import plugin is required to convert
  //   use of `universal(import('./Foo'))` into full
  //   boilerplate syntax.

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver') {
    const clientConfigDev = require('../config/client.dev');
    const serverConfig = require('../config/server.dev');

    const HOST = process.env.HOST || '0.0.0.0';

    choosePort(HOST, PORT).then(async (port) => {
      if (port == null) {
        // We have not found a port.
        return;
      }
      PORT = port;

      const clientConfig = await clientConfigDev();
      const compiler = webpack([clientConfig, serverConfig]);
      const clientCompiler = compiler.compilers[0];
      const publicPath = clientConfig.output.publicPath;
      const options = { publicPath, stats: { colors: true } };
      const devMiddleware = webpackDevMiddleware(compiler, options);

      app.use(cookieParser());

      app.use(devMiddleware);
      app.use(webpackHotMiddleware(clientCompiler));
      app.use(webpackHotServerMiddleware(compiler));

      devMiddleware.waitUntilValid(done);
    });
  } else {
    let args = [];
    if (process.argv.length > 2) {
      args = process.argv.slice(2);
      console.log('Arguments: ', args);
    }

    const clientConfigProd = require('../config/client.prod');
    const serverConfigProd = require('../config/server.prod');

    if (args.length > 0 && args[0] === 'serve') {
      startServer(clientConfigProd, null);
      return;
    }

    // This step builds the application
    const clientConfig = await clientConfigProd();
    webpack([clientConfig, serverConfigProd]).run((err, stats) => {
      const [clientStats, serverStats] = stats.toJson().children;
      if (err || stats.hasErrors()) {
        console.error(`
          Build errors: ${err} 
          Client errors: ${clientStats.errors}
          Server errors: ${serverStats.errors}
        `);
        throw new Error('Failed to create a bundle during build');
      }

      console.log(
        'Client Stats => Errors:', clientStats.errors,
        ', Built Time:', getBuildTimeFromWebpackStats(clientStats),
        'secs, Bundle Exists:', fs.existsSync(clientStats.outputPath),
      );
      console.log(
        'Server Stats => Errors:', serverStats.errors,
        ', Built Time:', getBuildTimeFromWebpackStats(serverStats),
        'secs, Bundle Exists:', fs.existsSync(serverStats.outputPath),
      );

      startServer(clientConfigProd, clientStats);
    });
  }
};

startApp();
