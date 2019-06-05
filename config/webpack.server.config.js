const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const nodeExternals = require('webpack-node-externals')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const base = require('./webpack.base.config')

const config = merge(base, {
    target: 'node',

    node: {
        __filename: true,
        __dirname: true
    },

    entry: path.join(__dirname, '../src/server/entry-server'),
    output: {
        filename: 'server/server-bundle.js',

        // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
        libraryTarget: 'commonjs2'
    },
    // resolve: {
    //     alias: {
    //         'create-api': './create-api-server.js'
    //     }
    // },

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。
        // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        whitelist: /\.css$/
    }),

    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'vue-style-loader', 
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
                'vue-style-loader', 
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
                'vue-style-loader', 
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
        new VueLoaderPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                postcss: [autoprefixer]
            }
        }),

        new VueSSRServerPlugin()
    ]
})

module.exports = config;