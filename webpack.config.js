const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const webpack = require('webpack');

const package = require('./package.json');

require('dotenv').config();

module.exports = (env, options) => {

  const build = options.mode === 'production'
  const version = package.version

  return {
    entry: {
      app: './src/index.js'
    },
    devtool: build ? false : 'cheap-module-source-map',
    devServer: {
      host: 'localhost',
      port: 3000,
      open: true,
      historyApiFallback: {
        index: '/'
      },
      contentBase: path.resolve(__dirname, 'public')
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: () => build ? `wf-papyrs-library.${version}.[contenthash].js` : 'bundle.js',
      library: 'wfLibrary',
      libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: "string-replace-loader",
              options: {
                search: "(\.bootstrap-wf) (html|body)",
                replace: "$1",
                flags: "g"
              }
            },
            {
              loader: 'sass-loader', // compiles SCSS to CSS
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.MENU_YML_URL': JSON.stringify(process.env.MENU_YML_URL)
      }),
      new CopyWebpackPlugin([
        { from: 'menu.yml' }
      ]),
      new ErrorOverlayPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        inject: false,
        filename: path.join(__dirname, 'build', 'index.html'),
      }),
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: true,
            mangle: true,
            output: {comments: false}
          }
        })
      ]
    },
    performance: {
      maxEntrypointSize: 650000,
      maxAssetSize: 650000
    },
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  };
};
