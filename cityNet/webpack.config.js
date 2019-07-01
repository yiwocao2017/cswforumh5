var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(__dirname),
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
        root: ['babel-polyfill', "./src/js/index.js"],
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
                        'react-html-attrs',
                        ["import", [{
                            "libraryName": "antd-mobile"
                        }]]
                    ] //添加组件的插件配置
                }
            }, {
               test: /\.(svg)$/i,
               loader: 'svg-sprite',
               include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=1024'
            }, {
                test: /\.woff|eot|ttf$/,
                loader: require.resolve('file-loader') + '?name=[path][name].[ext]'
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["> 1%","ie >= 8","firefox >= 15","iOS >= 4","Android >= 4"]}'
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["> 1%","ie >= 8","firefox >= 15","iOS >= 4","Android >= 4"]}!sass-loader'
            }
        ]
    },
    output: {
        filename: '[name].[chunkHash:8].js', //注意这里，用[name]可以自动生成路由名称对应的js文件
        path: path.join(__dirname, 'build'),
        // publicPath: publicPath + '/build/',
        publicPath: 'build/',
        chunkFilename: '[name].[chunkHash:8].js'
    },
    plugins: debug
        ? [
            new HtmlWebpackPlugin({
                template: 'index.html',
                files: {
                    "js": ['root.js', 'vendor.js']
                }
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
        ]: [
            new HtmlWebpackPlugin({
                template: 'index.html',
                files: {
                    "js": ['root.js', 'vendor.js']
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.DefinePlugin({
                'process.env':{
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.NoErrorsPlugin()
        ],
};
