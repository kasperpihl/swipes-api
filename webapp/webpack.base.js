/* eslint-disable */
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
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      src: 'src',
      app: 'src/react/app',
      reducers: 'src/reducers',
      constants: 'src/constants/ActionTypes',
      'context-menus': 'src/react/context-menus',
      components: 'src/react/components',
      styles: 'src/react/global-styles',
      icons: 'src/react/icons',
      actions: 'src/actions',
      views: 'src/react/views',
      Icon: 'src/react/icons/Icon',
      SWView: 'src/react/app/view-controller/SWView',
      Button: 'src/react/components/button/Button',
      classes: 'src/classes'
    },
    extensions: ['', '.js', '.scss']
  },
  entry: {
    app: [
      './src/index'
    ],
    jira: [ './src/jira-index' ],
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
    }),
    new HtmlWebpackPlugin({
      template: 'statics/jira-auth.html',
      chunks: ['vendor', 'jira'],
      filename: 'jira-auth.html'
    }),
    new webpack.ProvidePlugin({
      "PDFJS": "pdfjs-dist",
      "window.PDFJS": "pdfjs-dist"
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
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.woff2$/,
        // Inline small woff files and output them below font/.
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
    contentBase: './dist',
    inline: true,
    proxy: {
      '/v1/**': Object.assign({}, apiRedirect),
      '/s/**': Object.assign({}, apiRedirect)
    },
    historyApiFallback: true
  }
};
