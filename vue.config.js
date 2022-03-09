module.exports = {
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
