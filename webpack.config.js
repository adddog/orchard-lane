const { join, resolve } = require("path")

const constants = require("./webpack.constants")
const colors = require("colors")
const _ = require("lodash")

const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const postcssEasings = require("postcss-easings")

module.exports = env => {
  const isDev = !!env.dev
  const isProd = !!env.prod
  const isDebug = !!process.env.DEBUG
  const isTest = !!env.test

  const DefineENV = new webpack.DefinePlugin(
    Object.assign({}, require("dotenv").config(), {
      "process.env.DEV": isDev,
      "process.env.IPEDS": "'9228723'",
      "process.env.ASSET_URL":
        "'https://storage.googleapis.com/orchard-lane/'",
      "process.env.CMS_API_HOST": "'http://localhost:3000/'",
      "process.env.NODE_ENV": isProd
        ? "'production'"
        : "'development'",
      "process.env.DEV": isDev,
      "process.env.OFFLINE": true,
    })
  )

  console.log("--------------")
  console.log(colors.blue(`isDev: ${isDev}`))
  console.log(colors.blue(`isProd: ${isProd}`))
  console.log("--------------")
  const addPlugin = (add, plugin) => (add ? plugin : undefined)
  const ifDev = plugin => addPlugin(env.dev, plugin)
  const ifProd = plugin => addPlugin(env.prod, plugin)
  const ifNotTest = plugin => addPlugin(!env.test, plugin)
  const removeEmpty = array => array.filter(i => !!i)

  const stylesLoaders = () => {
    const CSS_LOADERS = isProd
      ? [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    modules: true,
                    url: false,
                    localIdentName: "[name]__[local]",
                  },
                },
                "postcss-loader",
              ],
            }),
          },
        ]
      : [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  url: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  importLoaders: 1,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: isDev,
                },
              },
            ],
          },
        ]

    console.log(colors.yellow(`-- Css Loaders --`))
    console.log(CSS_LOADERS)
    console.log(colors.yellow(`--  --`))
    return CSS_LOADERS
  }

  return {
    entry: {
      app: `${constants.SRC_DIR}/js/index.jsx`,
      vendor: ["immutable", "lodash", "react", "redux", "redux-saga"],
    },
    node: {
      dns: "mock",
      net: "mock",
    },
    output: {
      filename: "bundle.[name].[hash].js",
      path: resolve(__dirname, constants.DIST),
      publicPath: "",
      pathinfo: !env.prod,
    },
    context: constants.SRC_DIR,
    devtool: env.prod ? "source-map" : "eval",
    devServer: {
      host: "0.0.0.0",
      stats: {
        colors: true,
      },
      contentBase: resolve(__dirname, constants.DIST),
      historyApiFallback: !!env.dev,
      port: 8081,
    },
    bail: env.prod,
    resolve: {
      extensions: [".js", ".jsx"],
      modules: [
        constants.NODE_MODULES_DIR,
        resolve(`${constants.JS_SRC_DIR}`),
        resolve(`${constants.JS_SRC_DIR}`, "actions"),
        resolve(`${constants.JS_SRC_DIR}`, "components"),
        resolve(`${constants.JS_SRC_DIR}`, "containers"),
        resolve(`${constants.JS_SRC_DIR}`, "containers/AppPageContainer/orhard/orchardModels"),
        resolve(`${constants.JS_SRC_DIR}`, "modules"),
        resolve(`${constants.JS_SRC_DIR}`, "mediators"),
        resolve(`${constants.JS_SRC_DIR}`, "reducers"),
        resolve(`${constants.JS_SRC_DIR}`, "routes"),
        resolve(`${constants.JS_SRC_DIR}`, "store"),
        resolve(`${constants.JS_SRC_DIR}`, "selectors"),
        resolve(`${constants.JS_SRC_DIR}`, "sagas"),
        resolve(`${constants.JS_SRC_DIR}`, "utils"),
        resolve(`${constants.JS_SRC_DIR}`, "api"),
      ],
    },
    node: {
      fs: "empty",
      child_process: "empty",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
          },
        },
      ].concat(stylesLoaders()),
    },
    plugins: removeEmpty([
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(
        new HtmlWebpackPlugin({
          template: "./index.html",
        })
      ),
      ifProd(
        new HtmlWebpackPlugin({
          assetsUrl: `""`,
          template: "./index.ejs", // Load a custom template (ejs by default see the FAQ for details)
        })
      ),
      ifProd(
        new ExtractTextPlugin({
          filename: "css/main.css",
          disable: false,
          allChunks: true,
        })
      ),
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          quiet: true,
        })
      ),
      ifProd(
        isDebug
          ? undefined
          : new UglifyJSPlugin({
              sourceMap: true,
              compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
              },
            })
      ),
      DefineENV,
      ifNotTest(
        new webpack.optimize.CommonsChunkPlugin({
          name: "vendor",
        })
      ),
      ifNotTest(
        new webpack.optimize.CommonsChunkPlugin({
          name: "common",
          fileName: "bundle.common.js",
        })
      ),
      new webpack.LoaderOptionsPlugin({
        context: __dirname,
        options: {
          sassLoader: {
            assetsUrl: `""`,
            includePaths: [
              join(constants.CSS_SRC_DIR),
              join(constants.CSS_SRC_DIR, "vars"),
              join(constants.CSS_SRC_DIR, "site"),
            ],
          },
        },
      }),
    ]),
  }
}
