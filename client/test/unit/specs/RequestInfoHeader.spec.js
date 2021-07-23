/* eslint-disable */
import Vue from 'vue'
import sinon from 'sinon'
import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader'
import store from '@/store'
import axios from '@/axios-auth.js'
import { sleep } from '@/utils/sleep'

window.HTMLElement.prototype.scrollTo = function () { return null }

describe('RequestInfoHeader', () => {
  let instance

  beforeEach(() => {
    sessionStorage.setItem('USERNAME', 'tester')
    sessionStorage.setItem('USER_ROLES', ['names_approver'])
    sessionStorage.setItem('AUTHORIZED', 'true')

    const Constructor = Vue.extend(RequestInfoHeader)
    instance = new Constructor({ store })
    instance.$store.state.myKeycloak = {}
  })

  describe('When an NR is loaded, the RequestInfoHeader Component...', () => {
    let vm
    let sandbox

    let click = function (id) {
      let button = vm.$el.querySelector(id)
      let window = button.ownerDocument.defaultView
      var click = new window.Event('click')
      button.dispatchEvent(click)
    }

    beforeEach(async () => {
      sandbox = sinon.createSandbox()
      sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000948',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'INPROGRESS',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000948',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'INPROGRESS',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      vm.$store.commit('nrNumber', 'NR 2000948')
      await sleep(1000)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('Gets the NR # from the store and displays it', () => {
      expect(vm.nrNumber).toEqual('NR 2000948')
      expect(vm.$el.querySelector('#nrNumberDisplay').textContent).toEqual('NR 2000948')
    })

    it('Displays the Priority Indicator when the Priority Flag is set', () => {
      expect(vm.priority).toBeTruthy()
      expect(vm.$el.querySelector('#priorityStarIcon')).not.toEqual(null)
    })

    it('Displays the Proper NR Status Text', () => {
      expect(vm.nr_status).toEqual('INPROGRESS')
      expect(vm.$el.querySelector('#nrStatusText').textContent.trim()).toEqual('INPROGRESS')
    })

    it('Has a Show/Hide Button that toggles properly', async () => {
      //TODO: tests for all fields that are hidden/shown in header
      expect(vm.$el.querySelector('#show-details-graphic')).not.toBeNull()
      expect(vm.$el.querySelector('#hide-details-graphic')).toBeNull()

      click('#nr-details-show-hide-details-button')
      await vm.$nextTick()

      expect(vm.$el.querySelector('#show-details-graphic')).toBeNull()
      expect(vm.$el.querySelector('#hide-details-graphic')).not.toBeNull()
    })
  })

  describe('When an unexamined draft NR is loaded', () => {
    let vm
    let sandbox

    let putCall, getCall, patchCall

    let click = function (id) {
      let button = vm.$el.querySelector(id)
      let window = button.ownerDocument.defaultView
      var click = new window.Event('click')
      button.dispatchEvent(click)
    }

    beforeEach(async () => {
      sandbox = sinon.createSandbox()
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000950',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'DRAFT',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000948',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: 'DRAFT',
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'INPROGRESS',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000950', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: 'Request:NR 2000950 - patched',
            },
        })),
      )
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      vm.$store.commit('nrNumber', 'NR 2000950')
      await sleep(1000)
    })

    afterEach(() => {
      sandbox.restore()
    })

    describe('And in Edit Mode', () => {
      beforeEach(async () => {
        click('#nr-details-edit-button')
        await sleep(1000)
      })

      afterEach(async () => {
        await sleep(100)
      })

      it('RequestInfo Header has show/cancel buttons that toggle properly', async () => {
        click('#nr-details-cancel-button')
        await sleep(100)

        expect(vm.$el.querySelector('#nr-details-save-button')).toEqual(null)
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toEqual(null)
        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toEqual(null)

        // the PATCH should have been called to revert state to DRAFT
        expect(patchCall.lastCall).not.toBeNull()
        expect(patchCall.lastCall.args[1].state).toEqual('DRAFT')
        expect(patchCall.lastCall.args[1].previousStateCd).toEqual(null)
      })

      it('Has a Save Edits button that works when clicked', async () => {
        expect(vm.validate()).toBeTruthy()
        expect(vm.$el.querySelector('#nr-details-save-button')).not.toBeNull()

        click('#nr-details-save-button')
        await sleep(100)

        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull()
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull()

        // the PUT is called, saving state back to DRAFT
        expect(putCall.lastCall).not.toBeNull()
        expect(putCall.lastCall.args[1].state).toEqual('DRAFT')
        expect(putCall.lastCall.args[1].previousStateCd).toEqual(null)
      })
    })
  })

  describe('When an examiner loads an INPROGRESS NR that is their current NR', () => {
    let vm
    let sandbox

    let putCall, getCall, patchCall

    let click = function (id) {
      let button = vm.$el.querySelector(id)
      let window = button.ownerDocument.defaultView
      var click = new window.Event('click')
      button.dispatchEvent(click)
    }

    beforeEach(async () => {
      sandbox = sinon.createSandbox()
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000948',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'INPROGRESS',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'NE',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000948',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'INPROGRESS',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000948', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: 'Request:NR 2000948 - patched',
            },
        })),
      )
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      vm.$store.commit('nrNumber', 'NR 2000948')
      await sleep(2000)
    })

    afterEach(() => {
      sandbox.restore()
    })

    describe('And they are in Edit Mode', () => {
      beforeEach(async () => {
        click('#nr-details-edit-button')
        await sleep(1000)
      })

      afterEach(async () => {
        await sleep(100)
      })

      it('And they click Cancel, the Edit Details button is visible and the Save/Cancel are not', async () => {
        click('#nr-details-cancel-button')
        await sleep(10)

        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull()
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull()

        // the PATCH should not have been called (ie: no change in state), just a GET
        expect(patchCall.lastCall).toBeNull()
        expect(getCall.lastCall).not.toBeNull()
      })

      it('And they click Edit Request, and the Save Button is visible, and it works', async () => {
        expect(vm.validate()).toBeTruthy()
        expect(vm.$el.querySelector('#nr-details-save-button')).not.toBeNull()

        click('#nr-details-save-button')
        await sleep(10)

        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull()
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull()

        // the PUT is called without changing the state, ie: it's still INPROGRESS
        expect(putCall.lastCall).not.toBeNull()
        expect(putCall.lastCall.args[1].state).toEqual('INPROGRESS')
        expect(putCall.lastCall.args[1].previousStateCd).toEqual(null)
      })

      it('And Validates the name choices properly', () => {
        vm.compName1.name = ''
        expect(vm.validate()).toBeFalsy()
        vm.compName1.name = 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED'
        vm.compName2.name = ''
        vm.compName3.name = ''
        expect(vm.validate()).toBeTruthy()
        vm.compName3.name = 'Test add name choice 3'
        expect(vm.validate()).toBeFalsy()
        vm.compName2.name = 'Test add name choice 2'
        expect(vm.validate()).toBeTruthy()
        vm.compName2.name = ' '
        expect(vm.validate()).toBeFalsy()
        vm.compName2.name = ''
        vm.compName3.name = ' '
        expect(vm.validate()).toBeTruthy()
        vm.compName3.name = 'Test add name choice 3'
        expect(vm.validate()).toBeFalsy()

        // this should do nothing
        click('#nr-details-save-button')

        // reset names and cancel edit - if above 'saved' this will error
        vm.compName2.name = ''
        vm.compName3.name = ''
        expect(vm.validate()).toBeTruthy()
        click('#nr-details-cancel-button')
      })
    })

    describe('And the Edit Button logic is working correctly, so that an Examiner', () => {
      beforeEach(async () => {
        sessionStorage.setItem('USER_ROLES', ['names_approver'])
        sessionStorage.setItem('USERNAME', 'max')
        vm = instance.$mount()
        vm.$store.commit('setLoginValues')
        vm.$store.commit('nrNumber', 'NR 2000948')
        await sleep(100)
      })

      describe('Cannot edit an INPROGRESS NR that is not their own', () => {
        it('Edit Request Button is hidden', () => {
          expect(vm.$el.querySelector('#nr-details-edit-button')).toBeNull()
        })
      })
    })

    describe('But when its their own NR', () => {
      beforeEach(async () => {
        sessionStorage.setItem('USER_ROLES', ['names_approver'])
        sessionStorage.setItem('USERNAME', 'tester')
        vm = instance.$mount()
        vm.$store.commit('setLoginValues')
        vm.$store.commit('nrNumber', 'NR 2000948')
        await sleep(100)
      })

      describe('They can edit', () => {
        it('It shows the edit button', () => {
          expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        })
      })
    })

    describe('And for Staff', () => {
      beforeEach(async () => {
        sessionStorage.setItem('USER_ROLES', ['names_editor'])
        sessionStorage.setItem('USERNAME', 'tester')
        vm = instance.$mount()
        vm.$store.commit('setLoginValues')
        vm.$store.commit('nrNumber', 'NR 2000948')
        await sleep(100)
      })

      describe('When they are currently editing', () => {
        it('it shows the Edit Request Button', () => {
          expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        })
      })
    })
  })

  describe('For a Complete NR', () => {
    let vm
    let sandbox

    let putCall, getCall, patchCall

    let click = function (id) {
      let button = vm.$el.querySelector(id)
      let window = button.ownerDocument.defaultView
      var click = new window.Event('click')
      button.dispatchEvent(click)
    }

    beforeEach(async () => {
      sandbox = sinon.createSandbox()
      putCall = sandbox.stub(axios, 'put').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'REJECTED',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000952',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'REJECTED',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      getCall = sandbox.stub(axios, 'get').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              additionalInfo: 'More info',
              applicants:
                {
                  addrLine1: '940 Blanshard Street',
                  addrLine2: null,
                  addrLine3: null,
                  city: 'Victoria',
                  clientFirstName: null,
                  clientLastName: null,
                  contact: 'John Test',
                  countryTypeCd: 'CA',
                  declineNotificationInd: null,
                  emailAddress: 'testoutputs@gov.bc.ca',
                  faxNumber: null,
                  firstName: 'John',
                  lastName: 'Test',
                  middleName: null,
                  partyId: 1822,
                  phoneNumber: '2505555555',
                  postalCd: 'V8V4K8',
                  stateProvinceCd: 'BC',
                },
              comments: [],
              consentFlag: null,
              corpNum: null,
              expirationDate: null,
              furnished: 'N',
              id: 1822,
              lastUpdate: 'Thu, 18 Oct 2018 22:46:54 GMT',
              names: [
                {
                  choice: 1,
                  comment: null,
                  conflict1: '',
                  conflict1_num: '',
                  conflict2: '',
                  conflict2_num: '',
                  conflict3: '',
                  conflict3_num: '',
                  consumptionDate: null,
                  decision_text: '',
                  name: 'COLDSTREAM REFRIGERATION  HVAC SERVICES LIMITED',
                  state: 'REJECTED',
                },
              ],
              natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
                'spaces and punctuation.',
              nrNum: 'NR 2000952',
              nwpta: [],
              previousNr: null,
              previousRequestId: null,
              previousStateCd: null,
              priorityCd: 'Y',
              requestTypeCd: 'CR',
              state: 'REJECTED',
              submitCount: 1,
              submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
              submitter_userid: '',
              userId: 'tester',
              xproJurisdiction: null,
            },
        })),
      )
      patchCall = sandbox.stub(axios, 'patch').withArgs('/api/v1/requests/NR 2000952', sinon.match.any).returns(
        new Promise((resolve) => resolve({
          data:
            {
              message: 'Request:NR 2000952 - patched',
            },
        })),
      )
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      vm.$store.commit('nrNumber', 'NR 2000952')
      await sleep(100)
    })

    afterEach(() => {
      sandbox.restore()
    })

    describe('After clicking Cancel, The Edit Request Button', () => {
      beforeEach(async () => {
        click('#nr-details-edit-button')
        await sleep(100)
      })

      afterEach(async () => {
        await sleep(100)
      })

      it('is visible and the cancel/save button is not ', async () => {
        click('#nr-details-cancel-button')
        await sleep(10)

        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull()
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull()

        // the PATCH should not have been called (ie: no change in state), just a GET
        expect(patchCall.lastCall).toBeNull()
        expect(getCall.lastCall).not.toBeNull()
      })

      it('And after clicking Edit Request, the Cancel/Save buttons are visible and working', async () => {
        expect(vm.validate()).toBeTruthy()
        expect(vm.$el.querySelector('#nr-details-save-button')).not.toBeNull()

        click('#nr-details-save-button')
        await sleep(10)

        expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
        expect(vm.$el.querySelector('#nr-details-save-button')).toBeNull()
        expect(vm.$el.querySelector('#nr-details-cancel-button')).toBeNull()

        // the PUT is called without changing the state, ie: it's still REJECTED
        expect(putCall.lastCall).not.toBeNull()
        expect(putCall.lastCall.args[1].state).toEqual('REJECTED')
        expect(putCall.lastCall.args[1].previousStateCd).toEqual(null)
      })
    })
  })

  describe('Testing View-only users cannot see the Edit button even when the NR is in DRAFT', () => {
    let vm
    let sandbox

    beforeEach(async () => {
      sessionStorage.setItem('USER_ROLES', ['names_viewer'])
      sandbox = sinon.createSandbox()
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('Does not has the edit button for a viewer', () => {
      expect(vm.$el.querySelector('#nr-details-edit-button')).toBeNull()
    })
  })

  describe('Testing Staff (edit but not examine) users can see the Edit button when the NR is in DRAFT', () => {
    let vm
    let sandbox

    beforeEach(async () => {
      sessionStorage.setItem('USER_ROLES', ['names_editor'])
      sandbox = sinon.createSandbox()
      vm = instance.$mount()
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('has the edit button for a staff member', () => {
      expect(vm.$el.querySelector('#nr-details-edit-button')).not.toBeNull()
    })
  })
})
