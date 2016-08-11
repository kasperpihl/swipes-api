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


module.exports = {
  context: __dirname + '/app',
  devtool: 'eval',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './scripts/index'
    ],
    vendor: Object.keys(require("./package.json").dependencies),
    sdk: './scripts/classes/sdk/swipes-sdk-init' // The SDK for the tile-loader
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "scripts/[name].[hash:8].js",
      publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/tile.html',
      chunks: ['sdk']
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
        loaders: [ 'react-hot', 'babel?' + babelOptions ],
        exclude: /node_modules/,
        include: path.join(__dirname, 'app/scripts')

      },
      {
        test: /\.(svg)$/,
        loader: 'babel?' + babelOptions + '!svg-react' //'file?name=img/[name]-[hash:6].[ext]'
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
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