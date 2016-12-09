const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: './js/',
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.svg$/, loader: 'url-loader' },
    ],
  },
};
