/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import Stats from '@/components/application/stats/Stats';
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

describe('Stats.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(Stats, {store: store});
    });

   it("renders a Stats component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
