import Vue from 'vue'
import VDragged from 'v-dragged'

import Transactions from '@/components/application/Transactions'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'
import sinon from 'sinon'
import axios from '@/axios-auth'

Vue.use(VDragged)

describe('Testing Transactions.vue', () => {
  let data = {}
  let sandbox
  const Constructor = Vue.extend(Transactions)

  beforeAll(done => {
    sandbox = sinon.createSandbox()
    sandbox.stub(axios, 'get').resolves(
      {
        data:
          {
            response: { count: 3 },
            transactions:
               { 1:
                  { action: 'update_from_nro',
                    eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
                    id: 1998450,
                    jsonData: {},
                    requestId: 2257876,
                    stateCd: 'INPROGRESS',
                    userId: 80,
                    user_action: 'Get NR Details from NRO',
                    user_name: 'github/scottrumsby' },
                 2:
                  { action: 'get',
                    eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
                    id: 1998451,
                    jsonData: {},
                    requestId: 2257876,
                    stateCd: 'INPROGRESS',
                    userId: 80,
                    user_action: 'Get Next NR',
                    user_name: 'github/scottrumsby' },
                 3:
                  { action: 'marked_on_hold',
                    eventDate: 'Wed, 29 May 2019 20:30:41 GMT',
                    id: 1998452,
                    jsonData: {},
                    requestId: 2257876,
                    stateCd: 'HOLD',
                    userId: 1,
                    user_action: '',
                    user_name: 'nro_service_account'
                  }
              }
          }
      })
    store.replaceState(cleanState())
    data.instance = new Constructor({ store })
    data.vm = data.instance.$mount()
    data.vm.$store.dispatch('getTransactionsHistory')
    data.vm.$store.state.transactionsModalVisible = true
    setTimeout(() => {
      done()
    }, 1000)
  })

  afterAll(() => {
    sandbox.restore()
  })

  test('It displays the action when there is no user_action', () => {
    expect(data.vm.$el.innerHTML).toContain('marked_on_hold')
  })

  test('It displays all 3 transactions', () => {
    expect(data.vm.$el.innerHTML).toContain('marked_on_hold')
    expect(data.vm.$el.innerHTML).toContain('Get NR Details from NRO')
    expect(data.vm.$el.innerHTML).toContain('Get Next NR')
  })

  test('it sets the showJSONData flag to false for every transaction', () => {
    let { transactionsData } = data.vm.$store.state
    let values = Object.values(transactionsData)
    expect(values.every(value => !value.showJSONData)).toBeTruthy()
  })

  test('it does not display the transaction expansion row', () => {
    expect(data.vm.$el.querySelector('#trans-expansion-row')).toBeNull()
  })
})
