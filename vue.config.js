module.exports = {
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-plus': 'ElementPlus',
      axios: 'axios'
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
