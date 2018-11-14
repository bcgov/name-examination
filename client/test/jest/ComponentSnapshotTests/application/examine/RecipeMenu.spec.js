/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import RecipeMenu from '@/components/application/Examine/RecipeMenu';
import store from '@/store'
import {shallowMount} from "@vue/test-utils";

describe('RecipeMenu.vue', () => {

    let component, vm;
    beforeEach(() => {
        component = Vue.extend(RecipeMenu);
        vm = new component({store: store});
    });

   it("renders a RecipeMenu component", () => {
     expect(vm.$el).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
