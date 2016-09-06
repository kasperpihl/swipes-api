var webpack = require('webpack');
var path = require('path');

var NODE_ENV = process.env.NODE_ENV;

var HtmlWebpackPlugin = require('html-webpack-plugin');

 const apiRedirect = {
  target: 'http://localhost:5000',
  secure: false,
  xfwd: false
}
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
      {
        test: /\.woff2$/,
        // Inline small woff files and output them below font/.
        // Set mimetype just in case.
        loader: 'url',
        query: {
          name: 'fonts/[name].[hash:6].[ext]',
          limit: 50000,
          mimetype: 'application/font-woff'
        }
      },
      /*{ test: /\.(ttf|woff|woff2)?$/,
        loader: 'file?name=fonts/[name].[hash:6].[ext]'
      },*/
      {
        test: /\.(png|jpg|jpeg|gif)?$/,
        loader: 'url-loader?limit=50000&name=img/[name]-[hash:6].[ext]'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
      }
    ]
  },
  devServer: {
    publicPath: '/',
    port: 3000,
    progress:true,
    open: true,
    contentBase: './dist',
    inline: true,
    historyApiFallback: true,
    proxy: {
      '/v1/*': Object.assign({}, apiRedirect),
      '/socket.io/*': Object.assign({}, apiRedirect, {ws: true}),
      '/s/*': Object.assign({}, apiRedirect)
    }
  }
};
