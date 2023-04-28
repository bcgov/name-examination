'use strict'
const path = require('path')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.conf.js')

console.log('Build ' + path.build)

module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'production',

  // Control how source maps are generated
  // devtool: 'inline-source-map',
  devtool: 'source-map',
    
  // Enable: It is possible testing in IE 11, but reload / replacement will break due to a bug in webpack 5 !
  // Disable: It is possible to use hot relad / replacement but not using IE 11 !
  // target: ['web', 'es5'], 

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    contentBase: path.build,
    open: true,
    compress: true,
    hot: true,
    port: 8081,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 
        NODE_ENV: '"production"'
      }  
    }), 
    
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ],
})