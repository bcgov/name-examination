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

describe('Conflicts', () => {

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
            data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    setConflicts: {},
                    names: [
                        { id:1, name:'Incredible World LTD', source:'CORP' }
                    ],
                    response: {}
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/1', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {} }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/exact-match?query='+encodeURIComponent('incredible name inc'), sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: [],
                } }))
            )
            data.apiSandbox.getStub.withArgs('/api/v1/requests/synonymbucket/ incredible name inc', sinon.match.any).returns(
                new Promise((resolve) => {
                    resolve({
                        data: {
                            names:[]
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

        it('does NOT general conflicts (garbage bucket)', ()=>{
            expect(data.vm.$el.querySelector('#conflict-list').textContent.search('Incredible World LTD')).toBe(-1);
        })

        it('does NOT change conflicts tab to red', ()=>{
            expect(document.getElementById('Conflict1').className).toEqual('icon icon-pass')
            expect(document.getElementById('Conflict2').className).toEqual('fa fa-check')
        })

        it('defaults tab to green', (done)=>{
            data.apiSandbox.postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    setConflicts: {},
                    names: [],
                    response: {}
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
