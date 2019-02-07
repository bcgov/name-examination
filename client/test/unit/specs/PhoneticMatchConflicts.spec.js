/*eslint-disable*/
import staticFilesServer from '../static.files.server';
import { createApiSandbox, sinon } from '../../features/specs/support/api.stubs'
import Vue from 'vue';
import Vuelidate from 'vuelidate'
import Datatable from 'vue2-datatable-component'
Vue.use(Vuelidate)
Vue.use(require('vue-shortkey'))
Vue.use(Datatable)
import App from '@/App.vue';
import store from '@/store'
import router from '@/router'

describe('PhoneticMatches', () => {

    let data = {};

    beforeEach((done) => {
        data.apiSandbox = createApiSandbox()
        jest.setTimeout(100000);
        staticFilesServer.start(done)
    })
    afterEach((done)=>{
        data.apiSandbox.restore()
        staticFilesServer.stop(done)
    })

    describe('list', ()=>{

        beforeEach((done)=>{
            data.apiSandbox.getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { nameRequest:'NR1234' } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                                { choice:1, state:'NE', name:'incredible name inc' }
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
                new Promise((resolve) => resolve({ data: {} }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: [ {name: 'fake exact match'} ],
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                              {name_info:{name: '----INCREDIBLE NAME INC - meta1'},stems:[]},
                              {name_info:{name: '----INCREDIBLE NAME - meta2'},stems:[]},
                              {name_info:{name: '----INCREDIBLE - meta3'},stems:[]},
                            ]
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                              {name_info:{name: '----INCREDIBLE NAME INC'},stems:[]},
                              {name_info:{name: '----INCREDIBLE NAME'},stems:[]},
                              {name_info:{name: '----INCREDIBLE'},stems:[]},
                              {name_info:{id:"0793638",name:"INCREDYBLE STEPS RECORDS, INC.",score:1.0,source:"CORP"},stems:[]}
                            ]
                        }
                    })
                })
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/phonetics/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                              {name_info:{name: '----INCREDIBLE NAME INC'},stems:[]},
                              {name_info:{name: '----INCREDIBLE NAME'},stems:[]},
                              {name_info:{name: '----INCREDIBLE'},stems:[]},
                              {name_info:{id:"0893638",name:"INKREDABLE STEPS RECORDS, INC.",score:1.0,source:"CORP"},stems:[]}
                            ]
                        }
                    })
                })
            )
            const Constructor = Vue.extend(App);
            data.instance = new Constructor({store:store, router:router});
            data.vm = data.instance.$mount(document.getElementById('app'));
            setTimeout(()=>{
                data.instance.$store.state.userId = 'Joe'
                sessionStorage.setItem('AUTHORIZED', true)
                router.push('/nameExamination')
                setTimeout(()=>{
                    done();
                }, 1000)
            }, 1000)
        })

        it('displays phonetic-match conflicts', ()=>{
            expect(data.vm.$el.querySelector('#conflict-list').textContent).toContain('INKREDABLE STEPS RECORDS, INC.')

            // expect not to see spinner and results at the same time
            expect(data.vm.$el.querySelector('#conflict-list .phonetic-match-spinner').classList.contains('hidden'));
        })

        it('displays phonetic-match conflicts after cobrs-phonetic match list', ()=>{
            var content = data.vm.$el.querySelector('#conflict-list').textContent.trim()

            expect(content.indexOf('INCREDYBLE STEPS RECORDS, INC.')).not.toEqual(-1)
            expect(content.indexOf('Phonetic Match (experimental)')).not.toEqual(-1)
            expect(content.indexOf('INCREDYBLE STEPS RECORDS, INC.') < content.indexOf('Phonetic Match (experimental)')).toEqual(true)
        })

        it('populates additional attributes as expected', ()=>{
            expect(data.instance.$store.state.phoneticConflicts).toEqual([
              {"class": "conflict-phonetic-title", "count": 0, "highlightedText": "INCREDIBLE NAME INC", "meta": undefined, "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME INC"},
              {"class": "conflict-phonetic-title", "count": 0, "highlightedText": "INCREDIBLE NAME", "meta": undefined, "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME"},
              {"class": "conflict-phonetic-title collapsible collapsed", "count": 1, "highlightedText": "INCREDIBLE", "meta": undefined, "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE"},
              {"class": "conflict-result conflict-result-hidden", "count": 0, "highlightedText": "INKREDABLE STEPS RECORDS, INC.", "meta": undefined, "nrNumber": "0893638", "source": "CORP", "text": "INKREDABLE STEPS RECORDS, INC."}]
)
        })

        it('changes conflicts tab to red', (done)=>{
            data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: [],
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            const Constructor = Vue.extend(App);
            data.instance = new Constructor({store:store, router:router});
            data.vm = data.instance.$mount(document.getElementById('app'));
            setTimeout(()=>{
                data.instance.$store.state.userId = 'Joe'
                sessionStorage.setItem('AUTHORIZED', true)
                router.push('/nameExamination')
                setTimeout(()=>{
                    expect(document.getElementById('Conflict1').className).toEqual('icon icon-fail')
                    expect(document.getElementById('Conflict2').className).toEqual('fa fa-times')
                    done();
                }, 1000)
            }, 1000)
        })

        it('defaults to green', (done)=>{
			      data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: [  ],
                } }))
            )
            data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    setConflicts: {},
                    names: [],
                    response: {}
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/cobrsphonetics/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/phonetics/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            const Constructor = Vue.extend(App);
            data.instance = new Constructor({store:store, router:router});
            data.vm = data.instance.$mount(document.getElementById('app'));
            setTimeout(()=>{
                data.instance.$store.state.userId = 'Joe'
                sessionStorage.setItem('AUTHORIZED', true)
                router.push('/nameExamination')
                setTimeout(()=>{
                    expect(document.getElementById('Conflict1').className).toEqual('icon icon-pass')
                    expect(document.getElementById('Conflict2').className).toEqual('fa fa-check')
                    done();
                }, 1000)
            }, 1000)
        })
    })
})
