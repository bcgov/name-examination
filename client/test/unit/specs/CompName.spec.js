/* eslint-disable */
import Vue from 'vue';
import { Plugin } from 'vue-fragment'
import Vuetify from 'vuetify'
import CompName from '@/components/application/Examine/CompName';
import store from '@/store'
import axios from '@/axios-auth.js';
import sinon from 'sinon';

Vue.use(Vuetify)
Vue.use(Plugin)
Vue.use(require('vue-shortkey'))

describe('CompName.vue', () => {
  let instance;
  
  beforeEach(() => {
    const Constructor = Vue.extend(CompName);
    instance = new Constructor({store: store});
    instance.$store.state.myKeycloak = {};
    instance.setFocus = () => {
    }
  })
  
  describe('Initialization', () => {
    let sandbox;
    let vm;
    
    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      sandbox.stub(axios, 'get').withArgs('/api/v1/requests/queues/@me/oldest', sinon.match.any).returns(
        new Promise((resolve) => resolve({data: {nameRequest: 'NR 1234'}}))
      );
      instance.$store.state.currentState = 'INPROGRESS';
      instance.$store.state.examiner = 'Joe';
      instance.$store.state.userId = instance.$store.state.examiner;
      
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: "Bad Name",
            state: 'REJECTED',
            decision_text: "A Foreign Entity That Is Registering In British Columbia As An Extraprovincial Company And Adopting An Assumed Name Must Provide The Registrar With A Covering Letter Attaching An Undertaking To Carry On Business Under The Assumed Name.  Sample Working For The Undertaking Can Be Found On Page 34 Of The Information For Registration Of An "
          },
        compName2: {choice: 2, name: "Good Name", state: 'NE'},
        compName3: {choice: 3, name: null, state: 'NE'}
      };
      
      // set current name
      instance.$store.commit('currentNameObj', instance.$store.getters.compName2);
      
      vm = instance.$mount();
      sessionStorage.setItem('USER_ROLES', ['names_approver']);
      sessionStorage.setItem('USERNAME', 'Joe');
      vm.$store.commit('setLoginValues');
      setTimeout(() => {
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
      expect(vm.$el.querySelector('#examine-quick-approve-button')).not.toEqual(null);
    });
    it('displays small decision text while in progress', () => {
      expect(vm.$store.getters.compName1.name).toEqual("Bad Name");
      expect(vm.$el.querySelector('.completed-decision-text')).toBeNull()
    })
  });
  
  describe('Display full decision text after completion', () => {
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
            decision_text: "A Foreign Entity That Is Registering In British Columbia As An Extraprovincial Company And Adopting An Assumed Name Must Provide The Registrar With A Covering Letter Attaching An Undertaking To Carry On Business Under The Assumed Name.  Sample Working For The Undertaking Can Be Found On Page 34 Of The Information For Registration Of An "
          },
        compName2: {choice: 2, name: "Good Name", state: 'ACCEPTED'},
        compName3: {choice: 3, name: null, state: 'NE'}
      };
      vm = instance.$mount();
      setTimeout(() => {
        done();
      }, 100);
    })
    
    afterEach(() => {
      sandbox.restore()
    });
    
    it('displays full decision text once completed', () => {
      expect(vm.$el.querySelectorAll('.decision-text')).not.toBeNull();
      expect(vm.$el.querySelectorAll('.decision-text').length).toBe(3);
    })
  })
  
  describe('Display conflicts if there is no decision reason', () => {
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
        compName2: {choice: 2, name: "Good Name", state: 'ACCEPTED'},
        compName3: {choice: 3, name: null, state: 'NE'}
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
      expect(vm.$el.querySelectorAll('.decision-text')).not.toBeNull();
      expect(vm.$el.querySelectorAll('.decision-text')[0].innerHTML).toContain('Bada Boom Bad Name');
      expect(vm.$el.querySelectorAll('.decision-text')[0].innerHTML).toContain('Bad Dudes Name');
    })
  })
  
  describe('Examiners cannot see Decision-related buttons for another examiners NR IN PROGRESS', () => {
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
        compName2: {choice: 2, name: "Good Name", state: 'NE'},
        compName3: {choice: 3, name: null, state: 'NE'}
      };
      vm = instance.$mount();
      sessionStorage.setItem('USER_ROLES', ['names_approver']);
      sessionStorage.setItem('USERNAME', 'GraceHopper');
      vm.$store.commit('setLoginValues');
      
      sandbox = sinon.createSandbox();
      setTimeout(() => {
        done();
      }, 300)
    });
    
    afterEach(() => {
      sandbox.restore()
    });
    
    it('hides quick-approve, and reject buttons for an IN PROGRESS NR of another examiner', () => {
      expect(vm.$el.querySelector('#examine-quick-approve-button')).toBeNull();
      expect(vm.$el.querySelector('#examine-reject-distinctive-button')).toBeNull();
      expect(vm.$el.querySelector('#examine-reject-descriptive-button')).toBeNull();
    });
  })
  
  describe('Editors/Staff cannot see Decision-related buttons for APPROVED NRs ', () => {
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
        compName2: {choice: 2, name: "Good Name", state: 'APPROVED'},
        compName3: {choice: 3, name: null, state: 'NE'}
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
    
    it('hides the undo buttons for an editor user', () => {
      expect(vm.$el.querySelector('#name1 button')).toBeNull();
      expect(vm.$el.querySelector('#name2 button')).toBeNull();
    });
    
    //TODO : TEST FOR RESET BUTTON reopen button for completed NRs for examiners and editors
    // also for completed NRs for viewers.  SHouldn't see them
    
  });
  
  describe('Viewers cannot see any buttons', () => {
    let sandbox;
    let vm;
    
    beforeEach((done) => {
      instance.$store.state.currentState = 'HOLD';
      instance.$store.state.furnished = 'N';
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: "Bad Name",
            state: 'REJECTED'
          },
        compName2: {choice: 2, name: "They Named a Language after ME", state: 'NE'},
        compName3: {choice: 3, name: null, state: 'NE'}
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
    });
    
    it('hides the search field for a view-only user', () => {
      expect(vm.$el.querySelector('#manual-search')).toBeNull();
    });
    
    it('hides the undo buttons for a view-only user', () => {
      expect(vm.$el.querySelector('#name1 button')).toBeNull();
      expect(vm.$el.querySelector('#name2 button')).toBeNull();
    });
    
  })
  
  describe('Transitions Between NRs', () => {
    let vm;
    let sandbox;
    
    
    let click = function (id) {
      let button = vm.$el.querySelector(id);
      let window = button.ownerDocument.defaultView;
      var click = new window.Event('click');
      button.dispatchEvent(click);
    };
    
    beforeEach((done) => {
      sandbox = sinon.createSandbox();
      sandbox.getStub = sandbox.stub(axios, 'get');
      
      
      // stub out updateRequest action from index - we don't care what it does and it errors during testing
      //instance.$store._actions.updateRequest[0] = sinon.stub();
      
      // NR that is completed with one rejected name (conflict) and one approved name
      sandbox.getStub.withArgs('/api/v1/requests/NR 2000951', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: "More info",
              applicants:
                {
                  addrLine1: "940 Blanshard Street",
                  addrLine2: null,
                  addrLine3: null,
                  city: "Victoria",
                  clientFirstName: null,
                  clientLastName: null,
                  contact: "John Test",
                  countryTypeCd: "CA",
                  declineNotificationInd: null,
                  emailAddress: "testoutputs@gov.bc.ca",
                  faxNumber: null,
                  firstName: "John",
                  lastName: "Test",
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: "2505555555",
                  postalCd: "V8V4K8",
                  stateProvinceCd: "BC"
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: "N",
              id: 1822,
              lastUpdate: "Thu, 18 Oct 2018 22:46:54 GMT",
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: "MY FIRST CONFLICT",
                  conflict1_num: "A1010101",
                  conflict2: null,
                  conflict2_num: null,
                  conflict3: null,
                  conflict3_num: null,
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "REJECTED"
                },
                {
                  choice: 2,
                  comment: null,
                  conflict1: null,
                  conflict1_num: null,
                  conflict2: null,
                  conflict2_num: null,
                  conflict3: null,
                  conflict3_num: null,
                  consumptionDate: null,
                  decision_text: "",
                  name: "NAME TWO",
                  state: "APPROVED"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
                "spaces and punctuation.",
              nrNum: "NR 2000951",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: "DRAFT",
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "APPROVED",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      
      // Un-examined NR #1
      sandbox.getStub.withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: "More info",
              applicants:
                {
                  addrLine1: "940 Blanshard Street",
                  addrLine2: null,
                  addrLine3: null,
                  city: "Victoria",
                  clientFirstName: null,
                  clientLastName: null,
                  contact: "John Test",
                  countryTypeCd: "CA",
                  declineNotificationInd: null,
                  emailAddress: "testoutputs@gov.bc.ca",
                  faxNumber: null,
                  firstName: "John",
                  lastName: "Test",
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: "2505555555",
                  postalCd: "V8V4K8",
                  stateProvinceCd: "BC"
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: "N",
              id: 1822,
              lastUpdate: "Thu, 18 Oct 2018 22:46:54 GMT",
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: null,
                  conflict1_num: null,
                  conflict2: null,
                  conflict2_num: null,
                  conflict3: null,
                  conflict3_num: null,
                  consumptionDate: null,
                  decision_text: "",
                  name: "NAME ONE",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
                "spaces and punctuation.",
              nrNum: "NR 2000952",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: "DRAFT",
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "HOLD",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      
      // Un-examined NR #2
      sandbox.getStub.withArgs('/api/v1/requests/NR 2000953', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: "More info",
              applicants:
                {
                  addrLine1: "940 Blanshard Street",
                  addrLine2: null,
                  addrLine3: null,
                  city: "Victoria",
                  clientFirstName: null,
                  clientLastName: null,
                  contact: "John Test",
                  countryTypeCd: "CA",
                  declineNotificationInd: null,
                  emailAddress: "testoutputs@gov.bc.ca",
                  faxNumber: null,
                  firstName: "John",
                  lastName: "Test",
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: "2505555555",
                  postalCd: "V8V4K8",
                  stateProvinceCd: "BC"
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: "N",
              id: 1822,
              lastUpdate: "Thu, 18 Oct 2018 22:46:54 GMT",
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: null,
                  conflict1_num: null,
                  conflict2: null,
                  conflict2_num: null,
                  conflict3: null,
                  conflict3_num: null,
                  consumptionDate: null,
                  decision_text: "",
                  name: "NAME ONE ALPHA",
                  state: "NE"
                },
                {
                  choice: 2,
                  comment: null,
                  conflict1: null,
                  conflict1_num: null,
                  conflict2: null,
                  conflict2_num: null,
                  conflict3: null,
                  conflict3_num: null,
                  consumptionDate: null,
                  decision_text: "",
                  name: "NAME TWO ALPHA",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
                "spaces and punctuation.",
              nrNum: "NR 2000953",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: "DRAFT",
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "HOLD",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      
      
      vm = instance.$mount();
      setTimeout(() => {
        done();
      }, 100)
    });
    
    afterEach(() => {
      sandbox.restore();
    });
    
    it('can load an NR (unexamined) with a clean slate after another (unexamined)', () => {
      
      // load first NR
      vm.$store.dispatch('getpostgrescompInfo', 'NR 2000952');
      setTimeout(() => {
        
        // expect name 1 to be from first NR
        expect(vm.compName1.name).toEqual('NAME ONE');
        
        // expect name 1 conflict 1 name and number to be null
        expect(vm.compName1.conflict1).toEqual(null);
        expect(vm.compName1.conflict1_num).toEqual(null);
        
        // load second NR
        vm.$store.dispatch('getpostgrescompInfo', 'NR 2000953');
        setTimeout(() => {
          
          // expect name 1 to be from second NR
          expect(vm.compName1.name).toEqual('NAME ONE ALPHA');
          
          // expect name 2 to be from first NR
          expect(vm.compName2.name).toEqual('NAME TWO ALPHA');
          
          // expect name 1 conflict 1 name and number to be null
          expect(vm.compName1.conflict1).toEqual(null);
          expect(vm.compName1.conflict1_num).toEqual(null);
          
          // expect name 1 conflict 1 name and number to be null
          expect(vm.compName2.conflict1).toEqual(null);
          expect(vm.compName2.conflict1_num).toEqual(null);
          
        }, 100)
      }, 100)
      
    });
    
    it('can load an NR (unexamined) with a clean slate after another (examined)', () => {
      
      // load first NR
      vm.$store.dispatch('getpostgrescompInfo', 'NR 2000951');
      setTimeout(() => {
        
        // expect name 1 to be from first NR
        expect(vm.compName1.name).toEqual('COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED');
        
        // expect name 2 to be from first NR
        expect(vm.compName2.name).toEqual('NAME TWO');
        
        // expect name 1 conflict 1 name and number from first NR
        expect(vm.compName1.conflict1).toEqual('MY FIRST CONFLICT');
        expect(vm.compName1.conflict1_num).toEqual('A1010101');
        
        // load second (unexamined) NR
        vm.$store.dispatch('getpostgrescompInfo', 'NR 2000952');
        setTimeout(() => {
          
          // expect name 1 to be from second NR
          expect(vm.compName1.name).toEqual('NAME ONE');
          
          // expect name 2 to be null, ie: not left over from first NR
          expect(vm.compName2.name).toEqual(null);
          
          // expect name 1 conflict 1 name and number to be null
          expect(vm.compName1.conflict1).toEqual(null);
          expect(vm.compName1.conflict1_num).toEqual(null);
          
        }, 100)
      }, 100)
    });
  });
  
});
