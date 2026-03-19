const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const res = p => path.resolve(__dirname, p)

const GLOBAL_ROUTE = require('./const').GLOBAL_ROUTE;
const entry = res('../server/render.js')
const output = res('../buildServer')

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [entry],
  output: {
    path: output,
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    publicPath: `${GLOBAL_ROUTE}/`,
  },
  module: {
    rules: [
      {
        test: /\.(m?js|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        exclude: [/node_modules\/(?!@swiper).*/],
        use: ['style-loader', 'css-loader'],
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
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.mjs']
  },
  plugins: [
    process.env.LOCAL_ENV && process.env.LOCAL_ENV === '1' && new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      safe: false, // don't want to fail production deploys because of missing variables
    }),
    new CleanWebpackPlugin(['buildServer'], { root: path.resolve(__dirname, '..') }), // first remove old files from output directory 
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      BROWSER: false,
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
  ].filter(Boolean)
}
