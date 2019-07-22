/*eslint-disable*/
import staticFilesServer from '../static.files.server'
import { createApiSandbox } from '../sandbox/SynMatchConf-api-stubs'
import { cleanState } from '../../features/specs/support/clean.state'
import Vue from 'vue'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'

describe('Synonym-Match Conflicts', () => {
  let data = {}
  const Constructor = Vue.extend(App)

  beforeAll( done => {
    //createApiSandbox module exported from 'test/unit/sandbox/SynMatchConf-api-stubs.js' is a custom instance
    //of sinon.sandbox with custom stubs that allow this particular set of unit tests to run.  The API response data is
    //fully defined in that file as well as stubs of the other calls needed to initialize the app.  Refer to
    //that file for details.
    data.apiSandbox = createApiSandbox()
    staticFilesServer.start(done)
  })

  afterAll( done => {
    data.apiSandbox.restore()
    staticFilesServer.stop(done)
  })

  beforeEach( done => {
    store.replaceState(cleanState())
    data.instance = new Constructor({ store: store, router: router })
    data.vm = data.instance.$mount(document.getElementById('app'))
    data.vm.$store.state.userId = 'Joe'
    sessionStorage.setItem('AUTHORIZED', true)
    data.vm.$router.push('/nameExamination')
    setTimeout(() => { done() }, 2000)
  })

  afterEach( () => {
    router.push('/')
  })

  it('displays synonym-match conflicts', () => {
    expect(data.vm.$el.querySelector('.conflict-synonym-title').innerHTML)
    .toContain(`<div class=\"flex grow\"><span><span class=\"stem-highlight\"> HOT</span><span class=\"stem-highlight\"> BOOGI</span>E<span class=\"stem-highlight\"> BOARD</span>S</span> <span class=\"conflict-meta\"> - PROXIMITY SEARCH</span></div>`)
    expect(data.vm.$el.querySelector('#conflicts-container .conflict-container-spinner')
    .classList.contains('hidden'))
  })

  it('displays synonym-match conflicts after exact match list', () => {
    var content = data.vm.$el.querySelector('#conflicts-container').textContent.trim()
    expect(content.indexOf('fake exact match')).not.toEqual(-1)
    expect(content.indexOf('Synonym Match')).not.toEqual(-1)
    expect(content.indexOf('fake exact match') < content.indexOf('Synonym Match')).toEqual(true)
  })

  it('changes conflicts tab to red', () => {
    expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-priority')
  })

  describe('clearing the conflicts', () => {
    beforeEach((done) => {
      data.vm.$store.commit('setExactMatchesConflicts', [])
      data.vm.$store.commit('setSynonymMatchesConflicts', [])
      data.vm.$store.commit('setCobrsPhoneticConflicts', [])
      data.vm.$store.commit('setPhoneticConflicts', [])
      setTimeout(() => { done() }, 2000)
    })

    it('the conflict icon defaults to green', () => {
      expect(data.vm.$el.querySelector('#conflicts1').className).toContain('c-accepted')
    })
  })

  it('highlights the stems properly', () => {
    expect(data.vm.$store.state.parsedSynonymConflicts).toEqual([
        {
          "children": [],
          "class": "conflict-synonym-title",
          "count": 0,
          "highlightedText": "",
          "id": "0-synonym",
          "meta": "",
          "text": ""
        },
        {
          "children": [],
          "class": "conflict-synonym-title",
          "count": 0,
          "highlightedText": "",
          "id": "1-synonym",
          "meta": "",
          "text": ""
        },
        {
          "children": [],
          "class": "conflict-synonym-title",
          "count": 0,
          "highlightedText": "",
          "id": "2-synonym",
          "meta": "",
          "text": ""
        },
        {
          "children": [],
          "class": "conflict-synonym-title",
          "count": 0,
          "highlightedText": "",
          "id": "3-synonym",
          "meta": "",
          "text": ""
        },
        {
          "children": [
            {
              "class": "conflict-result",
              "highlightedText": "<span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"><span class=\"stem-highlight\"> HOT</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span> BIKES AND<span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"><span class=\"synonym-stem-highlight\"> BOARD</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>S LTD.",
              "id": "5-synonym",
              "jurisdiction": "BC",
              "meta": undefined,
              "nrNumber": "0826947",
              "source": "CORP",
              "startDate": "2008-06-05T10:05:24Z",
              "text": "HOT BIKES AND BOARDS LTD."
            }
          ],
          "class": "conflict-synonym-title",
          "count": 1,
          "highlightedText": "",
          "id": "4-synonym",
          "meta": "",
          "text": ""
        },
        {
          "children": [],
          "class": "conflict-synonym-title",
          "count": 0,
          "highlightedText": "",
          "id": "6-synonym",
          "meta": "",
          "text": ""
        }
      ]
    )
  })
})



