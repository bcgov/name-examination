import Vue from 'vue';

Vue.config.productionTip = false;

import $ from 'jquery';
global.$ = global.jQuery = $;
