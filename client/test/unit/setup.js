import Vue from 'vue'
import { Plugin } from 'vue-fragment'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import $ from 'jquery'
import staticFilesServer from './static.files.server'
import fs from 'fs'


Vue.use(Plugin)
Vue.use(require('vue-shortkey'))
Vue.use(Vuelidate)
Vue.use(Vuetify)

window.scrollTo = jest.fn()
Vue.config.productionTip = false
window.HTMLElement.prototype.scrollIntoViewIfNeeded = function () { return null }
window.HTMLElement.prototype.scrollTo = function () { return null }

global.$ = global.jQuery = $
let utils = fs.readFileSync('./static/js/utils.js')
.toString()
global.readJFile = ( new Function(utils + `return function(configUrl, callback){
    readJFile('http://localhost:` + staticFilesServer.port + `/' + configUrl, callback);
};`) )()
global.readCsv = ( new Function(utils + `return function(csvFile, callback){
    readCsv('http://localhost:` + staticFilesServer.port + `/' + csvFile, callback);
};`) )()
global.findArrValue = ( new Function(utils + `return findArrValue;`) )()
global.findArrValueByAttr = ( new Function(utils + `return findArrValueByAttr;`) )()
global.getDescFromList = ( new Function(utils + `return getDescFromList;`) )()

let app = document.createElement('DIV')
app.setAttribute('id', 'app')
app.setAttribute('data-app', true)
document.body.appendChild(app)
