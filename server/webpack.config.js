var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
  
module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: './index',
  target: 'node',
  externals: nodeModules,
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel-loader' ],
        exclude: /node_modules/
      }
    ]
  }
};
