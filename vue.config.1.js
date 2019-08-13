const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production' ? '/home/' : './'

// module.exports = {
//   // Project deployment base
//   // By default we assume your app will be deployed at the root of a domain,
//   // e.g. https://www.my-app.com/
//   // If your app is deployed at a sub-path, you will need to specify that
//   // sub-path here. For example, if your app is deployed at
//   // https://www.foobar.com/my-app/
//   // then change this to '/my-app/'
//   publicPath: BASE_URL,
//   // tweak internal webpack configuration.
//   // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
//   chainWebpack: config => {
//     config.resolve.alias
//       .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
//       .set('_c', resolve('src/components'))
//       .set('_conf', resolve('config'))
//   },
//   // 打包时不生成.map文件
//   productionSourceMap: false,
//   // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
//   devServer: {
//     proxy: 'http://ycapi.youcaiwx.com'
//   },
//   pwa: {
//     iconPaths: {
//       favicon32: 'favicon.ico',
//       favicon16: 'favicon.ico',
//       appleTouchIcon: 'favicon.ico',
//       maskIcon: 'favicon.ico',
//       msTileImage: 'favicon.ico'
//     }
//   }
// }

module.exports = {

  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  publicPath: BASE_URL,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only

  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
  },
  configureWebpack: () => {},
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html

  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  // webpack-dev-server 相关配置
  devServer: {

    proxy: 'http://ycapi.youcaiwx.com' // 设置代理

  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
