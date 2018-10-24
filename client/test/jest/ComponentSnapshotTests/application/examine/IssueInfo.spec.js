/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import IssueInfo from '@/components/application/Examine/IssueInfo';
import store from '@/store'

describe('IssueInfo.vue', () => {

    let component;
    beforeEach(() => {
        component = shallowMount(IssueInfo, {store: store});
    });

   it("renders an IssueInfo component", () => {
     expect(component.element).toMatchSnapshot();
   })

});
