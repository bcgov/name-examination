/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import Signin from '@/components/auth/Signin';
import store from '@/store'

describe.skip('Signin.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(Signin, {store: store});
    });

   it("renders a Signin component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
