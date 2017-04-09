const webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
  resolve: {
    modules: ['node_modules', './dev/scripts']
  },
  entry: {
    'views/init': resolve('./dev/scripts/init.js'),
    'public/scripts/polyfill': resolve('./dev/scripts/polyfill.js'),
    'public/scripts/main': resolve('./dev/scripts/main.js')
  },
  output: {
    path: resolve('.'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  }
};
