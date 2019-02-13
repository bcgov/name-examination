/* eslint-disable */
import Vue from 'vue';

Vue.use(require('vue-shortkey'))
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader';
import store from '@/store'
import {cleanState} from '../../features/specs/support/clean.state'
import axios from '@/axios-auth.js';
import sinon from 'sinon';

describe('RequestInfoHeader alerts', () => {

  let instance;
  let sandbox;
  let vm;
  beforeEach((done) => {
    const Constructor = Vue.extend(RequestInfoHeader);
    store.replaceState(cleanState())
    instance = new Constructor({store: store});
    instance.$store.state.myKeycloak = {}

    sandbox = sinon.createSandbox()
    let getStub = sandbox.stub(axios, 'get')
    getStub.withArgs('/api/v1/requests/null', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({data: {}});
      })
    )
    getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
      new Promise((resolve) => {
        resolve({
          data: {
            names: [
              {choice: 1, state: 'NE', name: 'Incredible inc'},
              {choice: 2, state: 'NE', name: 'Fabulous inc'},
              {choice: 3, state: 'NE', name: 'Fantastic inc'}
            ],
            state: 'INPROGRESS',
            requestTypeCd: 'CR',
            applicants: '',
            nwpta: []
          }
        })
        data.queueIndex++;
      })
    )
    instance.$store.state.compInfo.nrNumber = 'NR1234'
    instance.$store.state.is_editing = true
    vm = instance.$mount(document.getElementById('app'));
    setTimeout(() => {
      done();
    }, 300)
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('displays NR', () => {
    expect(vm.$el.querySelector('div.nrNum').textContent).toEqual('NR1234')
  })

  it('displays names', () => {
    expect(vm.$el.querySelector('table tr:nth-child(1) input').value).toEqual('Incredible inc')
    expect(vm.$el.querySelector('table tr:nth-child(2) input').value).toEqual('Fabulous inc')
    expect(vm.$el.querySelector('table tr:nth-child(3) input').value).toEqual('Fantastic inc')
  })

  it('hides error when all good', () => {
    expect(vm.$el.querySelector('table tr:nth-child(1) .error')).toEqual(null)
  })

  it('alerts when first choice is missing', (done) => {
    vm.compName1.name = '';

    setTimeout(() => {
      expect(vm.$el.querySelector('table tr:nth-child(1) .error').innerHTML).toEqual('The first name choice is required.')
      done();
    }, 300)
  })
});
