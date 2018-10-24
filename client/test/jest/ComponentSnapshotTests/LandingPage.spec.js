/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import LandingPage from '@/components/LandingPage';
import store from '@/store'

describe('LandingPage.vue Snapshot', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(LandingPage, {store: store});
    });

   it("renders a LandingPage component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
