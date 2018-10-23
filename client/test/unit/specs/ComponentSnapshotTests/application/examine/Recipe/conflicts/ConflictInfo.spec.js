/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import ConflictInfo from '@/components/application/Examine/Recipe/conflicts/conflictInfo';
import store from '@/store'

describe('ConflictInfo.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(ConflictInfo, {store: store});
    });

   it("renders a ConflictInfo component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
