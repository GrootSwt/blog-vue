module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 生产环境配置项
      config.externals = {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        'element-plus': 'ElementPlus',
        axios: 'axios'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8889',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
