const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(m?js|ts|jsx|tsx)$/,
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
              limit: 30000,
              fallback: 'file-loader',
            },
          },
        ],
      },
      {
        test: /\.(mov|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.css', '.mjs', '.tsx'],
  },
};
