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
                    names: [],
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[
                              {name: '----INCREDIBLE NAME INC*'},
                              {name: '----INCREDIBLE NAME*'},
                              {name: '----INCREDIBLE*'},
                              {id:"0793638",name:"INCREDIBLE STEPS RECORDS, INC.",score:1.0,source:"CORP"}
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
        })

        it('displays synonym-match conflicts after exact match list', ()=>{
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(3)').textContent.trim()).toContain('Synonym Match')
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(4)').textContent.trim()).toEqual('INCREDIBLE NAME INC*');
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(5)').textContent.trim()).toEqual('No Match');
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(6)').textContent.trim()).toEqual('INCREDIBLE NAME*');
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(7)').textContent.trim()).toEqual('No Match');
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(8)').textContent.trim()).toEqual('INCREDIBLE*');
            expect(data.vm.$el.querySelector('#conflict-list option:nth-child(9)').textContent.trim()).toEqual('INCREDIBLE STEPS RECORDS, INC.');
        })

        it('populates additional attributes as expected', ()=>{
            expect(data.instance.$store.state.synonymMatchesConflicts).toEqual([
                {"class": "conflict-synonym-title", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME INC*"},
                {"class": "conflict-no-match", "source": null, "text": "No Match"},
                {"class": "conflict-synonym-title", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE NAME*"},
                {"class": "conflict-no-match", "source": null, "text": "No Match"},
                {"class": "conflict-synonym-title", "nrNumber": undefined, "source": undefined, "text": "INCREDIBLE*"},
                {"class": "conflict-result", "nrNumber": "0793638", "source": "CORP", "text": "INCREDIBLE STEPS RECORDS, INC."}])
        })

        it('resists no synonym match', (done)=>{
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
                    expect(data.vm.$el.querySelector('#conflict-list option:nth-child(4)').textContent.trim()).toEqual('No Match')
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
