/* eslint-disable */
const webpack = require('webpack');
const config = require('./webpack.base.js');

config.entry.app = [
  'react-hot-loader/patch',
].concat(config.entry.app);
config.output.filename = 'js/[name].[hash:8].js';

config.devtool = '#eval';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);

// Add the hot reloader to dev environ
const currentJS = config.module.rules[0].use;
// config.module.rules[0].use = ['react-hot-loader'].concat(currentJS); //.concat(['eslint-loader']);
config.devServer.hot = true;


module.exports = config;
