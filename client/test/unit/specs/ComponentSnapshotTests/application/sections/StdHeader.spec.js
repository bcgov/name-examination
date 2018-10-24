/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import StdHeader from '@/components/application/sections/StdHeader';
import store from '@/store'

describe('StdHeader.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(StdHeader, {store: store});
    });

   it("renders a StdHeader component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
