const path = require("path");

function resolve(dir = "") {
  return path.join(__dirname, "./src", dir);
}
module.exports = {
  productionSourceMap: false,
  devServer: {
    open: true, //配置自动启动浏览器
    host: "0.0.0.0",
    port: 8080, // 端口号
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        //target: 'http://127.0.0.1:3000',
        target: "http://localhost:8081",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .loader("eslint-loader")
      .tap(options => {
        options.fix = true;
        return options;
      });
  }
};
