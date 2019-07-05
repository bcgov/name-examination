import Vue from 'vue';
import { Plugin } from 'vue-fragment'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(Plugin)

Vue.config.productionTip = false;

import $ from 'jquery';
global.$ = global.jQuery = $;

import staticFilesServer from './static.files.server';

import fs from 'fs';
let utils = fs.readFileSync('./static/js/utils.js').toString();
global.readJFile = (new Function( utils + `return function(configUrl, callback){
    readJFile('http://localhost:`+ staticFilesServer.port + `/' + configUrl, callback);
};`))();
global.readCsv = (new Function( utils + `return function(csvFile, callback){
    readCsv('http://localhost:`+ staticFilesServer.port + `/' + csvFile, callback);
};`))();
global.findArrValue = (new Function( utils + `return findArrValue;`))();
global.findArrValueByAttr = (new Function( utils + `return findArrValueByAttr;`))();
global.getDescFromList = (new Function( utils + `return getDescFromList;`))();
let app = document.createElement('DIV')
app.id = "app"
document.body.innerHTML = '';
document.body.appendChild(app);
