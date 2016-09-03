'use strict';

var webpack = require('webpack');
var config = require('./webpack.base.js');

config.entry.app = [
  'webpack-dev-server/client?http://localhost:3000',
  'webpack/hot/dev-server'
].concat(config.entry.app);
config.output.filename = 'js/[name].[hash:8].js';

config.devtool = '#eval';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

// Add the hot reloader to dev environ
const currentJS = config.module.loaders[0].loaders;
config.module.loaders[0].loaders = ['react-hot-loader/webpack'].concat(currentJS)


const apiRedirect = {
  target: 'http://localhost:5000',
  secure: false,
  xfwd: false
}
config.devServer = {
  publicPath: '/',
  hot: true,
  port: 3000,
  progress:true,
  open: true,
  contentBase: './dist',
  inline: true,
  historyApiFallback: true,
  proxy: {
    '/v1*': Object.assign({}, apiRedirect),
    '/socket.io*': Object.assign({}, apiRedirect, {ws: true}),
    '/s/*': Object.assign({}, apiRedirect)
  }
}


module.exports = config;