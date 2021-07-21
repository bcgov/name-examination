import Vue from 'vue';
import VDragged from 'v-dragged';

import Transactions from '@/components/application/Transactions';
import store from '@/store';
import { cleanState } from '../../features/specs/support/clean.state';

Vue.use(VDragged);

describe('Testing Transactions.vue', () => {
  const data = {};
  let sandbox;
  const Constructor = Vue.extend(Transactions);

  beforeAll((done) => {
    store.replaceState(cleanState());
    data.instance = new Constructor({ store });
    data.vm = data.instance.$mount();
    data.vm.$store.dispatch('getTransactionsHistory');
    data.vm.$store.state.transactionsModalVisible = true;
    setTimeout(() => {
      done();
    }, 1000);
  });

  beforeEach(() => {
    data.vm.$store.state.transactionsData = [
      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998450,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'INPROGRESS',
        userId: 80,
        user_action: 'Get NR Details from NRO',
        user_name: 'github/scottrumsby' },

      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998451,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'INPROGRESS',
        userId: 80,
        user_action: 'Get Next NR',
        user_name: 'github/scottrumsby' },
      {
        eventDate: 'Wed, 29 May 2019 20:30:41 GMT',
        id: 1998452,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'HOLD',
        userId: 1,
        user_action: 'Marked on Hold',
        user_name: 'nro_service_account',
      },
      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998450,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'APPROVED',
        userId: 80,
        user_action: 'Decision',
        user_name: 'github/scottrumsby' },
      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998451,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'CANCELLED',
        userId: 80,
        user_action: 'Cancelled in Name Request',
        user_name: 'github/scottrumsby' },
      {
        eventDate: 'Wed, 29 May 2019 20:30:41 GMT',
        id: 1998452,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'DRAFT',
        userId: 1,
        user_action: 'Created NR (Payment Completed)',
        user_name: 'nro_service_account',
      },
      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998450,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'INPROGRESS',
        userId: 80,
        user_action: 'Created NR (Unknown)',
        user_name: 'github/scottrumsby' },
      {
        eventDate: 'Wed, 29 May 2019 19:53:01 GMT',
        id: 1998451,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'INPROGRESS',
        userId: 80,
        user_action: 'Cancelled in Name Request',
        user_name: 'github/scottrumsby' },
      {
        eventDate: 'Wed, 29 May 2019 20:30:41 GMT',
        id: 1998452,
        jsonData: {},
        requestId: 2257876,
        stateCd: 'COMPLETED',
        userId: 1,
        user_action: 'Edit NR Details after Completion',
        user_name: 'nro_service_account',
      }];
  });

  afterAll(() => {
    sandbox.restore();
  });

  test('It displays the no transaction available message', async () => {
    data.vm.$store.state.pendingTransactionsRequest = false;
    data.vm.$store.state.transactionsData = [];

    await Vue.nextTick();

    expect(data.vm.$el.querySelector('#transaction-list').textContent)
      .toContain('No transaction history data available.');
  });

  test('It displays the transaction error message', async () => {
    data.vm.$store.state.pendingTransactionsRequest = false;
    data.vm.$store.state.transactionsData = false;

    await Vue.nextTick();

    expect(data.vm.$el.querySelector('#transaction-list').textContent)
      .toContain('There was an error loading the transaction history for this NR. Please try again by ' +
        'reloading the page.');
  });

  test('It displays default transactions', () => {
    expect(data.vm.$el.querySelector('#transaction-list').textContent).toContain('Marked on Hold');
    expect(data.vm.$el.innerHTML).toContain('Marked on Hold');
    expect(data.vm.$el.innerHTML).toContain('Decision');
    expect(data.vm.$el.innerHTML).toContain('Created NR (Payment Completed)');
    expect(data.vm.$el.innerHTML).toContain('Created NR (Unknown)');
    expect(data.vm.$el.innerHTML).toContain('Cancelled in Name Request');
    expect(data.vm.$el.innerHTML).toContain('Edit NR Details after Completion');
  });

  test('It hides system transactions by default', () => {
    expect(data.vm.$el.innerHTML).not.toContain('Get NR Details from NRO');
    expect(data.vm.$el.innerHTML).not.toContain('Get Next NR');
  });

  test('it sets the showJSONData flag to false for every transaction', () => {
    const { transactionsData } = data.vm.$store.state;
    const values = Object.values(transactionsData);
    expect(values.every(value => !value.showJSONData)).toBeTruthy();
  });

  test('it does not display the transaction expansion row', () => {
    expect(data.vm.$el.querySelector('#trans-expansion-row')).toBeNull();
  });
});
