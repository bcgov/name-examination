/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import CompName from '@/components/application/Examine/CompName';
import store from '@/store'
import axios from '@/axios-auth.js';
import sinon from 'sinon';

describe('CompName.vue', () => {

    let instance;
    beforeEach(() => {
        const Constructor = Vue.extend(CompName);
        instance = new Constructor({store:store});
        instance.$store.state.myKeycloak = {}
    })

    describe('Initialization', ()=>{
        let sandbox;
        let vm;
        beforeEach((done) => {
            sandbox = sinon.createSandbox()
            sandbox.stub(axios, 'get').withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: { nameRequest:'NR 1234'} }))
            )
            instance.$store.state.currentState = 'INPROGRESS'
            instance.$store.state.examiner = 'Joe'
            instance.$store.state.userId = instance.$store.state.examiner
            vm = instance.$mount();
            setTimeout(()=>{
                done();
            }, 100)
        })
        afterEach(() => {
            sandbox.restore()
        })

        it('shares your oldest NR', () => {
            expect(vm.$store.getters.nrNumber).toEqual('NR 1234');
        })

        it('lets you quick-approve your assigned NR', () => {
            expect(vm.$el.querySelector('#examine-quick-approve-button').textContent).toEqual('Quick Approve')
        })
    })
});
