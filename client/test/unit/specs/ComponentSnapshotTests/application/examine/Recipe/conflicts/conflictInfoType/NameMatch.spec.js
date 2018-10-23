/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import NameMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/namesMatch';
import store from '@/store'

describe('NameMatch.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(NameMatch, {store: store});
    });

   it("renders a NameMatch component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
