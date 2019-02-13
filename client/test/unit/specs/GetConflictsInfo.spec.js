import sinon from 'sinon';
import axios from '@/axios-auth.js';
import store from '@/store'

describe('store > GetConflictsInfo', () => {

  let sandbox;

  beforeEach(() => {
    sinon.restore()
    sandbox = sinon.createSandbox()
    jest.setTimeout(100000);
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('gets info from corp when source is CORP', (done) => {
    sandbox.getStub = sandbox.stub(axios, 'get');
    sandbox.getStub.withArgs('/api/v1/corporations/42', sinon.match.any).returns(
      new Promise((resolve) => resolve({data: {any: 'field'}}))
    )
    store.dispatch('getConflictInfo', {source: 'CORP', nrNumber: 42})

    setTimeout(() => {
      expect(store.state.corpConflictJSON).toEqual({any: 'field'})
      done();
    }, 300)
  })

  it('gets info from requests when source is not corp', (done) => {
    sandbox.getStub = sandbox.stub(axios, 'get');
    sandbox.getStub.withArgs('/api/v1/requests/42', sinon.match.any).returns(
      new Promise((resolve) => resolve({data: {any: 'field'}}))
    )
    store.dispatch('getConflictInfo', {source: 'OTHER', nrNumber: 42})

    setTimeout(() => {
      expect(store.state.corpConflictJSON).toEqual({any: 'field'})
      done();
    }, 300)
  })

  it('does nothing when nrNumber is not provided (undefined)', (done) => {
    var spy = sinon.spy(axios, 'get')
    store.dispatch('getConflictInfo', {source: 'CORP'})

    setTimeout(() => {
      expect(spy.callCount).toEqual(0)
      done();
    }, 300)
  })

  it('does nothing when nrNumber is not provided (null)', (done) => {
    var spy = sinon.spy(axios, 'get')
    store.dispatch('getConflictInfo', {source: 'CORP', nrNumber: null})

    setTimeout(() => {
      expect(spy.callCount).toEqual(0)
      done();
    }, 300)
  })
})
