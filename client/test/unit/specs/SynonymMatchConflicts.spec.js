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

describe('Synonym-Match Conflicts', () => {

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
                              {name_info: {name:'----INCREDIBLE NAME BLA* - meta1'}, stems:[]},
                              {name_info: {name:'----INCREDIBLE NAME* - meta2'}, stems:[]},
                              {name_info: {name:'----INCREDIBLE* - meta3'}, stems:[]},
                              {name_info:{id:"0793638",name:"INCREDIBLE STEPS RECORDS, INC.",score:1.0,source:"CORP"},stems:[]}
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

        it('displays synonym-match conflicts', ()=>{
            expect(data.vm.$el.querySelector('#conflict-list').textContent).toContain('INCREDIBLE STEPS RECORDS, INC.')

            // expect not to see spinner and results at the same time
            expect(data.vm.$el.querySelector('#conflict-list .synonym-match-spinner').classList.contains('hidden'));
        })

        it('displays synonym-match conflicts after exact match list', ()=>{
            var content = data.vm.$el.querySelector('#conflict-list').textContent.trim()
            expect(content.indexOf('fake exact match')).not.toEqual(-1)
            expect(content.indexOf('Synonym Match')).not.toEqual(-1)
            expect(content.indexOf('fake exact match') < content.indexOf('Synonym Match')).toEqual(true)
        })

        it('populates additional attributes as expected', ()=>{
            expect(data.instance.$store.state.synonymMatchesConflicts).toEqual([
              {"class": "conflict-synonym-title", "count": 0, "highlightedText": "INCREDIBLE NAME BLA*", "meta": "meta1", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME BLA*"},
              {"class": "conflict-synonym-title", "count": 0, "highlightedText": "INCREDIBLE NAME*", "meta": "meta2", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME*"},
              {"class": "conflict-synonym-title collapsible collapsed", "count": 1, "highlightedText": "INCREDIBLE*", "meta": "meta3", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE*"},
              {"class": "conflict-result conflict-result-hidden", "count": 0, "highlightedText": "INCREDIBLE STEPS RECORDS, INC.", "meta": undefined, "nrNumber": "0793638", "source": "CORP", "text": "INCREDIBLE STEPS RECORDS, INC."}]
)
        })

        it('highlights the stems properly', (done)=>{
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: [
                      {name_info: {name:'----PACIFIC LUMBER CONSTRUCTION - meta1'}, stems:['pacif','lumb','construct']},
                      {name_info:{id:"0193638",name:"PACIFIC LUMBER DEVELOPMENTS",score:1.0,source:"CORP"},stems:['pacif','lumb','develop']},
                      {name_info:{id:"0293638",name:"PACIFIC LOG CONSTRUCTION",score:1.0,source:"CORP"},stems:['pacif','log','construct']},
                      {name_info:{id:"0393638",name:"PACIFIC LOG RENOVATIONS",score:1.0,source:"CORP"},stems:['pacif','log','reno']},
                      {name_info: {name:'----PACIFIC LUMBER (CONSTRUCTION) - meta2'}, stems:['pacif','lumb']},
                      {name_info:{id:"0493638",name:"PACIFIC LUMBER WORD1 WORD2 WORD3 WORD4 RENOVATIONS",score:1.0,source:"CORP"},stems:['pacif','lumb','reno']},
                      {name_info: {name:'----PACIFIC (LUMBER, CONSTRUCTION) - meta3'}, stems:['pacif']},
                      {name_info:{id:"0593638",name:"PACIFIC WORD1 WORD2 WORD3 WORD4 LUMBER RENOVATIONS",score:1.0,source:"CORP"},stems:['pacif','lumb','reno']},
                    ]
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
                    expect(data.instance.$store.state.synonymMatchesConflicts).toEqual( [
                      {"class": "conflict-synonym-title collapsible expanded", "count": 3, "highlightedText": "<span class=\"stem-highlight\"> PACIF</span>IC<span class=\"stem-highlight\"> LUMB</span>ER<span class=\"stem-highlight\"> CONSTRUCT</span>ION", "meta": "meta1", "nrNumber": undefined, "source": undefined, "text": "PACIFIC LUMBER CONSTRUCTION"},
                      {"class": "conflict-result conflict-result-displayed", "count": 0, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> LUMB</span></span>ER<span class=\"synonym-stem-highlight\"> DEVELOP</span>MENTS", "meta": undefined, "nrNumber": "0193638", "source": "CORP", "text": "PACIFIC LUMBER DEVELOPMENTS"},
                      {"class": "conflict-result conflict-result-displayed", "count": 0, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC<span class=\"synonym-stem-highlight\"> LOG</span><span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> CONSTRUCT</span></span>ION", "meta": undefined, "nrNumber": "0293638", "source": "CORP", "text": "PACIFIC LOG CONSTRUCTION"},
                      {"class": "conflict-result conflict-result-displayed", "count": 0, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC<span class=\"synonym-stem-highlight\"> LOG</span><span class=\"synonym-stem-highlight\"> RENO</span>VATIONS", "meta": undefined, "nrNumber": "0393638", "source": "CORP", "text": "PACIFIC LOG RENOVATIONS"},
                      {"class": "conflict-synonym-title collapsible collapsed", "count": 1, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC<span class=\"stem-highlight\"> LUMB</span>ER (CONSTRUCTION)", "meta": "meta2", "nrNumber": undefined, "source": undefined, "text": "PACIFIC LUMBER (CONSTRUCTION)"},
                      {"class": "conflict-result conflict-result-hidden", "count": 0, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> LUMB</span></span>ER WORD1 WORD2 WORD3 WORD4<span class=\"synonym-stem-highlight\"> RENO</span>VATIONS", "meta": undefined, "nrNumber": "0493638", "source": "CORP", "text": "PACIFIC LUMBER WORD1 WORD2 WORD3 WORD4 RENOVATIONS"},
                      {"class": "conflict-synonym-title collapsible collapsed", "count": 1, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC (LUMBER, CONSTRUCTION)", "meta": "meta3", "nrNumber": undefined, "source": undefined, "text": "PACIFIC (LUMBER, CONSTRUCTION)"},
                      {"class": "conflict-result conflict-result-hidden", "count": 0, "highlightedText": "<span class=\"stem-highlight\"><span class=\"synonym-stem-highlight\"> PACIF</span></span>IC WORD1 WORD2 WORD3 WORD4<span class=\"synonym-stem-highlight\"> LUMB</span>ER<span class=\"synonym-stem-highlight\"> RENO</span>VATIONS", "meta": undefined, "nrNumber": "0593638", "source": "CORP", "text": "PACIFIC WORD1 WORD2 WORD3 WORD4 LUMBER RENOVATIONS"}
                    ])
                    done();
                }, 1000)
            }, 1000)
        })

        it('changes conflicts tab to red', (done)=>{
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
