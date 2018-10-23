/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import HistoryRecipe from '@/components/application/Examine/Recipe/historyRecipe';
import store from '@/store'

describe('HistoryRecipe.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(HistoryRecipe, {store: store});
    });

   it("renders a HistoryRecipe component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
