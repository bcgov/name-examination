import App from '@/App.vue'
import router from '@/router'
import staticFilesServer from '../static.files.server'
import store from '@/store'
import Vue from 'vue'
import { cleanState } from '../../features/specs/support/clean.state'
import { createApiSandbox, sinon } from '../../features/specs/support/api.stubs'
import { sleep } from '@/utils/sleep'

const encode = encodeURIComponent

describe('Exact Match Conflict Handling by ConflictList', () => {
  describe('When the backend returns exact matches', () => {
    let data = {}
    let Constructor = Vue.extend(App)

    beforeAll(async done => {
      data.api = createApiSandbox()
      let { getStub } = data.api

      getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).resolves({
        data: { nameRequest: 'NR1234' },
      })
      getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).resolves({
        data: {
          names: [{ choice: 1, state: 'NE', name: 'incredible name inc' }],
          state: 'INPROGRESS',
          requestTypeCd: 'CR',
          applicants: '',
          nwpta: [],
          userId: 'Joe',
        },
      })
      getStub.withArgs('/api/v1/requests/1', sinon.match.any).resolves({
        data: { names: [] },
      })
      getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC - meta1' }, stems: [], },
            { name_info: { name: '----INCREDIBLE NAME - meta2' }, stems: [], },
            { name_info: { name: '----INCREDIBLE - meta3' }, stems: [] },
            { name_info: { id: '0693638', name: 'INCREDIBLE STEPS RECORDS', score: 1.0, source: 'CORP', }, stems: [], },
          ],
        },
      })
      getStub.withArgs('/api/v1/requests/phonetics/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC - meta1' }, stems: [], },
            { name_info: { name: '----INCREDIBLE NAME - meta2' }, stems: [], },
            { name_info: { name: '----INCREDIBLE - meta3' }, stems: [] },
            { name_info: { id: '0693638', name: 'INCREDIBLE STEPS RECORDS', score: 1.0, source: 'CORP', }, stems: [], },
          ],
        },
      })
      getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC' }, stems: [], },
            { name_info: { name: '----INCREDIBLE NAME' }, stems: [], },
            { name_info: { name: '----INCREDIBLE' }, stems: [] },
            { name_info: { id: '0793638', name: 'INCREDYBLE STEPS RECORDS', score: 1.0, source: 'CORP', }, stems: [], },
          ],
        },
      })
      getStub.withArgs('/api/v1/exact-match?query=' + encode('incredible name inc'), sinon.match.any).resolves({
        data: {
          'names': [{
            'id': '12345',
            'jurisdiction': 'BC',
            'name': 'INCREDIBLE NAME INC',
            'source': 'CORP',
            'start_date': '2006-01-05T14:45:42Z',
          }],
        },
      })
      await sleep(2000)
      staticFilesServer.start(done)
    })

    afterAll(done => {
      data.api.restore()
      staticFilesServer.stop(done)
    })

    beforeEach(async () => {
      store.replaceState(cleanState())
      data.instance = new Constructor({ store, router })
      data.vm = data.instance.$mount(document.getElementById('app'))
      data.vm.$store.state.userId = 'Joe'
      sessionStorage.setItem('AUTHORIZED', true)
      data.vm.$router.push('/nameExamination')
      await sleep(2000)
    })

    afterEach(() => {
      router.push('/')
    })

    // FUTURE: fix
    xtest('displays exact-match conflicts', () => {
      expect(data.vm.$el.querySelector('#conflicts-container').innerHTML).toContain('INCREDIBLE NAME INC')
      expect(data.vm.$el.querySelector('.conflict-container-spinner').classList).toContain('hidden')
    })

    // FUTURE: fix
    xtest('displays exact-match conflicts before Synonym conflicts', () => {
      let inHTML = data.vm.$el.querySelector('#conflicts-container').innerHTML
      expect(
        inHTML.indexOf('INCREDIBLE NAME INC')
        < inHTML.indexOf('Exact Word Order + Synonym Match')
        < inHTML.indexOf('Character Swap Match')
        < inHTML.indexOf('Phonetic Match (experimental)')
      ).toBeTruthy()
    })

    // FUTURE: fix
    xtest('changes conflicts tab to red', () => {
      expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-priority')
    })

    // FUTURE: fix
    xtest('populates additional attributes as expected', () => {
      expect(data.vm.$store.state.exactMatchesConflicts).toEqual([
        {
          'class': 'conflict-result conflict-exact-match',
          'highlightedText': 'INCREDIBLE NAME INC',
          'id': '0-exact',
          'jurisdiction': 'BC',
          'nrNumber': '12345',
          'source': 'CORP',
          'startDate': '2006-01-05T14:45:42Z',
          'text': 'INCREDIBLE NAME INC',
        },
      ])
    })
  })

  describe('When no matches or exact matches are returned', () => {
    let data = {}
    let Constructor = Vue.extend(App)

    beforeAll(async done => {
      data.api = createApiSandbox()
      let { getStub } = data.api

      getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).resolves({
        data: { nameRequest: 'NR1234' }
      })
      getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).resolves({
        data: {
          names: [{ choice: 1, state: 'NE', name: 'incredible name inc' }],
          state: 'INPROGRESS',
          requestTypeCd: 'CR',
          applicants: '',
          nwpta: [],
          userId: 'Joe',
        },
      })
      getStub.withArgs('/api/v1/requests/1', sinon.match.any).resolves({
        data: {},
      })
      getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/requests/phonetics/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', sinon.match.any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/exact-match?query=' + encode('incredible name inc'), sinon.match.any).resolves({
        data: {
          names: [],
        },
      })
      await sleep(2000)
      staticFilesServer.start(done)
    })

    afterAll(done => {
      data.api.restore()
      staticFilesServer.stop(done)
    })

    beforeEach(async () => {
      store.replaceState(cleanState())
      data.instance = new Constructor({ store, router })
      data.vm = data.instance.$mount(document.getElementById('app'))
      data.vm.$store.state.userId = 'Joe'
      sessionStorage.setItem('AUTHORIZED', true)
      data.vm.$router.push('/nameExamination')
      await sleep(2000)
    })

    afterEach(() => {
      router.push('/')
    })

    // FUTURE: fix
    xtest('renders normally with the no exact matches notice', () => {
      expect(data.vm.$el.querySelector('.conflict-no-match')).toBeDefined()
      expect(data.vm.$el.querySelector('.conflict-container-spinner').classList).toContain('hidden')
    })

    // FUTURE: fix
    xtest('defaults the conflicts tab to green when there are no conflicts', () => {
      expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-accepted')
    })
  })
})
