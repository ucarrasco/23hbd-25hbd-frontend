const dotenv = require('dotenv')
const fs = require('fs')
var path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
dotenv.config({ path: path.resolve(__dirname, './safe.env') })

if (process.env.NODE_ENV !== 'production') {
  if (!process.env.FLAVOR)
    throw `Missing process.env.FLAVOR`
  if (fs.existsSync(`./safe.env.${process.env.FLAVOR}`)) {
    const flavorConfig = dotenv.parse(fs.readFileSync(`./safe.env.${process.env.FLAVOR}`))
    for (let k in flavorConfig) {
      process.env[k] = flavorConfig[k]
    }
  }
}

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var APP_DIR = path.resolve(__dirname, 'client');
var COMMON_DIR = path.resolve(__dirname, 'common');
var BUILD_DIR = path.resolve(__dirname, 'dist');
var WEBPACK_PORT = process.env.WEBPACK_PORT || 8080;

const FLAVOR_IMPORT_REGEX = /\.hbd(\.([^.]+))?$/
const FLAVOR = process.env.FLAVOR
const flavorMatch = path => path.match(FLAVOR_IMPORT_REGEX)
const flavorReplace = path => path.replace(FLAVOR_IMPORT_REGEX, `.${FLAVOR}$1`)

const SUPPORTED_LANGUAGES = require(path.resolve(COMMON_DIR, './locales/index.js')).SUPPORTED_LANGUAGES

const sassLoaderOptions = {
  importer: function (url, prev, done) {
    if (flavorMatch(url))
      return { file: flavorReplace(url) }
    return null
  }
}

var babelOptions = {
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }],
    "@babel/preset-react"
  ],
  plugins: [
    "transform-react-pug",
    "@babel/plugin-proposal-object-rest-spread",
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["babel-plugin-styled-components", { "displayName": true, "fileName": false }],
  ]
};

var config = (env, argv) => {
  const PRODUCTION = argv.mode === 'production';
  return {
    // context: __dirname,
    entry: {
      app: path.resolve(APP_DIR, 'index.js'),
    },
    output: {
      path: BUILD_DIR,
      filename: PRODUCTION ? 'assets/javascript/[name]-[hash].js' : 'assets/javascript/[name].js',
      publicPath: "/"
    },
    resolve: {
      alias: {
        assets: path.resolve(__dirname, 'assets'),
        utils: path.resolve(APP_DIR, 'utils'),
        gql: path.resolve(APP_DIR, 'gql'),
        config: path.resolve(APP_DIR, 'config'),
        components: path.resolve(APP_DIR, 'components'),
        common: COMMON_DIR,
        styles: path.resolve(APP_DIR, 'styles'),
      }
    },
    module: {
      rules: [
        // ASSETS,
        {
          test: /\.(png|jpe?g|gif|svg|mp3)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/images/[name]-[hash].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(eot|ttf|woff|woff2|otf)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name]-[hash].[ext]'
          }
        },

        // SRC
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: babelOptions
          }
        },
        {
          test: /\.module(\.2[35]hbd)?\.(sass|scss)$/,
          use: (
            PRODUCTION
              ? [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: "css-loader",
                  options: {
                    modules: true,
                    camelCase: true,
                  }
                },
                {
                  loader: "sass-loader",
                  options: sassLoaderOptions
                }
              ]
              : [
                {
                  loader: "style-loader",
                  options: {
                    hmr: false
                  }
                },
                {
                  loader: "css-loader",
                  options: {
                    modules: true,
                    camelCase: true,
                    localIdentName: '[name]_[local]_[hash:base64:6]',
                  }
                },
                {
                  loader: "sass-loader",
                  options: sassLoaderOptions
                }
              ]
          )
        },
        {
          test: /\.(sass|scss)$/,
          exclude: /\.module(\.2[35]hbd)?\.(sass|scss)$/,
          use: (
            PRODUCTION
              ? [
                {
                  loader: MiniCssExtractPlugin.loader
                },
                { loader: "css-loader", options: { camelCase: true }},
                {
                  loader: "sass-loader",
                  options: sassLoaderOptions
                }
              ]
              : [
                { loader: "style-loader" },
                { loader: "css-loader", options: { camelCase: true }},
                {
                  loader: "sass-loader",
                  options: sassLoaderOptions
                }
              ]
          )
        },
        {
          test: /\.css$/,
          use: (
            PRODUCTION
              ? [
                {
                  loader: MiniCssExtractPlugin.loader, // "file-loader",
                  // options: {
                  //   name: 'assets/stylesheets/[name]-[hash].[ext]'
                  // }
                },
                { loader: "css-loader", options: { camelCase: true }}
              ]
              : [
                { loader: "style-loader" },
                { loader: "css-loader", options: { camelCase: true }}
              ]
          )
        },
        // {
        //   test: /\.json$/,
        //   loader: 'json-loader'
        // },
        {
          test: /\.(graphql|gql)$/,
          loader: 'graphql-tag/loader'
        },
        {
          test: /\.yml$/,
          loaders: ['json-loader', 'yaml-loader']
        },
      ]
    },
    // enabling this multiplies bundling time (hot or initial) by 3
    // see all configurations with bundle times here: https://webpack.js.org/configuration/devtool/
    devtool: PRODUCTION ? 'source-map' : 'source-map-eval',
    plugins: (
      PRODUCTION
        ? [
          new HtmlWebpackPlugin({
            chunks: ['app'],
            filename: 'app.html',
          }),
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "assets/stylesheets/[name]-[hash].css",
            chunkFilename: "[id].css"
          })
        ]
        : [
          new webpack.HotModuleReplacementPlugin()
        ]
    ).concat([
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.EnvironmentPlugin({
        'NODE_ENV': undefined,
        'RECAPTCHA_SITE_KEY': undefined,
        'SENTRY_DSN': null,
        'ACTUAL_ENV': undefined,
        'ANALYTICS_ID': null,
        'FLAVOR': undefined,
        'S3_BUCKET': undefined,
        'CLOUDFRONT_DOMAIN': null,
        'HTTP_HOST': undefined,
        'S3_PROXY': false,
        'API_ENDPOINT_URL': null,
      }),
      new webpack.NormalModuleReplacementPlugin(
        FLAVOR_IMPORT_REGEX,
        function (resource) {
          resource.request = flavorReplace(resource.request);
        }
      ),
      new webpack.ProvidePlugin({
        i18n: ["i18next", "default"],
        t: ["utils/t", "default"],
      }),
      new HtmlWebpackPlugin({
        chunks: ['app'],
        filename: 'index.html',
        // inject: true,
        // template: resolveAppPath('public/index.html'),
      }),
      // new BundleAnalyzerPlugin({
      //   defaultSizes: "gzip"
      // }),
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        new RegExp(SUPPORTED_LANGUAGES.join('|'))
      ),
    ]),
    node: {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    devServer: {
      hot: true,
      hotOnly: true,
      inline: true,
      port: WEBPACK_PORT,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  };
}

// const smp = new SpeedMeasurePlugin()
// config = smp.wrap(config)

module.exports = config;

