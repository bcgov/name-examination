import sinon from 'sinon'
import axios from '@/axios-auth.js'
import store from '@/store'
import { sleep } from '@/utils/sleep'

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

    it('gets info from corp when source is CORP', async () => {
      sandbox.getStub.withArgs('/api/v1/corporations/42', sinon.match.any).returns(
        new Promise((resolve) => resolve({ data: { any: 'field' } })),
      )
      store.dispatch('getConflictInfo', { source: 'CORP', nrNumber: 42 })
      await sleep(300)

      expect(store.state.corpConflictJSON).toEqual({ any: 'field' })
    })

    it('gets info from requests when source is not corp', async () => {
      sandbox.getStub.withArgs('/api/v1/requests/42', sinon.match.any).returns(
        new Promise((resolve) => resolve({ data: { any: 'field' } })),
      )
      store.dispatch('getConflictInfo', { source: 'OTHER', nrNumber: 42 })
      await sleep(300)

      expect(store.state.corpConflictJSON).toEqual({ any: 'field' })
    })
  })

  describe('testing with sinon.spy', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
      sandbox.axSpy = sandbox.spy(axios, 'get')
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('does nothing when nrNumber is not provided (undefined)', async () => {
      store.dispatch('getConflictInfo', { source: 'CORP' })
      await sleep(300)

      expect(sandbox.axSpy.callCount).toEqual(0)
    })

    it('does nothing when nrNumber is not provided (null)', async () => {
      store.dispatch('getConflictInfo', { source: 'CORP', nrNumber: null })
      await sleep(300)

      expect(sandbox.axSpy.callCount).toEqual(0)
    })
  })
})
