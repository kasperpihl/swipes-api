/* eslint-disable */
var webpack = require('webpack');
var config = require('./webpack.base.js');

config.entry.app = [
  'react-hot-loader/patch',
].concat(config.entry.app);
config.output.filename = 'js/[name].[hash:8].js';

config.devtool = '#eval';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);

config.devServer.hot = true;


module.exports = config;
