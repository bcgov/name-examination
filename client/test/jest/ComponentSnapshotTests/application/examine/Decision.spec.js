/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import Decision from '@/components/application/Examine/Decision';
import store from '@/store'

describe('Decision.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(Decision, {store: store});
    });

   it("renders a Decision view", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
