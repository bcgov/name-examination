/* eslint-disable */
import Vue from 'vue';
import Vuelidate from 'vuelidate';

Vue.use(require('vue-shortkey'));
Vue.use(Vuelidate);

import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader';
import store from '@/store';
import axios from '@/axios-auth.js';
import sinon from 'sinon';

describe('RequestInfoHeader.vue', () => {
  let instance;

  beforeEach(() => {
    sessionStorage.setItem('USERNAME', 'tester');
    sessionStorage.setItem('USER_ROLES', ['names_approver']);
    sessionStorage.setItem('AUTHORIZED', 'true');

    const Constructor = Vue.extend(RequestInfoHeader);
    instance = new Constructor({store: store});
    instance.$store.state.myKeycloak = {}
  });

  describe('Initialization', () => {
    let vm;
    let sandbox;

    let click = function (id) {
      console.log('ID: ', id)
      let button = vm.$el.querySelector(id);
      let window = button.ownerDocument.defaultView;
      var click = new window.Event('click');
      button.dispatchEvent(click);
    };
    beforeEach((done) => {

      sandbox = sinon.createSandbox();
      sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000948",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "INPROGRESS",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000948",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "INPROGRESS",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      vm.$store.commit('nrNumber', 'NR 2000948');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('displays the NR loaded in the store', () => {
      expect(vm.nrNumber).toEqual('NR 2000948');
      expect(vm.$el.querySelector('div.nrNum').textContent).toEqual('NR 2000948');
    });

    it('displays the priority div when priority is set in store', () => {
      expect(vm.priority).toBeTruthy();
      expect(vm.$el.querySelector('div.priority')).toBeDefined();
    });

    it('displays the correct state of the NR', () => {
      expect(vm.nr_status).toEqual('INPROGRESS');
      expect(vm.$el.querySelector('div.status').textContent.trim()).toEqual('Status: INPROGRESS');
    });

    it('has the show/hide details button working properly', () => {
      //TODO: tests for all fields that are hidden/shown in header
      console.log('START details')
      expect(vm.$el.querySelector('#comments-div')).toBeNull();
      expect(vm.$el.querySelector('newpta')).toBeNull();
      expect(vm.$el.querySelector('#nr-details-show-hide-details-button').textContent.trim()).toEqual('Show Details  (b)');
      click('#nr-details-show-hide-details-button');

      setTimeout(() => {
        expect(vm.$el.querySelector('#nr-details-show-hide-details-button').textContent.trim()).toEqual('Hide Details (b)');
        expect(vm.$el.querySelector('newpta')).toBeDefined();
        expect(vm.$el.querySelector('#comments-div')).toBeDefined();
        expect(vm.$el.querySelector('#comments-div h3').textContent).toEqual('INTERNAL COMMENTS');
        console.log('END details')
      }, 10)
    });
  });

  describe('Testing Editing the NR in DRAFT (unexamined)', () => {
    let vm;
    let sandbox;

    let putCall, getCall, patchCall;

    let click = function (id) {
      console.log('ID: ', id)
      let button = vm.$el.querySelector(id);
      let window = button.ownerDocument.defaultView;
      var click = new window.Event('click');
      button.dispatchEvent(click);
    };
    beforeEach((done) => {

      sandbox = sinon.createSandbox();
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000950",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "DRAFT",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000948",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: "DRAFT",
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "INPROGRESS",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: "Request:NR 2000950 - patched"
            }
        }))
      );
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      vm.$store.commit('nrNumber', 'NR 2000950');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('cancel/save testing', () => {

      beforeEach((done) => {
        click('#nr-details-edit-button');
        setTimeout(() => {
          done();
        }, 100)
      });
      afterEach((done) => {
        setTimeout(() => {
          done();
        }, 100)
      });

      it('has the cancel button working properly', () => {
        console.log('CANCEL')
        click('#nr-details-cancel-button');
        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PATCH should have been called to revert state to DRAFT
          expect(patchCall.lastCall).not.toBeNull();
          expect(patchCall.lastCall.args[1].state).toEqual('DRAFT');
          expect(patchCall.lastCall.args[1].previousStateCd).toEqual(null);

          console.log('END cancel')
        }, 10);
      });

      it('has the save button working properly', () => {
        console.log('START save')

        expect(vm.validate()).toBeTruthy();
        expect(vm.$el.querySelector('#nr-details-save-button').textContent).toEqual('Save');
        click('#nr-details-save-button');

        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PUT is called, saving state back to DRAFT
          expect(putCall.lastCall).not.toBeNull();
          expect(putCall.lastCall.args[1].state).toEqual('DRAFT');
          expect(putCall.lastCall.args[1].previousStateCd).toEqual(null);

          console.log('finished');
        });
      });

    });
  });
  describe('Testing Editing the NR in INPROGRESS (my current NR)', () => {
    let vm;
    let sandbox;

    let putCall, getCall, patchCall;

    let click = function (id) {
      console.log('ID: ', id)
      let button = vm.$el.querySelector(id);
      let window = button.ownerDocument.defaultView;
      var click = new window.Event('click');
      button.dispatchEvent(click);
    };
    beforeEach((done) => {

      sandbox = sinon.createSandbox();
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
                "spaces and punctuation.",
              nrNum: "NR 2000948",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "INPROGRESS",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "NE"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
                "spaces and punctuation.",
              nrNum: "NR 2000948",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "INPROGRESS",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: "Request:NR 2000948 - patched"
            }
        }))
      );
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      vm.$store.commit('nrNumber', 'NR 2000948');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('cancel/save testing', () => {
      beforeEach((done) => {
        click('#nr-details-edit-button');
        setTimeout(() => {
          done();
        }, 100)
      });
      afterEach((done) => {
        setTimeout(() => {
          done();
        }, 100)
      });

      it('has the cancel button working properly', () => {
        console.log('CANCEL')
        click('#nr-details-cancel-button');
        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PATCH should not have been called (ie: no change in state), just a GET
          expect(patchCall.lastCall).toBeNull();
          expect(getCall.lastCall).not.toBeNull();

          console.log('END cancel')
        }, 10);
      });

      it('has the save button working properly', () => {
        console.log('START save')

        expect(vm.validate()).toBeTruthy();
        expect(vm.$el.querySelector('#nr-details-save-button').textContent).toEqual('Save');
        click('#nr-details-save-button');

        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PUT is called without changing the state, ie: it's still INPROGRESS
          expect(putCall.lastCall).not.toBeNull();
          expect(putCall.lastCall.args[1].state).toEqual('INPROGRESS');
          expect(putCall.lastCall.args[1].previousStateCd).toEqual(null);

          console.log('finished');
        });
      });

      it('Validates the name choices properly', () => {
        vm.compName2.name = '';
        vm.compName3.name = '';
        expect(vm.validate()).toBeTruthy();
        vm.compName3.name = 'Test add name choice 3';
        expect(vm.validate()).toBeFalsy();
        vm.compName2.name = 'Test add name choice 2';
        expect(vm.validate()).toBeTruthy();
        vm.compName2.name = '';
        expect(vm.validate()).toBeFalsy();

        // this should do nothing
        click('#nr-details-save-button');

        // reset names and cancel edit - if above 'saved' this will error
        vm.compName2.name = '';
        vm.compName3.name = '';
        expect(vm.validate()).toBeTruthy();
        click('#nr-details-cancel-button');
      });
    });

    describe('Edit button hiding testing', () => {

      beforeEach((done) => {
        sessionStorage.setItem('USER_ROLES', ['names_approver']);
        sessionStorage.setItem('USERNAME', 'max')
        vm = instance.$mount();
        vm.$store.commit('setLoginValues');
        vm.$store.commit('nrNumber', 'NR 2000948');
        setTimeout(() => {
          done();
        }, 100)
      });

      describe('I cannot edit when it is not my NR in progress', () => {

        it('hides the edit button', () => {
          console.log('START check edit for not my NR in progress');
          expect(vm.$el.querySelector('#nr-details-edit-button')).toBeNull();
          console.log('finished');

        });
      });
    });

    describe('Edit button visible testing', () => {

      beforeEach((done) => {
        sessionStorage.setItem('USER_ROLES', ['names_approver']);
        sessionStorage.setItem('USERNAME', 'tester')
        vm = instance.$mount();
        vm.$store.commit('setLoginValues');
        vm.$store.commit('nrNumber', 'NR 2000948');
        setTimeout(() => {
          done();
        }, 100)
      });

      describe('editability testing', () => {

        it('shows the edit button', () => {
          console.log('START check edit for not my NR in progress');
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          console.log('finished');

        });
      });
    });

    describe('Edit button visible for staff testing', () => {

      beforeEach((done) => {
        sessionStorage.setItem('USER_ROLES', ['names_editor']);
        sessionStorage.setItem('USERNAME', 'tester')
        vm = instance.$mount();
        vm.$store.commit('setLoginValues');
        vm.$store.commit('nrNumber', 'NR 2000948');
        setTimeout(() => {
          done();
        }, 100)
      });

      describe('editability testing', () => {

        it('shows the edit button for a staff member who is currently editing', () => {
          console.log('START check edit for not my NR in progress');
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          console.log('finished');

        });
      });
    });
  });

  describe('Testing Editing the NR after complete', () => {
    let vm;
    let sandbox;

    let putCall, getCall, patchCall;

    let click = function (id) {
      console.log('ID: ', id)
      let button = vm.$el.querySelector(id);
      let window = button.ownerDocument.defaultView;
      var click = new window.Event('click');
      button.dispatchEvent(click);
    };
    beforeEach((done) => {

      sandbox = sinon.createSandbox();
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "REJECTED"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000952",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "REJECTED",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
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
                  conflict1: "",
                  conflict1_num: "",
                  conflict2: "",
                  conflict2_num: "",
                  conflict3: "",
                  conflict3_num: "",
                  consumptionDate: null,
                  decision_text: "",
                  name: "COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED",
                  state: "REJECTED"
                }],
              natureBusinessInfo: "Nature of business can be pretty long so this one is more realistic. It even contains " +
              "spaces and punctuation.",
              nrNum: "NR 2000952",
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: "Y",
              requestTypeCd: "CR",
              state: "REJECTED",
              submitCount: 1,
              submittedDate: "Wed, 17 Oct 2018 11:37:20 GMT",
              submitter_userid: "",
              userId: "tester",
              xproJurisdiction: null
            }
        }))
      );
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: "Request:NR 2000952 - patched"
            }
        }))
      );
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      vm.$store.commit('nrNumber', 'NR 2000952');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('cancel/save testing', () => {
      beforeEach((done) => {
        click('#nr-details-edit-button');
        setTimeout(() => {
          done();
        }, 100)
      });
      afterEach((done) => {
        setTimeout(() => {
          done();
        }, 100)
      });

      it('has the cancel button working properly', () => {
        console.log('CANCEL')
        click('#nr-details-cancel-button');
        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PATCH should not have been called (ie: no change in state), just a GET
          expect(patchCall.lastCall).toBeNull();
          expect(getCall.lastCall).not.toBeNull();

          console.log('END cancel')
        }, 10);
      });

      it('has the save button working properly', () => {
        console.log('START save')

        expect(vm.validate()).toBeTruthy();
        expect(vm.$el.querySelector('#nr-details-save-button').textContent).toEqual('Save');
        click('#nr-details-save-button');

        setTimeout(() => {
          expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
          expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull();
          expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull();

          // the PUT is called without changing the state, ie: it's still REJECTED
          expect(putCall.lastCall).not.toBeNull();
          expect(putCall.lastCall.args[1].state).toEqual('REJECTED');
          expect(putCall.lastCall.args[1].previousStateCd).toEqual(null);

          console.log('finished');
        });
      });
    });

  });

  describe('Testing View-only users cannot see the Edit button even when the NR is in DRAFT', () => {
    let vm;
    let sandbox;

    beforeEach((done) => {
      sessionStorage.setItem('USER_ROLES', ['names_viewer']);
      sandbox = sinon.createSandbox();
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('Does not has the edit button for a viewer', () => {
      expect(vm.$el.querySelector('#nr-details-edit-button')).toBeNull();
    });
  });

  describe('Testing Staff (edit but not examine) users can see the Edit button when the NR is in DRAFT', () => {
    let vm;
    let sandbox;

    beforeEach((done) => {
      sessionStorage.setItem('USER_ROLES', ['names_editor']);
      sandbox = sinon.createSandbox();
      vm = instance.$mount();
      vm.$store.commit('setLoginValues');
      setTimeout(() => {
        done();
      }, 100)
    });
    afterEach(() => {
      sandbox.restore();
    });

    it('has the edit button for a staff member', () => {
      expect(vm.$el.querySelector('#nr-details-edit-button').textContent).toEqual('Edit');
    });
  });

});
