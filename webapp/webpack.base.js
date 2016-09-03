var webpack = require('webpack');
var path = require('path');

var NODE_ENV = process.env.NODE_ENV;

var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: {
    app: [
      './src/index'
    ],
    vendor: Object.keys(require("./package.json").dependencies),
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "js/[name].[chunkhash:8].js",
      publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/index.html',
      chunks: ['vendor', 'app']
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'babel!svg-react'
      },
      { test: /\.(ttf|woff|woff2)?$/,
        loader: 'file?name=fonts/[name].[hash:6].[ext]'
      },
      {
        test: /\.(png|jpg|jpeg|gif)?$/,
        loader: 'url-loader?limit=10000&name=img/[name]-[hash:6].[ext]'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
      }
    ]
  }
};
