const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GLOBAL_ROUTE = require('./const').GLOBAL_ROUTE;
const WriteFilePlugin = require('write-file-webpack-plugin') // here so you can see what chunks are built

const res = p => path.resolve(__dirname, p)

const entry = res('../server/render.js')
const output = res('../buildServer')
const nodeModules = res('../node_modules')

// taken from react universal demo, resolves can only import one babel-polyfill issue
const externals = fs
  .readdirSync(nodeModules)
  .filter(x => !/\.bin|react-universal-component|webpack-flush-chunks/.test(x))
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`
    return externals
  }, {})

module.exports = {
  name: 'server',
  target: 'node',
  mode: 'development',
  entry: [entry],
  externals,
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
        exclude: [/node_modules\/(?!swiper).*/],
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
    new Dotenv({
      safe: true,
    }),
    new WriteFilePlugin(),
    new CleanWebpackPlugin(['buildServer'], { root: path.resolve(__dirname, '..') }), // first remove old files from output directory 
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      BROWSER: false,
      // PM_GOOGLE_MAPS_API_KEY: process.env.PM_GOOGLE_MAPS_API_KEY,
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
  ]
}
