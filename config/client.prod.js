const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const Dotenv = require('dotenv-webpack');
const PackageJson = require('../package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GLOBAL_ROUTE = require('./const').GLOBAL_ROUTE;
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const awsHelper = require('../server/aws_helper');

// Generate sourcemap for sentry, this should be false in production
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP && (process.env.GENERATE_SOURCEMAP === '1');

const PM_APP = /^PM_/i;
const SENTRY_APP = /^SENTRY_/i;
const CLIENT_VAR = /^CLIENT_/i;
// regex match for only _[KEY|SECRET|TOKEN]
// it can be anywhere in the string but not the start
const _KEY = /_KEY/;
const _SECRET = /_SECRET/;
const _TOKEN = /_TOKEN/;

const BLACKLISTED_ENV_VARS = new Set([
  "SENTRY_AUTH_TOKEN",
  "SENTRY_DEPLOY_TOKEN"
])

function getClientEnvironment() {
  console.log("Loading", Object.keys(process.env).length, "environment variables");

  const variableFilterMethod = (key) => {
    if (BLACKLISTED_ENV_VARS.has(key)) {
      return false
    }

    return PM_APP.test(key) || SENTRY_APP.test(key) || CLIENT_VAR.test(key);
  }

  const raw = Object.keys(process.env)
    .filter(variableFilterMethod)
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        /** 
         * Useful for determining whether we’re running in production mode.
         * Most importantly, it switches React into the correct mode.
         */
        NODE_ENV: process.env.NODE_ENV || 'production',
      }
    );
  /**
   * Stringify all values so we can feed into Webpack DefinePlugin
   */
  const stringified = {
    'process.env': Object.keys(raw)
      .sort() // need to sort so source maps are consistent
      .reduce((env, key) => {
        // match for _KEY, _SECRET, _TOKEN
        // if found, encode the value
        if (_KEY.test(key) || _SECRET.test(key) || _TOKEN.test(key)) {
          let modifiedKey = btoa(key);
          env[`${modifiedKey}`] = JSON.stringify(raw[key]);
        } else {
          env[key] = JSON.stringify(raw[key]);
        }
        return env;
      }, {}),
  };

  return { raw, stringified };
}

module.exports = async () => {
  try {
    // Need to fetch the environment variable before building the application because
    // environment variables are embedded during the build time. 
    // https://create-react-app.dev/docs/adding-custom-environment-variables/
    await awsHelper.fetchSecrets()
    return {
      name: 'client',
      target: 'web',
      // profile: true, // shows stats on how long it takes to build chunks
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [/node_modules[\\/]@opentelemetry/],
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { browsers: ['last 2 versions', 'not dead'] } }]
                ],
              }
            }
          },
          {
            test: /\.(js|ts|tsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.css$/,
            // REQUIRED: Extract css files into their own chunks
            use: [
              ExtractCssChunks.loader,
              'css-loader'
            ]
          },
          {
            test: /\.(png|svg|jpg|gif|ico)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 15000,
                  fallback: 'file-loader',
                }
              }
            ],
          },
          {
            test: /\.(mov|mp4)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[path][name].[ext]'
                }
              }
            ]
          },
        ]
      },
      devtool: shouldUseSourceMap ? 'source-map' : undefined,
      entry: [
        path.resolve(__dirname, './polyfills.js'),
        path.resolve(__dirname, '../src/index.js')
      ],
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 10,
          maxInitialRequests: 5,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              priority: -20,
              reuseExistingChunk: true
            }
          }
        },
      },
      output: {
        filename: `[name].[contenthash].js`,
        chunkFilename: `[name].[contenthash].js`,
        path: path.resolve(__dirname, `../build${GLOBAL_ROUTE}`),
        publicPath: `${GLOBAL_ROUTE}/`
      },
      resolve: {
        extensions: ['.js', '.ts', '.tsx']
      },
      plugins: [
        new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname, '..') }), // first remove old files from output directory 
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // skip moment's locale
        new ExtractCssChunks(),
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'production',
          BROWSER: true,
          RELEASE_VERSION: PackageJson.version,
          GLOBAL_ROUTE,
        }),
        new webpack.HashedModuleIdsPlugin(),
        // new BundleAnalyzerPlugin(), // enable to see what contributes to bundle size
        process.env.LOCAL_ENV && process.env.LOCAL_ENV === '1' && new Dotenv({
          path: './.env', // Path to .env file (this is the default)
          safe: false, // don't want to fail production deploys because of missing variables
        }),
        //Setting env variables https://webpack.js.org/plugins/define-plugin/#usage
        new webpack.DefinePlugin(getClientEnvironment().stringified),
        new StatsWriterPlugin({
          filename: "stats.json", // Default
          stats: {
            all: true
          }
        }),
        sentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: "policyme",
          // Disable source map for master branch
          project: "hd-webapp-main",
        })
      ].filter(Boolean)
    }
  } catch (err) {
    console.error('Error while fetching secret');
    console.error(err);
  }
}
