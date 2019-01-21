/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: isProd ? 'production' : 'development',
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
    alias: {
      // 'swiss-react': path.resolve(__dirname, '../../../swiss-react/dist/es'),
      // 'react-optimist': path.resolve(__dirname, '../../opensource/react-optimist/dist/es'),
      src: path.resolve(__dirname, 'src'),
      styles: path.resolve(__dirname, 'src/react/global-styles'),
      'swipes-core-js': '@swipesapp/core/dist',
      // 'swipes-core-js': path.resolve(
      //   __dirname,
      //   '../../packages/swipes-core-js/dist'
      // ),
      icons: path.resolve(__dirname, 'src/react/icons')
    },
    extensions: ['.js', '.scss']
  },
  entry: {
    app: './src/index',
    note: './src/react/pages/external-note-view/ExternalNoteView',
    reset: './src/react/pages/reset/Reset'
    // vendor: Object.keys(require("./package.json").dependencies),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'statics/page.html',
      chunks: ['reset', 'common'],
      filename: 'reset.html'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/page.html',
      chunks: ['note', 'common'],
      filename: 'note.html'
    }),
    new HtmlWebpackPlugin({
      template: 'statics/index.html',
      chunks: ['app', 'common']
    }),
    !isProd ? new webpack.HotModuleReplacementPlugin() : null
  ].filter(v => !!v),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        include: [
          path.join(__dirname, 'src'),
          path.resolve(__dirname, '../../workspace-mobile')
        ]
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          }
        ]
      },
      {
        test: /\.(woff)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65000
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
              name: 'img/[name]-[hash:6].[ext]'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  devServer: {
    publicPath: '/',
    port: 3000,
    host: '0.0.0.0',
    contentBase: './dist',
    inline: true,
    hot: !isProd,
    proxy: {
      '/v1/**': {
        target: 'http://localhost:5000',
        secure: false,
        xfwd: false
      }
    },
    historyApiFallback: true
  }
};
