/*eslint-disable*/
import staticFilesServer from '../static.files.server'
import { createApiSandbox, sinon } from '../../features/specs/support/api.stubs'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import { cleanState } from '../../features/specs/support/clean.state'
import { sleep } from '@/utils/sleep'

const { any } = sinon.match

describe('PhoneticMatchesConflict Spec', () => {
  describe('When there are conflicts returned by the backend', () => {
    let data = {}
    const Constructor = Vue.extend(App)

    beforeAll(done => {
      data.apiSandbox = createApiSandbox()
      let { getStub } = data.apiSandbox

      getStub.withArgs('/api/v1/requests/queues/@me/oldest', any).resolves({
        data: { nameRequest: 'NR1234' }
      })
      getStub.withArgs('/api/v1/requests/NR1234', any).resolves({
        data: {
          names: [
            { choice: 1, state: 'NE', name: 'incredible name inc' },
          ],
          state: 'INPROGRESS',
          requestTypeCd: 'CR',
          applicants: '',
          nwpta: [],
          userId: 'Joe',
        }
      })
      getStub.withArgs('/api/v1/requests/1', any).resolves({
        data: {}
      })
      getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), any,).resolves({
        data: {
          names: [{ name: 'fake exact match' }]
        }
      })
      getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC - meta1' }, stems: [] },
            { name_info: { name: '----INCREDIBLE NAME - meta2' }, stems: [] },
            { name_info: { name: '----INCREDIBLE - meta3' }, stems: [] }
          ]
        }
      })
      getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC' }, stems: [] },
            { name_info: { name: '----INCREDIBLE NAME' }, stems: [] },
            { name_info: { name: '----INCREDIBLE' }, stems: [] },
            { name_info: {
                id: '0793638',
                name: 'INCREDYBLE STEPS RECORDS, INC.',
                score: 1.0, jurisdiction: 'BC',
                start_date: '1986-10-26',
                source: 'CORP',
              },
              stems: [],
            }
          ]
        }
      })
      getStub.withArgs('/api/v1/requests/phonetics/incredible name inc/*', any).resolves({
        data: {
          names: [
            { name_info: { name: '----INCREDIBLE NAME INC' }, stems: [] },
            { name_info: { name: '----INCREDIBLE NAME' }, stems: [] },
            { name_info: { name: '----INCREDIBLE' }, stems: [] },
            {
              name_info: {
                id: '0893638',
                name: 'INKREDABLE STEPS RECORDS, INC.',
                score: 1.0,
                meta: 'none',
                jurisdiction: 'BC',
                start_date: '1986-10-26',
                source: 'CORP',
              },
              stems: [],
            },
          ],
        },
      })
      staticFilesServer.start(done)
    })

    afterAll(done => {
      data.apiSandbox.restore()
      staticFilesServer.stop(done)
    })

    beforeEach(async ()  => {
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
    xtest('displays phonetic-match conflicts', () => {
      expect(data.vm.$el.querySelector('#conflicts-container').textContent).toContain(
        'INCREDYBLE STEPS RECORDS, INC'
      )
      expect(data.vm.$el.querySelector('.conflict-container-spinner').classList).toContain('hidden')
    })

    // FUTURE: fix
    xtest('displays phonetic-match conflicts after cobrs-phonetic match list', () => {
      var content = data.vm.$el.querySelector('#conflicts-container').textContent.trim()
      expect(content.indexOf('Character Swap Match')).not.toEqual(-1)
      expect(content.indexOf('Phonetic Match (experimental)')).not.toEqual(-1)
      expect(
        content.indexOf('Phonetic Match (experimental)')
        > content.indexOf('Character Swap Match')
      ).toEqual(true)
    })

    // FUTURE: fix
    xtest('displays the conflicts tab in red', () => {
      expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-priority')
    })

    // FUTURE: fix
    xtest('populates additional attributes as expected', () => {
      expect(data.vm.$store.state.parsedPhoneticConflicts).toEqual([
        {
          "children": [],
          "class": "conflict-phonetic-title",
          "count": 0,
          "highlightedText": "INCREDIBLE NAME INC",
          "id": "0-phonetic",
          "meta": undefined,
          "text": "INCREDIBLE NAME INC"
        },
        {
          "children": [],
          "class": "conflict-phonetic-title",
          "count": 0,
          "highlightedText": "INCREDIBLE NAME",
          "id": "1-phonetic",
          "meta": undefined,
          "text": "INCREDIBLE NAME"
        },
        {
          "children": [
            {
              "class": "conflict-result",
              "highlightedText": "INKREDABLE STEPS RECORDS, INC.",
              "id": "3-phonetic",
              "jurisdiction": "BC",
              "meta": "none",
              "nrNumber": "0893638",
              "source": "CORP",
              "startDate": "1986-10-26",
              "text": "INKREDABLE STEPS RECORDS, INC."
            }
          ],
          "class": "conflict-phonetic-title",
          "count": 1,
          "highlightedText": "INCREDIBLE",
          "id": "2-phonetic",
          "meta": undefined,
          "text": "INCREDIBLE"
        }
      ])
    })
  })

  describe('When there are no phonetic conflicts or conflicts', () => {
    let data = {}
    let Constructor = Vue.extend(App)

    beforeAll(async done => {
      data.api = createApiSandbox()
      let { getStub } = data.api

      getStub.withArgs('/api/v1/requests/queues/@me/oldest', any).resolves({
        data: { nameRequest: 'NR1234' }
      })
      getStub.withArgs('/api/v1/requests/NR1234', any).resolves({
        data: {
          names: [{ choice: 1, state: 'NE', name: 'incredible name inc' }],
          state: 'INPROGRESS',
          requestTypeCd: 'CR',
          applicants: '',
          nwpta: [],
          userId: 'Joe',
        },
      })
      getStub.withArgs('/api/v1/requests/1', any).resolves({
        data: {},
      })
      getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/requests/phonetics/incredible name inc/*', any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', any).resolves({
        data: {
          names: [],
        },
      })
      getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), any).resolves({
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
      expect(data.vm.$store.state.phoneticConflicts.length === 0).toBeTruthy()
    })

    // FUTURE: fix
    xtest('defaults the conflicts tab to green when there are no conflicts', () => {
      expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-accepted')
    })
  })
})
