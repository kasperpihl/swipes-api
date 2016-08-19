var webpack = require('webpack');
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

const apiRedirect = {
  target: 'http://localhost:5000',
  secure: false,
  xfwd: false
}
const babelOptions = JSON.stringify({ 
  presets: ['es2015', 'react']
});

module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    vendor: Object.keys(require("./package.json").dependencies),
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "js/[name].[hash:8].js",
      publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/index.html',
      chunks: ['vendor', 'app']
    }),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot-loader/webpack', 'babel?' + babelOptions ],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.svg$/,
        loader: 'babel?' + babelOptions + '!svg-react'
      },
      { test: /\.(ttf|woff|woff2)$/,
        loader: 'file?name=fonts/[name].[hash:6].[ext]'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000&name=img/[name]-[hash:6].[ext]'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
      }
    ]
  },
  devServer:{
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
};