/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import ConflictRecipe from '@/components/application/Examine/Recipe/conflictRecipe';
import store from '@/store'

describe('ConflictRecipe.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(ConflictRecipe, {store: store});
    });

   it("renders a ConflictRecipe component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
