import { loadFeature, defineFeature } from 'jest-cucumber';
const feature = loadFeature('./test/features/quick.approve.feature');

import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import App from '@/App.vue';
import store from '@/store'
import router from '@/router'
import axios from '@/axios-auth.js';
import sinon from 'sinon';
import http from 'http';

import staticFilesServer from '../../unit/static.files.server';

defineFeature(feature, test => {

    let instance;
    let vm;
    let sandbox;
    let getStub;
    let postStub;
    let putStub;
    let patchStub;

    beforeEach((done) => {
        jest.setTimeout(100000);
        staticFilesServer.start(done)
    });
    afterEach((done)=>{
        sandbox.restore()
        staticFilesServer.stop(done)
    })

    test('Joe can quickly approve the next examination assigned to him', ({ given, when, then }) => {

        let owner;

        given(/^(.*) has an (.*) assigned name request (.*)$/, (user, state, nr) => {
            owner = user
            sandbox = sinon.createSandbox()
            putStub = sandbox.stub(axios, 'put');
            postStub = sandbox.stub(axios, 'post');
            getStub = sandbox.stub(axios, 'get');
            patchStub = sandbox.stub(axios, 'patch');
            getStub.withArgs('/api/v1/requests/decisionreasons', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: { listDecisionReasons:[] } }))
            )
            postStub.withArgs('/api/v1/documents:conflicts', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    setConflicts: {},
                    names: [],
                    response: {}
                } }))
            )
            postStub.withArgs('/api/v1/documents:trademarks', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )
            postStub.withArgs('/api/v1/documents:restricted_words', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    restricted_words_conditions: []
                } }))
            )
            postStub.withArgs('/api/v1/documents:histories', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names: []
                } }))
            )


            getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: { nameRequest:nr } }))
            )
            getStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                    names:[
                        { choice:1, state:'NE', name:'Incredible name' }
                    ],
                    state: state,
                    requestTypeCd: 'CR',
                    applicants: '',
                    nwpta: [],
                    userId: user
                } }))
            )
            putStub.withArgs('/api/v1/requests/'+nr+'/names/1', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                } }))
            )
            patchStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: {
                } }))
            )
        })

        when(/^(.*) accesses Name examination$/, (userId) => {
            return new Promise((done) => {
                const Constructor = Vue.extend(App);
                instance = new Constructor({store:store, router:router});
                vm = instance.$mount(document.getElementById('app'));
                setTimeout(()=>{
                    instance.$store.state.myKeycloak = {}
                    instance.$store.state.currentState = 'INPROGRESS'
                    instance.$store.state.userId = userId
                    instance.$store.state.requestTypeRules = []
                    sessionStorage.setItem('AUTHORIZED', true)
                    router.push('/nameExamination')
                    setTimeout(()=>{
                        done();
                    }, 1000)
                }, 1000)
            });
        });

        then(/^he sees that he can quickly approve (.*)$/, (nr)=>{
            expect(vm.$el.querySelector('#examine-quick-approve-button').textContent).toEqual('Quick Approve')
            expect(vm.$el.querySelector('#div1').textContent).toContain(nr)
            expect(vm.$el.querySelector('#div1').textContent).toContain('Status: INPROGRESS')
        })


        when(/^he quickly approves (.*)/, (nr) => {
            return new Promise((done) => {
                getStub.withArgs('/api/v1/requests/'+nr, sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: {
                        names:[
                            { choice:1, state:'E', name:'Incredible name' }
                        ],
                        state: 'APPROVED',
                        requestTypeCd: 'CR',
                        applicants: '',
                        nwpta: [],
                        userId: owner
                    } }))
                )
                let button = vm.$el.querySelector('#examine-quick-approve-button');
                let window = button.ownerDocument.defaultView;
                var click = new window.Event('click');
                button.dispatchEvent(click);
                setTimeout(()=>{
                    done();
                }, 1000)
            })
        });

        then(/^he sees that (.*) is now (.*)/, (nr, state) => {
            expect(vm.$el.querySelector('#div1').textContent).toContain(nr)
            expect(vm.$el.querySelector('#div1').textContent).toContain('Status: APPROVED')
        });
    });
});
