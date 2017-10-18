const { join, resolve } = require("path")

const constants = require("./webpack.constants")
const colors = require("colors")
const _ = require("lodash")

const webpack = require("webpack")
const jsonImporter = require("node-sass-json-importer")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const postcssEasings = require("postcss-easings")

module.exports = env => {
  const isDev = !!env.dev
  const isProd = !!env.prod
  const isTest = !!env.test

  const DefineENV = new webpack.DefinePlugin(
    Object.assign({}, require("dotenv").config(), {
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
    const CSS_LOADERS = {
      css: {
        loader:
          "css-loader?importLoader=1&localIdentName=[name]__[local]___[hash:base64:5]&modules=true&url=false!postcss-loader",
      },
      scss: {
        loader: "css-loader?url=false!sass-loader",
        options: {
          importer: jsonImporter,
        },
      },
    }

    let _l = Object.keys(CSS_LOADERS).map(ext => {
      const extLoaders = CSS_LOADERS[ext]
      const loader = isDev
        ? `style-loader!${extLoaders.loader}`
        : ExtractTextPlugin.extract({ use: `${extLoaders.loader}` })
      return _.omitBy(
        {
          loader,
          exclude: /node_modules/,
          test: new RegExp(`\\.(${ext})$`),
        },
        _.isNil
      )
    })
    console.log(colors.yellow(`-- Css Loaders --`))
    console.log(_l)
    console.log(colors.yellow(`--  --`))
    return _l
  }

  return {
    entry: {
      app: "./js/index.jsx",
      vendor: ["react", "redux", "redux-saga", "immutable", "lodash"],
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
        resolve(`${constants.JS_SRC_DIR}`, "modules"),
        resolve(`${constants.JS_SRC_DIR}`, "mediators"),
        resolve(`${constants.JS_SRC_DIR}`, "reducers"),
        resolve(`${constants.JS_SRC_DIR}`, "routes"),
        resolve(`${constants.JS_SRC_DIR}`, "store"),
        resolve(`${constants.JS_SRC_DIR}`, "selectors"),
        resolve(`${constants.JS_SRC_DIR}`, "sagas"),
        resolve(`${constants.JS_SRC_DIR}`, "utils"),

        resolve(
          join(
            `${constants.JS_SRC_DIR}`,
            "containers",
            "AppPageContainer"
          ),
          "orchard"
        ),

        resolve(
          join(
            `${constants.JS_SRC_DIR}`,
            "containers",
            "AppPageContainer",
            "orchard"
          ),
          "threeScene"
        ),

        resolve(
          join(
            `${constants.JS_SRC_DIR}`,
            "containers",
            "AppPageContainer",
            "orchard"
          ),
          "videoPlayer"
        ),

        resolve(
          join(
            `${constants.JS_SRC_DIR}`,
            "containers",
            "AppPageContainer",
            "orchard"
          ),
          "orchardModels"
        ),
      ],
      /*
alias: {
      }*/
    },
    module: {
      /*rules: [{
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader'
        ]
      }],*/
      loaders: [
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          loader: "svg-inline-loader",
        },
        {
          loader: "url-loader?limit=100000",
          exclude: /node_modules/,
          test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          include: [`${join(constants.ASSETS_DIR, "/font/")}`],
        },
        {
          test: /\.json$/,
          exclude: /node_modules/,
          loader: "json-loader",
        },
        {
          test: /\.(js|jsx)$/,
          loader: "babel-loader",
          exclude: /node_modules(?!\/dis-gui)/,
        },
        {
          test: /\.sss$/,
          loader: "css-object-loader!postcss-loader",
          exclude: /node_modules/,
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
          filename: "css/[name].css",
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
        new UglifyJSPlugin({
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
          postcss: {
            options: {
              config: {
                path: "./postcss.config.js",
                ctx: {
                  options: {
                    map: isDev,
                    parser: "sugarss",
                  },
                },
              },
            },
          },
        },
      }),
    ]),
  }
}
