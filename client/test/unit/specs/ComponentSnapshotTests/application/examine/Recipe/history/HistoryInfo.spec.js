/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import { shallowMount } from '@vue/test-utils';
import HistoryInfo from '@/components/application/Examine/Recipe/history/historyInfo';
import store from '@/store'

describe('HistoryInfo.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(HistoryInfo, {store: store});
    });

   it("renders a HistoryInfo component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
