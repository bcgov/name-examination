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
            sessionStorage.setItem('USER_ROLES', ['names_approver']);
            sessionStorage.setItem('USERNAME', 'Joe');
            vm.$store.commit('setLoginValues');
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

  describe('Examiners cannot see Decision-related buttons for another examiners NR IN PROGRESS', ()=> {
      let sandbox;
      let vm;

      beforeEach((done) => {
        instance.$store.state.currentState = 'INPROGRESS';
        instance.$store.state.examiner = 'AdaLovelace';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'NE'
            },
          compName2: { choice: 2, name: "Good Name", state: 'NE' },
          compName3: { choice: 3, name: null, state: 'NE' }
        };
        vm = instance.$mount();
        sessionStorage.setItem('USER_ROLES', ['names_approver']);
        sessionStorage.setItem('USERNAME', 'GraceHopper');
        vm.$store.commit('setLoginValues');

        sandbox = sinon.createSandbox();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach(() => {
        sandbox.restore()
      });

      it('hides quick-approve, reject-distinctive and reject-descriptive for an IN PROGRESS NR of another examiner', () => {
         expect(vm.$el.querySelector('#examine-quick-approve-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reject-distinctive-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reject-descriptive-button')).toBeNull();
      });

      it('hides decision and hold buttons for IN PROGRESS NR of another examiner', () => {
         expect(vm.$el.querySelector('#examine-decide-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-hold-button')).toBeNull();
      })

      it('shows the cancel and get next buttons when viewing an IN PROGRESS NR of another examiner', () => {
         expect(vm.$el.querySelector('#examine-cancel-button').textContent.trim()).toEqual('Cancel Request');
         expect(vm.$el.querySelector('#examine-get-next-button').textContent).toEqual('Get Next');
      })


    })

   describe('Editors/Staff cannot see Decision-related buttons for APPROVED NRs ', ()=> {
      let sandbox;
      let vm;

      beforeEach((done) => {
        instance.$store.state.currentState = 'APPROVED';
        instance.$store.state.examiner = 'AdaLovelace';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'REJECTED'
            },
          compName2: { choice: 2, name: "Good Name", state: 'APPROVED' },
          compName3: { choice: 3, name: null, state: 'NE' }
        };
        vm = instance.$mount();
        sessionStorage.setItem('USER_ROLES', ['names_editor']);
        sessionStorage.setItem('USERNAME', 'GraceHopper');
        vm.$store.commit('setLoginValues');

        sandbox = sinon.createSandbox();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach(() => {
        sandbox.restore()
      });

      it('hides quick-approve, reject-distinctive and reject-descriptive buttons of an APPROVED NR from an editor user', () => {
         expect(vm.$el.querySelector('#examine-quick-approve-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reject-distinctive-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reject-descriptive-button')).toBeNull();
      });

      it('hides decision and hold buttons of an APPROVED NR from an editor user', () => {
         expect(vm.$el.querySelector('#examine-decide-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-hold-button')).toBeNull();
      });

      it('Hides the get next button from an editor user', () => {
         expect(vm.$el.querySelector('#examine-get-next-button')).toBeNull();
      });

      it('Hides the cancel button for an editor user when NR is not in DRAFT state', () => {
         expect(vm.$el.querySelector('#examine-cancel-button')).toBeNull();
      });

      it('hides the undo buttons for an editor user', () => {
         expect(vm.$el.querySelector('#name1 button')).toBeNull();
         expect(vm.$el.querySelector('#name2 button')).toBeNull();
      });

      //TODO : TEST FOR RESET BUTTON reopen button for completed NRs for examiners and editors
     // also for completed NRs for viewers.  SHouldn't see them

    });

   describe('Viewers cannot see any buttons', ()=> {
      let sandbox;
      let vm;

      beforeEach((done) => {
        instance.$store.state.currentState = 'HOLD';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'REJECTED'
            },
          compName2: { choice: 2, name: "They Named a Language after ME", state: 'NE' },
          compName3: { choice: 3, name: null, state: 'NE' }
        };
        vm = instance.$mount();
        sessionStorage.setItem('USER_ROLES', ['names_viewer']);
        sessionStorage.setItem('USERNAME', 'GraceHopper');
        vm.$store.commit('setLoginValues');

        sandbox = sinon.createSandbox();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach(() => {
        sandbox.restore()
      });

      it('hides all the buttons from a view-only user', () => {
         expect(vm.$el.querySelector('#examine-reject-distinctive-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-quick-approve-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reject-descriptive-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-decide-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-hold-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-get-next-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-cancel-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-button')).toBeNull();
         expect(vm.$el.querySelector('#examine-reset-button')).toBeNull();
      });

      it('hides the search field for a view-only user', () => {
         expect(vm.$el.querySelector('#manual-search')).toBeNull();
      });

     it('hides the undo buttons for a view-only user', () => {
         expect(vm.$el.querySelector('#name1 button')).toBeNull();
         expect(vm.$el.querySelector('#name2 button')).toBeNull();
      });

    })

   describe('Editors/Staff can see Cancel Buttons on DRAFT NRs', ()=> {
      let sandbox;
      let vm;

      beforeEach((done) => {
        instance.$store.state.currentState = 'DRAFT';
        instance.$store.state.compInfo.compNames = {
          compName1:
            {
              choice: 1,
              name: "Bad Name",
              state: 'DRAFT'
            },
          compName2: { choice: 2, name: "Good Name", state: 'DRAFT' },
          compName3: { choice: 3, name: null, state: 'NE' }
        };
        vm = instance.$mount();
        sessionStorage.setItem('USER_ROLES', ['names_editor']);
        sessionStorage.setItem('USERNAME', 'GraceHopper');
        vm.$store.commit('setLoginValues');

        sandbox = sinon.createSandbox();
        setTimeout(() => {
          done();
        }, 100)
      });

      afterEach(() => {
        sandbox.restore()
      });

      it('Shows the cancel button for an editor user on an DRAFT NR', () => {
         expect(vm.$el.querySelector('#examine-cancel-button').textContent.trim()).toEqual('Cancel Request');
      });

    });

});
