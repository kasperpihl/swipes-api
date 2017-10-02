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
    modules: [ path.join(__dirname, 'node_modules') ],
    alias: {
      src: path.resolve(__dirname, 'src'),
      app: path.resolve(__dirname, 'src/react/app'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      constants: path.resolve(__dirname, 'src/constants/ActionTypes'),
      'context-menus': path.resolve(__dirname, 'src/react/context-menus'),
      compatible: path.resolve(__dirname, 'src/react/browser-compatible'),
      components: path.resolve(__dirname, 'src/react/components'),
      styles: path.resolve(__dirname, 'src/react/global-styles'),
      'swipes-core-js': path.resolve(__dirname, 'src/../../mobile/swipes-core-js'),
      icons: path.resolve(__dirname, 'src/react/icons'),
      actions: path.resolve(__dirname, 'src/actions'),
      views: path.resolve(__dirname, 'src/react/views'),
      Icon: path.resolve(__dirname, 'src/react/icons/Icon'),
      SWView: path.resolve(__dirname, 'src/react/app/view-controller/SWView'),
      Button: path.resolve(__dirname, 'src/react/components/button/Button'),
      classes: path.resolve(__dirname, 'src/classes')
    },
    extensions: ['.js', '.scss']
  },
  entry: {
    app: './src/index',
    jira: './src/jira-index',
    note: './src/react/pages/external-note-view/ExternalNoteView',
    reset: './src/react/pages/reset/Reset',
    // vendor: Object.keys(require("./package.json").dependencies),
  },
  output: {
      path: path.join(__dirname, 'dist'),
      filename: "js/[name].[chunkhash:8].js",
      publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'statics/page.html',
      chunks: ['reset'],
      filename: 'reset.html'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/page.html',
      chunks: ['jira'],
      filename: 'jira-auth.html'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/page.html',
      chunks: ['note'],
      filename: 'note.html'
    }),

    new HtmlWebpackPlugin({
      template: 'statics/index.html',
      chunks: ['app']
    }),


  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        include: [ path.join(__dirname, 'src'), path.resolve(__dirname, '../mobile/swipes-core-js')]
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [ 'babel-loader', {
          loader: 'react-svg-loader',
          options: {
            jsx: true
          }
        } ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        // Inline small woff files and output them below font/.
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:6].[ext]'
          }
        }],
      },
      /*{ test: /\.(ttf|woff|woff2)?$/,
        loader: 'file?name=fonts/[name].[hash:6].[ext]'
      },*/
      {
        test: /\.(png|jpg|jpeg|gif)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 50000,
            name: 'img/[name]-[hash:6].[ext]'
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: '> 1%'
            }
          }
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: '> 1%'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
            }
          }
        ],
      }
    ]
  },
  devServer: {
    publicPath: '/',
    port: 3000,
    contentBase: './dist',
    inline: true,
    proxy: {
      '/v1/**': Object.assign({}, apiRedirect),
      '/s/**': Object.assign({}, apiRedirect)
    },
    historyApiFallback: true
  }
};
