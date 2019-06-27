/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import TrademarksInfo from '@/components/application/Examine/Recipe/trademarks/TrademarksInfo';
import store from '@/store'

describe('TrademarksInfo.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(TrademarksInfo, {store: store});
    });

   it("renders a TrademarksInfo component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
