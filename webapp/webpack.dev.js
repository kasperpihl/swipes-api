/* eslint-disable */
const webpack = require('webpack');
const config = require('./webpack.base.js');

config.entry.app = [
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/dev-server',
].concat(config.entry.app);
config.output.filename = 'js/[name].[hash:8].js';

config.devtool = '#eval';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
]);

// Add the hot reloader to dev environ
const currentJS = config.module.loaders[0].loaders;
config.module.loaders[0].loaders = ['react-hot-loader/webpack'].concat(currentJS); //.concat(['eslint-loader']);
config.devServer.hot = true;


module.exports = config;
