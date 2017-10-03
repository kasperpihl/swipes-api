/* eslint-disable */

var webpack = require('webpack');
var config = require('./webpack.base.js');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')


config.bail = true;
config.profile = false;
config.devtool = '#cheap-module-source-map';

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new UglifyJSPlugin({
    sourceMap: true
  })
]);

module.exports = config;
