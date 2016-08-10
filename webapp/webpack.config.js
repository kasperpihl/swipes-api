var webpack = require('webpack');
var path = require('path')

module.exports = {
  context: __dirname + '/app',
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './scripts/index'
  ],
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "bundle.js",
      publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot', 'babel?' + JSON.stringify({ presets: ['es2015', 'stage-0', 'react'] }) ],
        exclude: /node_modules/,
        include: path.join(__dirname, 'app/scripts')

      },
      {
        test: /\.(svg)$/,
        loader: 'file?name=img/[name]-[hash:6].[ext]'
      }
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        loader: 'url-loader?limit=10000&name=img/[name]-[hash:6].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
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
    contentBase: './dist',
    inline: true,
    historyApiFallback: true
  }
};