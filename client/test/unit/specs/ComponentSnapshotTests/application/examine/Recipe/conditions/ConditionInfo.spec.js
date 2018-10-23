/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import ConditionInfo from '@/components/application/Examine/Recipe/conditions/conditionInfo';
import store from '@/store'

describe('ConditionInfo.vue', () => {

    let component, vm;
    beforeEach(() => {
        component = Vue.extend(ConditionInfo);
        vm = new component({store: store});
    });

   it("renders an ConditionInfo component", () => {
     expect(vm.$el).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
