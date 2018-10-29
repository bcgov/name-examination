/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import NullMatch from '@/components/application/Examine/Recipe/history/historyInfoType/nullMatch';
import store from '@/store'

describe('NullMatch.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(NullMatch, {store: store});
    });

   it("renders a NullMatch component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
