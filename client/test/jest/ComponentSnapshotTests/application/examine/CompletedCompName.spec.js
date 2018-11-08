/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import CompletedCompName from '@/components/application/Examine/CompletedCompName';
import store from '@/store'

describe('CompletedCompName.vue ', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(CompletedCompName, {store: store});
    });

   it("renders a CompletedCompName component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
