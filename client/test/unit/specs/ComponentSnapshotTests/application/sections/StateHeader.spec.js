/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import StateHeader from '@/components/application/sections/StateHeader';
import store from '@/store'

describe('StateHeader.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(StateHeader, {store: store});
    });

   it("renders a StateHeader component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
