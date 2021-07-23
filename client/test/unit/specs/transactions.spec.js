import Vue from 'vue'
import VDragged from 'v-dragged'

import Transactions from '@/components/application/Transactions'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'
import { sleep } from '@/utils/sleep'

Vue.use(VDragged)

describe('Testing Transactions.vue', () => {
  const data = {}
  const Constructor = Vue.extend(Transactions)

  beforeAll(async () => {
    store.replaceState(cleanState())
    data.instance = new Constructor({ store })
    data.vm = data.instance.$mount()
    data.vm.$store.dispatch('getTransactionsHistory')
    data.vm.$store.state.transactionsModalVisible = true
    await sleep(1000)
  })

  beforeEach(() => {
    data.vm.$store.state.transactionsData = [
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'INPROGRESS',
        user_action: 'Get NR Details from NRO',
        user_name: 'name_request_service_account',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'INPROGRESS',
        user_action: 'Get Next NR',
        user_name: 'github/scottrumsby',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'HOLD',
        user_action: 'Marked on Hold',
        user_name: 'nro_service_account',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'APPROVED',
        user_action: 'Decision',
        user_name: 'nro_service_account',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'CANCELLED',
        user_action: 'Cancelled in Name Request',
        user_name: 'github/scottrumsby',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'DRAFT',
        user_action: 'Created NR (Payment Completed)',
        user_name: 'github/cameronidir',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'INPROGRESS',
        user_action: 'Created NR (Unknown)',
        user_name: 'github/cameronidir',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'COMPLETED',
        user_action: 'Edit NR Details after Completion',
        user_name: 'github/cameronidir',
      },
      {
        additionalInfo: '*** New Request ***',
        consentFlag: null,
        consent_dt: null,
        corpNum: null,
        eventDate: 'Thu, 15 Jul 2021 21:36:03 GMT',
        expirationDate: '2021-09-11T07:01:00+00:00',
        furnished: 'Y',
        names: [{ choice: 1, comment: null, conflict1: '', conflict1_num: '', conflict2: '', conflict2_num: '' }],
        priorityCd: 'Y',
        requestTypeCd: 'CR',
        request_action_cd: null,
        stateCd: 'INPROGRESS',
        user_action: 'Reset',
        user_name: 'github/cameronidir',
      }]
  })

  test('It displays the no transaction available message', async () => {
    data.vm.$store.state.pendingTransactionsRequest = false
    data.vm.$store.state.transactionsData = []

    await Vue.nextTick()

    expect(data.vm.$el.querySelector('#transaction-list').textContent)
      .toContain('No transaction history data available.')
  });

  test('It displays the transaction error message', async () => {
    data.vm.$store.state.pendingTransactionsRequest = false;
    data.vm.$store.state.transactionsData = false

    await Vue.nextTick()

    expect(data.vm.$el.querySelector('#transaction-list').textContent)
      .toContain('There was an error loading the transaction history for this NR. Please try again by ' +
        'reloading the page.');
  })

  test('It displays default transactions', () => {
    expect(data.vm.$el.querySelector('#transaction-list').textContent).toContain('Marked on Hold');
    expect(data.vm.$el.innerHTML).toContain('Marked on Hold')
    expect(data.vm.$el.innerHTML).toContain('Decision')
    expect(data.vm.$el.innerHTML).toContain('Created NR (Payment Completed)')
    expect(data.vm.$el.innerHTML).toContain('Created NR (Unknown)')
    expect(data.vm.$el.innerHTML).toContain('Cancelled in Name Request')
    expect(data.vm.$el.innerHTML).toContain('Edit NR Details after Completion')
    expect(data.vm.$el.innerHTML).toContain('Reset')
  })

  test('It hides system transactions by default', () => {
    expect(data.vm.$el.innerHTML).not.toContain('Get NR Details from NRO')
    expect(data.vm.$el.innerHTML).not.toContain('Get Next NR')
  })

  test('it sets the showJSONData flag to false for every transaction', () => {
    const { transactionsData } = data.vm.$store.state
    const values = Object.values(transactionsData)
    expect(values.every(value => !value.showJSONData)).toBeTruthy()
  });

  test('it does not display the transaction expansion row', () => {
    expect(data.vm.$el.querySelector('#trans-expansion-row')).toBeNull()
  })
})
