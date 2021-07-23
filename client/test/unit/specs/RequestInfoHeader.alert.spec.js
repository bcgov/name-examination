import Vue from 'vue'
import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'
import axios from '@/axios-auth.js'
import sinon from 'sinon'
import { sleep } from '@/utils/sleep'

describe('RequestInfoHeader alerts', () => {
  let instance
  let sandbox
  let vm

  beforeEach(async () => {
    const Constructor = Vue.extend(RequestInfoHeader)
    store.replaceState(cleanState())
    instance = new Constructor({ store })
    instance.$store.state.myKeycloak = {}

    sandbox = sinon.createSandbox()
    let getStub = sandbox.stub(axios, 'get')
    getStub.withArgs('/api/v1/requests/null', sinon.match.any)
      .returns(
        new Promise((resolve) => {
          resolve({ data: {} })
        }),
      )
    getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any)
      .returns(
        new Promise((resolve) => {
          resolve({
            data: {
              names: [
                { choice: 1, state: 'NE', name: 'Incredible inc' },
                { choice: 2, state: 'NE', name: 'Fabulous inc' },
                { choice: 3, state: 'NE', name: 'Fantastic inc' },
              ],
              state: 'INPROGRESS',
              requestTypeCd: 'CR',
              applicants: '',
              nwpta: [],
            },
          })
          data.queueIndex++
        }),
      )
    instance.$store.state.compInfo.nrNumber = 'NR1234'
    instance.$store.state.is_editing = true
    vm = instance.$mount(document.getElementById('app'))
    await sleep(300)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('displays NR', () => {
    expect(vm.$el.querySelector('#nrNumberDisplay').textContent)
      .toEqual('NR1234')
  })

  it('displays names', () => {
    expect(vm.$el.querySelector('#compName1').value)
      .toEqual('Incredible inc')
    expect(vm.$el.querySelector('#compName2').value)
      .toEqual('Fabulous inc')
    expect(vm.$el.querySelector('#compName3').value)
      .toEqual('Fantastic inc')
  })

  it('hides error when all good', () => {
    expect(vm.$el.querySelector('div.field-error'))
      .toEqual(null)
  })

  it('alerts when first choice is missing', async () => {
    vm.compName1.name = ''

    await sleep(300)

    expect(vm.$el.querySelector('div.field-error').innerHTML).toEqual('The first name choice is required')
  })

  it('alerts when entering a 3rd choice w.o. a 2nd', async () => {
    vm.compName1.name = 'Some Name'
    vm.compName2.name = ''
    vm.compName3.name = 'A name'

    await sleep(300)

    expect(vm.$el.querySelector('div.field-error')
      .innerHTML
      .trim())
      .toEqual('To include a 3rd name choice the 2nd name choice is first required')
  })
})
