var webpack = require('webpack');
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

const apiRedirect = {
  target: 'http://localhost:5000',
  secure: false,
  xfwd: false
}
const babelOptions = JSON.stringify({ 
  presets: ['es2015', 'react']
});
// Awesome code to load all depencies, put in vendor
// Object.keys(require("./package.json").dependencies)

module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux'],
    tileLoader: './src/tile-loader',
    sdk: './src/classes/sdk/swipes-sdk-init' // The SDK for the tile-loader
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
      template: 'statics/tile.html',
      filename: 'tile.html',
      chunks: ['vendor', 'tileLoader','sdk']
    }),
    new HtmlWebpackPlugin({
      template: 'statics/index.html',
      chunks: ['vendor', 'app']
    }),
    new webpack.HotModuleReplacementPlugin()
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
    contentBase: './dist',
    inline: true,
    historyApiFallback: true,
    proxy: {
      '/v1*': Object.assign({}, apiRedirect),
      '/socket.io*': Object.assign({}, apiRedirect, {ws: true}),
      '/workflows*': Object.assign({}, apiRedirect),
      '/s/*': Object.assign({}, apiRedirect)
    }
  }
};