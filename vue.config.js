module.exports = {
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    //设置前端服务的地址
    port: 8082,
    //跨域配置
    proxy: {
      '/shop': {
        target: 'http://localhost:8081', // 要跨域的域名
        changeOrigin: true, // 是否开启跨域
      }
    }
  }
}