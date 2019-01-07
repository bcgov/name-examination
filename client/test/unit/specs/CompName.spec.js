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

            // set current name
            instance.$store.commit('currentNameObj', instance.$store.getters.compName2);

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

    describe('Display conflicts if there is no decision reason', ()=> {
      let sandbox;
      let vm;

      beforeEach((done) => {
        sandbox = sinon.createSandbox();
        instance.$store.state.currentState = 'APPROVED';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'REJECTED',
              decision_text: "",
              conflict1: "Bada Boom Bad Name",
              conflict2: "Bad Dudes Name",
            },
          compName2: { choice: 2, name: "Good Name", state: 'ACCEPTED' },
          compName3: { choice: 3, name: null, state: 'NE' }
        };
        vm = instance.$mount();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach(() => {
        sandbox.restore()
      });

      it('displays conflicts when there are no deision reasons', () => {
        expect(vm.$el.querySelectorAll('.completed-decision-text')).not.toBeNull();
        expect(vm.$el.querySelectorAll('.completed-decision-text')[0].innerHTML).toContain('Bada Boom Bad Name');
        expect(vm.$el.querySelectorAll('.completed-decision-text')[0].innerHTML).toContain('Bad Dudes Name');
      })
    })

    describe('Reset & Re-Open', ()=> {
      let vm;

      let click = function(id) {
        let button = vm.$el.querySelector(id);
        let window = button.ownerDocument.defaultView;
        var click = new window.Event('click');
        button.dispatchEvent(click);
      };

      beforeEach((done) => {

        // stub out updateRequest action from index - we don't care what it does and it errors during testing
        instance.$store._actions.updateRequest[0] = sinon.stub();

        instance.$store.state.currentState = 'APPROVED';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'REJECTED',
              decision_text: "Nope.",
              conflict1: "Bada Boom Bad Name",
              conflict1_num: 123,
              conflict2: "Bad Dudes Name",
              conflict2_num: 456,
              conflict3: null,
              conflict3_num: null,
            },
          compName2:
            {
              choice: 2,
              name: "Good Name",
              state: 'APPROVED',
              comment: {
                comment: 'My internal decision comment.',
              },
              decision_text: "Good work.",
              conflict1: null,
              conflict2: null,
              conflict3: null,
            },
          compName3:
            {
              choice: 3,
              name: "Whatever",
              state: 'NE',
              decision_text: null,
              conflict1: null,
              conflict2: null,
              conflict3: null,
            },
        };
        vm = instance.$mount();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach((done) => {
        setTimeout(()=> {
          done();
        }, 100)
      });

      describe('Reset', ()=> {

        beforeEach(() => {
          instance.$store.state.furnished = "Y";
        });

        it('displays RESET button and not RE-OPEN button', () => {
          expect(vm.$el.querySelector('#examine-reset-button')).not.toBeNull();
          expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull();
        });


        it('Resets NR status upon reset', () => {
          click('#examine-reset-button');

          setTimeout(() => {
            expect(instance.$store.state.currentState).toEqual("INPROGRESS");
          }, 10)
        });

        it('keeps decision data upon reset', () => {
          click('#examine-reset-button');

          setTimeout(() => {
            expect(instance.$store.state.compInfo.compNames.compName1.state).toEqual("REJECTED");
            expect(instance.$store.state.compInfo.compNames.compName1.decision_text).toEqual("Nope.");
            expect(instance.$store.state.compInfo.compNames.compName1.conflict1).toEqual("Bada Boom Bad Name");
            expect(instance.$store.state.compInfo.compNames.compName1.conflict1_num).toEqual(123);
            expect(instance.$store.state.compInfo.compNames.compName2.comment.comment).toEqual("My internal decision comment.");
          }, 10);
        });

      }); // end RESET

      describe('Re-Open', ()=> {
        beforeEach(() => {
          instance.$store.state.furnished = "N";
        });

        it('displays RE-OPEN button and not RESET button', () => {
          expect(vm.$el.querySelector('#examine-reset-button')).toBeNull();
          expect(vm.$el.querySelector('#examine-re-open-button')).not.toBeNull();
        });


        it('Re-opens NR status upon button click', () => {
          click('#examine-re-open-button');

          setTimeout(() => {
            expect(instance.$store.state.currentState).toEqual("INPROGRESS");
          }, 10)
        });

        it('keeps decision data upon re-open', () => {
          click('#examine-re-open-button');

          setTimeout(() => {
            expect(instance.$store.state.compInfo.compNames.compName1.state).toEqual("REJECTED");
            expect(instance.$store.state.compInfo.compNames.compName1.decision_text).toEqual("Nope.");
            expect(instance.$store.state.compInfo.compNames.compName1.conflict1).toEqual("Bada Boom Bad Name");
            expect(instance.$store.state.compInfo.compNames.compName1.conflict1_num).toEqual(123);
            expect(instance.$store.state.compInfo.compNames.compName2.comment.comment).toEqual("My internal decision comment.");
          }, 10);
        });

      }); // end RE-OPEN
    });

});
