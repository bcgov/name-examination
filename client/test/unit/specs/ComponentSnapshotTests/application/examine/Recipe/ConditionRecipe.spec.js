/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import ConditionRecipe from '@/components/application/Examine/Recipe/conditionRecipe';
import store from '@/store'

describe('ConditionRecipe.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(ConditionRecipe, {store: store});
    });

   it("renders a ConditionRecipe component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
