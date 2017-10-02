/* eslint-disable */
'use strict';

var webpack = require('webpack');
var config = require('./webpack.base.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')


config.bail = true;
config.profile = false;
config.devtool = '#cheap-module-source-map';

config.plugins = config.plugins.concat([
  new UglifyJSPlugin({
    sourceMap: true
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
]);

module.exports = config;
