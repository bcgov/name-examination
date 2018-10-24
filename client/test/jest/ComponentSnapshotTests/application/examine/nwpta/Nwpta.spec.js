/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import Nwpta from '@/components/application/Examine/nwpta/nwpta';
import store from '@/store'

describe('Nwpta.vue', () => {

    let component, vm;
    beforeEach(() => {
        component = Vue.extend(Nwpta);
        vm = new component({store: store});
    });

   it("renders a RequestInfoHeader component", () => {
     expect(vm.$el).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
