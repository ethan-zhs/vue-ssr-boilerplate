const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const base = require('./webpack.base.config')
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
    entry: {
        app: path.join(__dirname, '../src/client/entry-client')
    },

    output: {
        filename: 'client/js/[name].[chunkhash].js'
    },
    
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 
                {
                    loader: 'css-loader',
                    options: {
                        // 开启 CSS Modules
                        modules: true,
                        // 自定义生成的类名
                        localIdentName: '[local]_[hash:base64:8]'
                    }
                }, 
                'postcss-loader'
            ]
        },
        {
            test: /\.less$/,
            use: [
                isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 
                {
                    loader: 'css-loader',
                    options: {
                        // 开启 CSS Modules
                        modules: true,
                        // 自定义生成的类名
                        localIdentName: '[local]_[hash:base64:8]'
                    }
                }, 
                'postcss-loader', 
                'less-loader'
            ]
        },
        {
            test: /\.styl(us)?$/,
            use: [
                isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 
                {
                    loader: 'css-loader',
                    options: {
                        // 开启 CSS Modules
                        modules: true,
                        // 自定义生成的类名
                        localIdentName: '[local]_[hash:base64:8]'
                    }
                }, 
                'postcss-loader', 
                'stylus-loader'
            ]
        }]
    },

    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),

        new VueLoaderPlugin(),

        new VueSSRClientPlugin(),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),

        new SWPrecachePlugin({
            cacheId: 'vue-itouchtv',
            filename: 'service-worker.js',
            minify: true,
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
            runtimeCaching: [{
                urlPattern: '/',
                handler: 'networkFirst'
            },
            {
                urlPattern: /\/(top|new|show|ask|jobs)/,
                handler: 'networkFirst'
            },
            {
                urlPattern: '/article/:id',
                handler: 'networkFirst'
            },
            {
                urlPattern: '/home',
                handler: 'networkFirst'
            }]
        })
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    ecma:8,
                    output: {
                        comments: isDev, // 保留注释
                        beautify: isDev  // 不需要格式化
                    },
                    compress: {
                        warnings: !isProd, // 删除无用代码时不输出警告
                        drop_console: isProd, // 去除console
                        collapse_vars: true, // 内嵌定义了但是只有用到一次的变量
                        reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                    }
                }
            })
        ],
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks:{
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendors: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: true,
                    test: /[\\/]node_modules[\\/]/,
                },
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    }
})

!isDev && [
    new MiniCssExtractPlugin({
        filename: 'client/css/[name]_[hash:8].css',
    }),
    new CopyWebpackPlugin([
        {from: 'statics/', to: path.join(__dirname, '../dist/statics')},
        {from: 'src/server/template', to: path.join(__dirname, '../dist/server/template')}
    ]),
].map(item => {
    config.plugins.push(item)
})

!isProd && config.plugins.push(
    new vConsolePlugin({
        filter: [],  // 需要过滤的入口文件
        enable: true // 发布代码前记得改回 false
    })
)

module.exports = config
