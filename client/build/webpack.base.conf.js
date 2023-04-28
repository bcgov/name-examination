'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const vueConfig = require('./vue.config.js')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const vueLoaderConfig = require('./vue-loader.conf')
function resolve (dir) {
  // return path.join(__dirname, '..', dir)
  return path.join(__dirname, dir)
}

path.client = resolve("../")
path.public = resolve("")
path.src = resolve("../src")

console.log("Client: " + path.client)
console.log("Public: " + path.public)
console.log("Src: " + path.src)
console.log("Build: " + path.build)

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [ 'whatwg-fetch', path.src + '/main.js'],
  
  resolve: {
        extensions: ['.vue','.js','.json'],
		        alias: {
                'components': path.resolve(__dirname, '../src/components/'),
			          'images': path.resolve(__dirname, '../src/images/'),
		            'styles': path.resolve(__dirname, '../src/styles/'),
                'router': path.resolve(__dirname, '../src/router/'),
                '@': path.resolve('src'),
                'vue$': 'vue/dist/vue.esm.js'            
		 }
  },
  //            'vue$': path.resolve(__dirname, '../node_modules/vue/dist/vue.common.js')            

  // Where webpack outputs the assets and bundles
  //path: path.build,
  
  output: {
    path: path.resolve(__dirname,"../dist"),
    filename: '[name].bundle.js',      
    publicPath: '/',
  },  
  
  // Customize the webpack build process
  plugins: [
    
    // Vue plugin for the magic
    new VueLoaderPlugin(), 
	
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        'app.*.css',
        'app.*.js',
        'app.*.js.map',
        'vendors*',
        'dist/*.bundle.js'
      ]
    }),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(path.client, 'static'),
          to: 'static',
          globOptions: {
            ignore: ['.*'],
          },
        },
      ],
    }),
        
    new HtmlWebpackPlugin({     
      template: path.client + '/index.html', // template file     
      filename: 'index.html', // output file
    }),
    
    // Extracts CSS into separate files
    // Note: style-loader is for development, MiniCssExtractPlugin is for production
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    
  ],
    
  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
	    {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
    
      {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']},
      /*      
      {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: false,
              },
            },
            'vue-style-loader',
            'style-loader',
            'sass-loader',
            'postcss-loader'                    
          ],
      },      
      */
     
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(scss|css)$/,
        use: [
           'vue-style-loader', 
           'style-loader',       		                
          {loader: 'css-loader', options: {sourceMap: true, importLoaders: 2, esModule: false}},
          {loader: 'postcss-loader', options: {sourceMap: true}},
          {loader: 'sass-loader', options: {sourceMap: true}}          
        ],
      },        

      // Stylus: 
      {
        test: /\.(styl)$/,
        use: [ 'style-loader', 'css-loader', 'stylus-loader']
      },

      // Images: Copy image files to build folder
      // {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },

      // Fonts and SVGs: Inline files
      // {test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline'},
      { 
        test: /\.(woff(2)?|eot|ttf|otf|)(\?.*)?$/, 
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },

    ],
  },
}