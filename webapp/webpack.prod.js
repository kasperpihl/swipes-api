/* eslint-disable */
'use strict';

var webpack = require('webpack');
var config = require('./webpack.base.js');


config.bail = true;
config.profile = false;
config.devtool = '#cheap-module-source-map';

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true
    }
  })
]);

module.exports = config;
