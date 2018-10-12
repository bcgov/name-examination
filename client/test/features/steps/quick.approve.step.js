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
import fs from 'fs';

defineFeature(feature, test => {

    let instance;
    let vm;
    let staticFilesServer;
    let sandbox;
    let getStub;
    let postStub;
    let putStub;
    let patchStub;

    beforeEach(() => {
        jest.setTimeout(100000);
    });
    afterEach((done)=>{
        sandbox.restore()
        staticFilesServer.close(done)
    })

    test('Joe can quickly approve the next examination assigned to him', ({ given, when, then }) => {

        given('Joe accesses Name examination', () => {
            return new Promise((done) => {
                sandbox = sinon.createSandbox()
                putStub = sandbox.stub(axios, 'put');
                postStub = sandbox.stub(axios, 'post');
                getStub = sandbox.stub(axios, 'get');
                patchStub = sandbox.stub(axios, 'patch');
                getStub.withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { nameRequest:'NR1234' } }))
                )
                getStub.withArgs('/api/v1/requests/decisionreasons', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: { listDecisionReasons:[] } }))
                )
                getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: {
                        names:[
                            { choice:1, state:'NE', name:'Incredible name' }
                        ],
                        state: 'INPROGRESS',
                        requestTypeCd: 'CR',
                        applicants: '',
                        nwpta: [],
                        userId: 'Joe'
                    } }))
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
                putStub.withArgs('/api/v1/requests/NR1234/names/1', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: {
                    } }))
                )
                patchStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: {
                    } }))
                )
                staticFilesServer = http.createServer((request, response)=>{
                    console.log(request.method, request.url);
                    response.setHeader('Access-Control-Allow-Origin', '*')
                    if ('/static/config/configuration.json' == request.url) {
                        response.write(JSON.stringify([{ URL:'' }]))
                    }
                    else {
                        if (request.url.indexOf('/static/') == 0) {
                            let content = fs.readFileSync(decodeURIComponent('.'+request.url)).toString();
                            response.write(content);
                        }
                    }
                    response.end();
                }).listen(5001, ()=>{
                    const Constructor = Vue.extend(App);
                    instance = new Constructor({store:store, router:router});
                    vm = instance.$mount();
                    setTimeout(()=>{
                        instance.$store.state.myKeycloak = {}
                        instance.$store.state.currentState = 'INPROGRESS'
                        instance.$store.state.examiner = 'Joe'
                        instance.$store.state.userId = 'Joe'
                        instance.$store.state.requestTypeRules = []
                        localStorage.setItem('AUTHORIZED', true)
                        router.push('/nameExamination')
                        setTimeout(()=>{
                            expect(vm.$el.querySelector('#examine-quick-approve-button').textContent).toEqual('Quick Approve')
                            done();
                        }, 5000)
                    }, 2000)
                })
            });
        });

        when('Joe quickly approves the presented name', () => {
            return new Promise((done) => {
                getStub.withArgs('/api/v1/requests/NR1234', sinon.match.any).returns(
                    new Promise((resolve) => resolve({ data: {
                        names:[
                            { choice:1, state:'E', name:'Incredible name' }
                        ],
                        state: 'APPROVED',
                        requestTypeCd: 'CR',
                        applicants: '',
                        nwpta: [],
                        userId: 'Joe'
                    } }))
                )
                console.log(vm.$el.innerHTML)
                let button = vm.$el.querySelector('#examine-quick-approve-button');
                let window = button.ownerDocument.defaultView;
                var click = new window.Event('click');
                button.dispatchEvent(click);
                setTimeout(()=>{
                    done();
                }, 5000)
            })
        });

        then('Joe sees that the request is now approved', () => {
            expect(vm.$el.querySelector('#div1').textContent).toContain('Status: APPROVED')
        });
    });
});
