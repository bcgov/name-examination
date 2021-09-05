import Vue from 'vue'
import VDragged from 'v-dragged'
import { shallowMount } from '@vue/test-utils'
import Transactions from '@/components/application/Transactions'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'

Vue.use(VDragged)

describe('Testing Transactions.vue', () => {
  let component, vm

  beforeAll(async () => {
    store.replaceState(cleanState())
    component = shallowMount(Transactions, {
      store,
      mocks: { $route: { query: { token: 'token', nr: 'NR 1234567' } } }
    })
    vm = component.vm
    vm.$store.state.transactionsModalVisible = true
    await Vue.nextTick()
  })

  beforeEach(() => {
    // set NR info
    vm.$store.commit('setNrInfo', {
      additionalInfo: 'The quick brown fox...',
      consent_dt: null,
      consentFlag: 'Y',
      corpNum: 'BC1234567',
      entity_type_cd: null,
      expirationDate: '2021-09-11T07:01:00+00:00',
      names: [
        {
          choice: 1,
          name: 'First',
          state: 'APPROVED',
          decision_text: 'Looks good',
          corpNum: 'BC1234567'
        },
        {
          choice: 2,
          name: 'Second',
          state: 'REJECTED',
          decision_text: 'Not good'
        }
      ],
      priorityCd: 'Y',
      request_action_cd: null,
      requestTypeCd: 'XUL',
      stateCd: 'CONSUMED',
      submittedDate: '2021-07-12T16:49:21+00:00'
    })

    // set transactions data
    vm.$store.commit('setTransactionsData', [
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
      }
    ])

    vm.$store.commit('setPendingTransactionsRequest', false)
  })

  it('displays the no transaction available message', async () => {
    await vm.$store.commit('setTransactionsData', [])

    expect(vm.$el.querySelector('#transaction-list').textContent)
      .toContain('No transaction history data available.')
  })

  it('displays the transaction error message', async () => {
    await vm.$store.commit('setTransactionsData', null)

    expect(vm.$el.querySelector('#transaction-list').textContent).toContain(
      'There was an error loading the transaction history for this NR. Please try again by reloading the page.'
    )
  })

  it('displays the transaction header', () => {
    expect(vm.$el.querySelector('#transaction-header-title').textContent).toContain('NR 1234567')
    expect(vm.$el.querySelector('#transaction-header-title').textContent).toContain('Priority')
    expect(vm.$el.querySelector('#transaction-header-title').textContent).toContain('N/A')

    expect(vm.$el.querySelector('#transaction-header-names').textContent).toContain('First')
    expect(vm.$el.querySelector('#transaction-header-names').textContent).toContain('Looks good')
    expect(vm.$el.querySelector('#transaction-header-names').textContent).toContain('Second')
    expect(vm.$el.querySelector('#transaction-header-names').textContent).toContain('Not good')

    expect(vm.$el.querySelector('#transaction-header-info').textContent).toContain('Submitted Date:')
    expect(vm.$el.querySelector('.submitted-date').textContent).toBe('2021-07-12, 9:49 am Pacific time')

    expect(vm.$el.querySelector('#transaction-header-info').textContent).toContain('Expiry Date:')
    expect(vm.$el.querySelector('.expiry-date').textContent).toBe('2021-09-11, 12:01 am Pacific time')

    expect(vm.$el.querySelector('#transaction-header-info').textContent).toContain('Request Status:')
    expect(vm.$el.querySelector('.request-status').textContent).toContain('APPROVED / Used for BC1234567')

    expect(vm.$el.querySelector('#transaction-header-info').textContent).toContain('Consent:')
    expect(vm.$el.querySelector('.consent-text').textContent).toBe('Required. Not Yet Received.')

    expect(vm.$el.querySelector('#transaction-header-info').textContent).toContain('Additional Information:')
    expect(vm.$el.querySelector('.addl-info').textContent).toBe('The quick brown fox...')
  })

  it('displays a transaction history list item', () => {
    const item = vm.$el.querySelectorAll('.transaction-item')[0]

    // FUTURE: verify values for all of these...
    expect(item.textContent).toContain('Date/Time:')
    expect(item.textContent).toContain('Expiry Date:')
    expect(item.textContent).toContain('Transaction Type:')
    expect(item.textContent).toContain('User Id:')
    expect(item.textContent).toContain('Request Status:')
    expect(item.textContent).toContain('Queue:')
    expect(item.textContent).toContain('Request Type:')
    expect(item.textContent).toContain('Consent:')
    expect(item.textContent).toContain('Additional Information:')
  })

  it('displays a staff comment transaction', async () => {
    await vm.$store.commit('setTransactionsData', [
      {
        user_action: 'Staff Comment',
        comment: 'A staff was here'
      }
    ])

    const item = vm.$el.querySelectorAll('.transaction-item')[0]

    expect(item.textContent).toContain('Staff Comment:')
    expect(item.querySelector('.staff-comment').textContent).toBe('A staff was here')
  })

  // FUTURE: implement
  xit('displays transaction name decision text', () => {
  })

  it('displays default transactions', () => {
    expect(vm.$el.querySelector('#transaction-list').textContent).toContain('Marked on Hold')
    expect(vm.$el.innerHTML).toContain('Marked on Hold')
    expect(vm.$el.innerHTML).toContain('Decision')
    expect(vm.$el.innerHTML).toContain('Created NR (Payment Completed)')
    expect(vm.$el.innerHTML).toContain('Created NR (Unknown)')
    expect(vm.$el.innerHTML).toContain('Cancelled in Name Request')
    expect(vm.$el.innerHTML).toContain('Edit NR Details after Completion')
    expect(vm.$el.innerHTML).toContain('Reset')
  })

  it('hides system transactions by default', () => {
    expect(vm.$el.innerHTML).not.toContain('Get NR Details from NRO')
    expect(vm.$el.innerHTML).not.toContain('Get Next NR')
  })
})
