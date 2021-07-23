import staticFilesServer from '../static.files.server'
import { createApiSandbox, sinon } from '../sandbox/CompNameSpec-api-stubs'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import { sleep } from '@/utils/sleep'

describe('Conflicts Tests', () => {
  let data = {}

  beforeEach(done => {
    data.apiSandbox = createApiSandbox()
    jest.setTimeout(100000)
    staticFilesServer.start(done)
  })

  afterEach(done => {
    data.apiSandbox.restore()
    staticFilesServer.stop(done)
  })

  describe('list', () => {
    beforeEach(async () => {
      data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any)
        .returns(
          new Promise((resolve) => resolve({ data: { nameRequest: 'NR1234' } })),
        )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any)
        .returns(
          new Promise((resolve) => {
            resolve({
              data: {
                names: [
                  { choice: 1, state: 'NE', name: 'incredible name inc' },
                ],
                state: 'INPROGRESS',
                requestTypeCd: 'CR',
                applicants: '',
                nwpta: [],
                userId: 'Joe',
              },
            })
          }),
        )
      data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any)
        .returns(
          new Promise((resolve) => resolve({
            data: {
              setConflicts: {},
              names: [
                { id: 1, name: 'Incredible World LTD', source: 'CORP' },
              ],
              response: {},
            },
          })),
        )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/1', sinon.match.any)
        .returns(
          new Promise((resolve) => resolve({ data: {} })),
        )
      data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query=' + encodeURIComponent('incredible name inc'),
        sinon.match.any)
        .returns(
          new Promise((resolve) => resolve({
            data: {
              names: [],
            },
          })),
        )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any)
        .returns(
          new Promise((resolve) => {
            resolve({
              data: {
                names: [],
              },
            })
          }),
        )

      const Constructor = Vue.extend(App)
      data.instance = new Constructor({ store, router })
      data.vm = data.instance.$mount(document.getElementById('app'))
      await sleep(1000)

      data.instance.$store.state.userId = 'Joe'
      sessionStorage.setItem('AUTHORIZED', true)
      router.push('/nameExamination')
      await sleep(1000)
    })

    afterEach(() => {
      router.push('/')
    })

    it('does NOT general conflicts (garbage bucket)', () => {
      expect(data.vm.$el.querySelector('#conflicts-container')
        .textContent
        .search('Incredible World LTD'))
        .toBe(-1)
    })

    it('does NOT change conflicts tab to red', () => {
      expect(document.getElementById('conflicts1').className)
        .toMatch('c-accepted')
    })

    it('defaults tab to green', async () => {
      data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any)
        .returns(
          new Promise((resolve) => resolve({
            data: {
              setConflicts: {},
              names: [],
              response: {},
            },
          })),
        )
      const Constructor = Vue.extend(App)
      data.instance = new Constructor({ store, router })
      data.vm = data.instance.$mount(document.getElementById('app'))
      await sleep(1000)

      data.instance.$store.state.userId = 'Joe'
      sessionStorage.setItem('AUTHORIZED', true)
      await sleep(1000)

      expect(document.getElementById('conflicts1').className).toMatch('c-accepted')
    })
  })
})
