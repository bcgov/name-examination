const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  chainWebpack: config => {
    config.module
      .plugin('polyfills').use(NodePolyfillPlugin)
      .rule('vue')
      .use('vueloader')      
    },    
})