import sinon from 'sinon'
import axios from '@/axios-auth.js'
import store from '@/store'

describe('store > GetConflictsInfo', () => {

  let sandbox

  describe('testing api with sinon.stub', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.getStub = sandbox.stub(axios, 'get')
    })
    afterEach(() => {
      sandbox.restore()
      sandbox = null
    })

    it('gets info from corp when source is CORP', (done) => {
      sandbox.getStub.withArgs('/api/v1/corporations/42', sinon.match.any).returns(
        new Promise((resolve) => resolve({ data: { any: 'field' } })),
      )
      store.dispatch('getConflictInfo', { source: 'CORP', nrNumber: 42 })

      setTimeout(() => {
        expect(store.state.corpConflictJSON)
        .toEqual({ any: 'field' })
        done()
      }, 300)
    })

    it('gets info from requests when source is not corp', (done) => {

      sandbox.getStub.withArgs('/api/v1/requests/42', sinon.match.any).returns(
        new Promise((resolve) => resolve({ data: { any: 'field' } })),
      )
      store.dispatch('getConflictInfo', { source: 'OTHER', nrNumber: 42 })

      setTimeout(() => {
        expect(store.state.corpConflictJSON).toEqual({ any: 'field' })
        done()
      }, 300)
    })
  })

  describe('testing with sinon.spy', () => {
    beforeEach( () => {
      sandbox = sinon.createSandbox()
      sandbox.axSpy = sandbox.spy(axios, 'get')
    })

    afterEach( () => {
      sandbox.restore()
    })
    it('does nothing when nrNumber is not provided (undefined)', (done) => {
      store.dispatch('getConflictInfo', { source: 'CORP' })

      setTimeout(() => {
        expect(sandbox.axSpy.callCount).toEqual(0)
        done()
      }, 300)
    })

    it('does nothing when nrNumber is not provided (null)', (done) => {
      store.dispatch('getConflictInfo', { source: 'CORP', nrNumber: null })

      setTimeout(() => {
        expect(sandbox.axSpy.callCount).toEqual(0)
        done()
      }, 300)
    })
  })
})
