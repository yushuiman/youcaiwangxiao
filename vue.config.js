const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)
// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? '/home/'
//   : '/'
const BASE_URL = '/'
const webpack = require('webpack')
module.exports = {
  publicPath: BASE_URL, // 默认'/'，部署应用包时的基本 URL
  // outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  // assetsDir: '', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  // lintOnSave: false,
  // runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境的 source map
  // CSS 相关选项
  css: {
    // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
    // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
    extract: true,

    // 是否开启 CSS source map？
    sourceMap: false,

    // 为预处理器的 loader 传递自定义选项。比如传递给
    // sass-loader 时，使用 `{ sass: { ... } }`。
    loaderOptions: {},

    // 为所有的 CSS 及其预处理文件开启 CSS Modules。
    // 这个选项不会影响 `*.vue` 文件。
    modules: false
  },

  // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
  // 在多核机器下会默认开启。
  parallel: require('os').cpus().length > 1,
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },

  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 修复 Lazy loading routes Error
    // config.plugin('html').tap(args => {
    //   args[0].chunksSortMode = 'none'
    //   return args
    // })

    // 添加别名
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))

    // 压缩图片
    // config.module
    //     .rule("images")
    //     .use("image-webpack-loader")
    //     .loader("image-webpack-loader")
    //     .options({
    //         mozjpeg: {progressive: true, quality: 65},
    //         optipng: {enabled: false},
    //         pngquant: {quality: "65-90", speed: 4},
    //         gifsicle: {interlaced: false},
    //         webp: {quality: 75}
    //     });
  },
  configureWebpack: config => {
    if (IS_PROD) {
      const plugins = []
      //   plugins.push(
      //     new UglifyJsPlugin({
      //       uglifyOptions: {
      //         compress: {
      //           warnings: true,
      //           drop_console: true,
      //           drop_debugger: true,
      //           pure_funcs: ['console.log'] // 移除console
      //         },
      //         mangle: false,
      //         output: {
      //           beautify: true // 压缩注释
      //         }
      //       },
      //       sourceMap: false,
      //       parallel: true
      //     })
      //   )
      plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require('./public/vendor/vendor-manifest.json')
        })
      )
      plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        })
      )
      // 去掉 console.log
      // plugins.push(
      //   new UglifyJsPlugin({
      //     uglifyOptions: {
      //       compress: {
      //         warnings: true,
      //         drop_console: true,
      //         drop_debugger: true,
      //         pure_funcs: ['console.log']// 移除console
      //       }
      //     },
      //     sourceMap: false,
      //     parallel: true
      //   })
      // )
      config.plugins = [...config.plugins, ...plugins]
    }

    // 打包分析
    // if (process.env.IS_ANALYZ) {
    //   config.plugin('webpack-report')
    //     .use(BundleAnalyzerPlugin, [{
    //       analyzerMode: 'static'
    //     }])
    // }

    // 配置 externals
    // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖

    config.externals = {
      'vue': 'Vue',
      'iview': 'iview'
    }
  },
  devServer: {
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    open: IS_PROD,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // proxy: 'http://ycapi.youcaiwx.com'
    // proxy: 'https://dest.youcaiwx.cn'
    proxy: 'https://api.youcaiwx.cn'
  }
}
