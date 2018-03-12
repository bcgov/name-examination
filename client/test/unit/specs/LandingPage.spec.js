import Vue from 'vue';
import LandingPage from '@/components/LandingPage';

describe('LandingPage.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(LandingPage);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.hello h2').textContent)
      .toEqual('You should only see this page if you got here un-authenticated. Please login');
  });
});
