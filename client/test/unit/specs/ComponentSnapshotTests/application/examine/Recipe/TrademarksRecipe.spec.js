/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import TrademarksRecipe from '@/components/application/Examine/Recipe/trademarksRecipe';
import store from '@/store'

describe('TrademarksRecipe.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(TrademarksRecipe, {store: store});
    });

   it("renders a TrademarksRecipe component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
