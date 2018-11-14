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
        instance.$store.state.myKeycloak = {};
        instance.setFocus = () => {};
    });

    describe('Initialization', ()=>{
        let sandbox;
        let vm;
        beforeEach((done) => {
            sandbox = sinon.createSandbox();
            sandbox.stub(axios, 'get').withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
                new Promise((resolve) => resolve({ data: { nameRequest:'NR 1234'} }))
            );
            instance.$store.state.currentState = 'INPROGRESS';
            instance.$store.state.examiner = 'Joe';
            instance.$store.state.userId = instance.$store.state.examiner;

            instance.$store.state.compInfo.compNames = {
                compName1:
                  {choice: 1,
                    name: "Bad Name",
                    state: 'REJECTED',
                    decision_text: "A Foreign Entity That Is Registering In British Columbia As An Extraprovincial Company And Adopting An Assumed Name Must Provide The Registrar With A Covering Letter Attaching An Undertaking To Carry On Business Under The Assumed Name.  Sample Working For The Undertaking Can Be Found On Page 34 Of The Information For Registration Of An "},
                compName2: {choice: 2, name: "Good Name", state: 'NE'},
                compName3: {choice: 3, name: null, state: 'NE'}
            };

            vm = instance.$mount();
            setTimeout(()=>{
                done();
            }, 100)
        });
        afterEach(() => {
            sandbox.restore()
        });

        it('shares your oldest NR', () => {
            expect(vm.$store.getters.nrNumber).toEqual('NR 1234');
        });

        it('lets you quick-approve your assigned NR', () => {
            expect(vm.$el.querySelector('#examine-quick-approve-button').textContent).toEqual('Quick Approve')
        });
        it('displays small decision text while in progress', () => {
              console.log(vm.$store.getters.compName1);
              expect(vm.$store.getters.compName1.name).toEqual("Bad Name");
              expect(vm.$el.querySelector('.completed-decision-text')).toBeNull()
        })
      });

      describe('Display full decision text after completion', ()=>{
        let sandbox;
        let vm;

        beforeEach((done) => {
            sandbox = sinon.createSandbox();
            instance.$store.state.currentState = 'APPROVED';
            instance.$store.state.compInfo.compNames = {
              compName1:
                {choice: 1,
                  name: "Bad Name",
                  state: 'REJECTED',
                  decision_text: "A Foreign Entity That Is Registering In British Columbia As An Extraprovincial Company And Adopting An Assumed Name Must Provide The Registrar With A Covering Letter Attaching An Undertaking To Carry On Business Under The Assumed Name.  Sample Working For The Undertaking Can Be Found On Page 34 Of The Information For Registration Of An "},
              compName2: {choice: 2, name: "Good Name", state: 'ACCEPTED'},
              compName3: {choice: 3, name: null, state: 'NE'}
            };
            vm = instance.$mount();
            setTimeout(()=>{
                done();
            }, 100)
        });

        afterEach(() => {
            sandbox.restore()
        });

        it('displays full decision text once completed', () => {
            expect(vm.$el.querySelectorAll('.completed-decision-text')).not.toBeNull();
            expect(vm.$el.querySelectorAll('.completed-decision-text').length).toBe(3);
        })
    })

});
