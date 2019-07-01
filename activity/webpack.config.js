var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];

module.exports = {
    context: path.join(__dirname),
    devtool: debug
        ? "inline-sourcemap"
        : null,
    entry: {
        root: [
            'babel-polyfill', "./src/js/index.js"
        ],
        vendor: ['react']
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        'react', 'latest', 'es2016', 'es2015', "stage-0"
                    ],
                    plugins: [
                        // 'transform-object-assign',
                        'react-html-attrs',
                        [
                            "import",
                            [
                                {
                                    "libraryName": "antd-mobile"
                                }
                            ]
                        ]
                    ] //添加组件的插件配置
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"]}'
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"]}!sass-loader'
            }, {
               test: /\.(svg)$/i,
               loader: 'svg-sprite',
               include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            }, {//woff|woff2|eot|ttf|svg
                test: /\.(png|jpg|gif)$/,
                // test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=8192'
            }, {
                test: /\.woff|eot|ttf$/,
                loader: require.resolve('file-loader') + '?name=[path][name].[ext]'
            }
        ]
    },
    // output: {
    //   path: __dirname,
    //   filename: "./src/bundle.js"
    // },
    output: {
        filename: '[name].js', //注意这里，用[name]可以自动生成路由名称对应的js文件
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
        chunkFilename: '[name].js' //注意这里，用[name]可以自动生成路由名称对应的js文件
    },
    // resolve: {
    //     extensions: ['', '.js', '.jsx'],
    //     alias: {
    //       'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    //     }
    // },
    plugins: debug
        ? [
            // new webpack.ProvidePlugin({
            //     Promise: 'bluebird'
            // }),
            //
            // new webpack.NormalModuleReplacementPlugin(/es6-promise$/, 'bluebird'),
            // new webpack.ProvidePlugin({Promise: 'es6-promise'}),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
          ]
        : [
            // new webpack.ProvidePlugin({Promise: 'es6-promise'}),
            // new webpack.ProvidePlugin({
            //     Promise: 'bluebird'
            // }),
            // new webpack.NormalModuleReplacementPlugin(/es6-promise$/, 'bluebird'),
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
              'process.env':{
                'NODE_ENV': JSON.stringify('production')
              }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
            // new webpack.optimize.CommonsChunkPlugin({names: ['vendor'], filename: 'vendor.js'})
        ],
};
