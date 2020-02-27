const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const package = require('./package.json');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, options) => {

  const build = options.mode === 'production';
  const version = package.version.substring(0, package.version.lastIndexOf('.'));

  return {
    entry: {
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: () => build ? `wf-papyrs-menu.${version}.[contenthash].js` : 'bundle.js',
      library: 'wfMenu',
      libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: "string-replace-loader",
              options: {
                search: "(\.bootstrap-wf) (html|body)",
                replace: "$1",
                flags: "g",
                strict: true
              }
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                math: 'strict'
              }
            }
          ]
        },
        {
          test: /\.js$/,
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
      new ErrorOverlayPlugin(),
      // new webpack.ProvidePlugin({
      //   renderMenu: [path.resolve('./src/index.js'), 'default']
      // }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        inject: false,
        filename: path.join(__dirname, 'build', 'index.html'),
      })
    ],
    optimization: {
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
    mode: 'production'
  };
};
