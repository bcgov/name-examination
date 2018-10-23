/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader';
import store from '@/store'

describe('RequestInfoHeader.vue', () => {

   let component, vm;
    beforeEach(() => {
        component = Vue.extend(RequestInfoHeader);
        vm = new component({store: store});
    });

   it("renders an RequestInfoHeader component", () => {
     expect(vm.$el).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
