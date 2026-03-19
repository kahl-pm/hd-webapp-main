const path = require('path')
const webpack = require('webpack')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin') // here so you can see what chunks are built
const Dotenv = require('dotenv-webpack');
const PackageJson = require('../package.json');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const awsHelper = require('../server/aws_helper');
// Uncomment this during eslint prettier phase 2
// const ESLintPlugin = require('eslint-webpack-plugin');


const GLOBAL_ROUTE = require('./const').GLOBAL_ROUTE;
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
]);

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

let entry = [
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false', // see docs - https://github.com/webpack-contrib/webpack-hot-middleware#config
  'react-hot-loader/patch',
  path.resolve(__dirname, './polyfills.js'),
  process.env.INIT_STORE === 'true' && path.resolve(__dirname, '../debug/store/index.js'),
  path.resolve(__dirname, '../src/index.js')
].filter(Boolean);

module.exports = async () => {
  try {
    // Need to fetch the environment variable before building the application because
    // environment variables are embedded during the build time.
    // https://create-react-app.dev/docs/adding-custom-environment-variables/
    await awsHelper.fetchSecrets()
    return {
      name: 'client',
      target: 'web',
      mode: 'development',
      // profile: true, // shows stats on how long it takes to build chunks
      module: {
        rules: [
          {
            test: /\.js$/,
            include: [/node_modules[\\/]@opentelemetry/],
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  ['@babel/preset-env', { targets: { browsers: ['last 2 versions', 'not dead'] } }]
                ],
                }
            }
          },
          {
            test: /\.(js|ts|tsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader?cacheDirectory=true'
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
      devtool: 'cheap-module-eval-source-map',
      // devtool: 'source-map', // this is slower but is better for debugging
      entry,
      optimization: {
        // uncomment these and comment the splitChunks to moderately increase performance and not split code
        // removeAvailableModules: false,
        // removeEmptyChunks: false,
        // splitChunks: false,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 10,
          maxInitialRequests: 5,
          automaticNameDelimiter: '~',
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
        }
      },
      output: {
        filename: `[name].js`,
        chunkFilename: `[name].chunk.js`,
        path: path.resolve(__dirname, '../build'),
        publicPath: `${GLOBAL_ROUTE}/`,
        pathinfo: false, // false to make recompile quicker
      },
      resolve: {
        extensions: ['.js', '.ts', '.tsx']
      },
      plugins: [
        new CleanWebpackPlugin(['node_modules/.cache/hard-source', 'build'], { root: path.resolve(__dirname, '..') }), // clear old cache
        new Dotenv({
          safe: true,
        }),
        // REQUIRED: We have to initialize our ExtractCssChunks plugin
        new ExtractCssChunks(),
        new webpack.LoaderOptionsPlugin({ options: {} }), // required to load eslint
        new webpack.EnvironmentPlugin({
          NODE_ENV: 'development',
          BROWSER: true,
          RELEASE_VERSION: PackageJson.version,
          GLOBAL_ROUTE,
        }),
        // new BundleAnalyzerPlugin(), // enable to see what contributes to bundle size
        new webpack.HotModuleReplacementPlugin(),
        new HardSourceWebpackPlugin(), // cache files in HD to increase performance
        new WriteFilePlugin(), // write files to disk
        //Setting env variables https://webpack.js.org/plugins/define-plugin/#usage
        new webpack.DefinePlugin(getClientEnvironment().stringified),
        new webpack.ProvidePlugin({
          "window.EventSource": ['event-source-polyfill', 'EventSourcePolyfill']
        }),
      // Uncomment this during eslint prettier phase 2
        // new ESLintPlugin({
        //   extensions: ['js','jsx','ts','tsx'],
        //   lintDirtyModulesOnly: true,
        //   failOnError: false,
        // })
      ]
    }
  } catch (err) {
    console.error('Error while fetching secret');
    console.error(err);
  }
}
