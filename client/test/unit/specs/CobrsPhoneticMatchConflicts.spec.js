/*eslint-disable*/
import staticFilesServer from '../static.files.server';
import {createApiSandbox, sinon} from '../../features/specs/support/api.stubs'
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import Datatable from 'vue2-datatable-component'

Vue.use(Vuelidate)
Vue.use(require('vue-shortkey'))
Vue.use(Datatable)
import App from '@/App.vue';
import store from '@/store'
import router from '@/router'

describe('CobrsPhoneticMatches', () => {

  let data = {};

  beforeEach((done) => {
    data.apiSandbox = createApiSandbox()
    jest.setTimeout(100000);
    staticFilesServer.start(done)
  })
  afterEach((done) => {
    data.apiSandbox.restore()
    staticFilesServer.stop(done)
  })

  describe('list', () => {

    beforeEach((done) => {
      data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
        new Promise((resolve) => resolve({data: {nameRequest: 'NR1234'}}))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
        new Promise((resolve) => {
          resolve({
            data: {
              names: [
                {choice: 1, state: 'NE', name: 'incredible name inc'}
              ],
              state: 'INPROGRESS',
              requestTypeCd: 'CR',
              applicants: '',
              nwpta: [],
              userId: 'Joe'
            }
          })
        })
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/1', sinon.match.any).returns(
        new Promise((resolve) => resolve({data: {}}))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query=' + encodeURIComponent('incredible name inc'), sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: [{name: 'fake exact match'}],
          }
        }))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', sinon.match.any).returns(
        new Promise((resolve) => {
          resolve({
            data: {
              names: [
                {name_info: {name: '----INCREDIBLE NAME INC - meta1'}, stems: []},
                {name_info: {name: '----INCREDIBLE NAME - meta2'}, stems: []},
                {name_info: {name: '----INCREDIBLE - meta3'}, stems: []},
                {
                  name_info: {
                    id: "0693638",
                    name: "INCREDIBLE STEPS RECORDS, INC.",
                    score: 1.0,
                    source: "CORP"
                  }, stems: []
                }
              ]
            }
          })
        })
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', sinon.match.any).returns(
        new Promise((resolve) => {
          resolve({
            data: {
              names: [
                {name_info: {name: '----INCREDIBLE NAME INC'}, stems: []},
                {name_info: {name: '----INCREDIBLE NAME'}, stems: []},
                {name_info: {name: '----INCREDIBLE'}, stems: []},
                {
                  name_info: {
                    id: "0793638",
                    name: "INCREDYBLE STEPS RECORDS, INC.",
                    score: 1.0,
                    source: "CORP"
                  }, stems: []
                }
              ]
            }
          })
        })
      )
      const Constructor = Vue.extend(App);
      data.instance = new Constructor({store: store, router: router});
      data.vm = data.instance.$mount(document.getElementById('app'));
      setTimeout(() => {
        data.instance.$store.state.userId = 'Joe'
        sessionStorage.setItem('AUTHORIZED', true)
        router.push('/nameExamination')
        setTimeout(() => {
          done();
        }, 1000)
      }, 1000)
    })

    it('displays cobrs-phonetic-match conflicts', () => {
      expect(data.vm.$el.querySelector('#conflict-list').textContent).toContain('INCREDYBLE STEPS RECORDS, INC.')

      // expect not to see spinner and results at the same time
      expect(data.vm.$el.querySelector('#conflict-list .cobrs-phonetic-match-spinner').classList.contains('hidden'));
    })

    it('displays cobrs-phonetics conflicts after synonym bucket list', () => {
      var content = data.vm.$el.querySelector('#conflict-list').textContent.trim()
      expect(content.indexOf('INCREDIBLE STEPS RECORDS, INC.')).not.toEqual(-1)
      expect(content.indexOf('Character Swap Match')).not.toEqual(-1)
      expect(content.indexOf('INCREDIBLE STEPS RECORDS, INC.') < content.indexOf('Character Swap Match')).toEqual(true)
    })

    it('populates additional attributes as expected', () => {
      expect(data.instance.$store.state.cobrsPhoneticConflicts).toEqual([
        {
          "class": "conflict-cobrs-phonetic-title",
          "count": 0,
          "highlightedText": "INCREDIBLE NAME INC",
          "meta": undefined,
          "nrNumber": undefined,
          "source": undefined,
          "text": "INCREDIBLE NAME INC"
        },
        {
          "class": "conflict-cobrs-phonetic-title",
          "count": 0,
          "highlightedText": "INCREDIBLE NAME",
          "meta": undefined,
          "nrNumber": undefined,
          "source": undefined,
          "text": "INCREDIBLE NAME"
        },
        {
          "class": "conflict-cobrs-phonetic-title collapsible collapsed",
          "count": 1,
          "highlightedText": "INCREDIBLE",
          "meta": undefined,
          "nrNumber": undefined,
          "source": undefined,
          "text": "INCREDIBLE"
        },
        {
          "class": "conflict-result conflict-result-hidden",
          "count": 0,
          "highlightedText": "INCREDYBLE STEPS RECORDS, INC.",
          "meta": undefined,
          "nrNumber": "0793638",
          "source": "CORP",
          "text": "INCREDYBLE STEPS RECORDS, INC."
        }])
    })

    it('changes conflicts tab to red', (done) => {
      data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query=' + encodeURIComponent('incredible name inc'), sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: [],
          }
        }))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: []
          }
        }))
      )
      const Constructor = Vue.extend(App);
      data.instance = new Constructor({store: store, router: router});
      data.vm = data.instance.$mount(document.getElementById('app'));
      setTimeout(() => {
        data.instance.$store.state.userId = 'Joe'
        sessionStorage.setItem('AUTHORIZED', true)
        router.push('/nameExamination')
        setTimeout(() => {
          expect(document.getElementById('conflicts1').className).toMatch('c-priority')
          done();
        }, 1000)
      }, 1000)
    })

    it('defaults to green', (done) => {
      data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query=' + encodeURIComponent('incredible name inc'), sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: [],
          }
        }))
      )
      data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            setConflicts: {},
            names: [],
            response: {}
          }
        }))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc/*', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: []
          }
        }))
      )
      data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc/*', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data: {
            names: []
          }
        }))
      )
      const Constructor = Vue.extend(App);
      data.instance = new Constructor({store: store, router: router});
      data.vm = data.instance.$mount(document.getElementById('app'));
      setTimeout(() => {
        data.instance.$store.state.userId = 'Joe'
        sessionStorage.setItem('AUTHORIZED', true)
        router.push('/nameExamination')
        setTimeout(() => {
          expect(document.getElementById('conflicts1').className).toMatch('c-accepted')
          done();
        }, 1000)
      }, 1000)
    })
  })
})
