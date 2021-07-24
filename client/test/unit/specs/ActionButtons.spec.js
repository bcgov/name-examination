/* es-lint disable */
import Vue from 'vue'
import sinon from 'sinon'
import ActionButtons from '@/components/application/Examine/ActionButtons'
import store from '@/store'
import axios from '@/axios-auth'
import { sleep } from '@/utils/sleep'

const data = {
  additionalInfo: 'More info',
  applicants: {
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
  names: [ {
    choice: 1,
    comment: null,
    conflict1: 'Bada Boom Bad Name',
    conflict1_num: 123,
    conflict2: 'Bad Dudes Name',
    conflict2_num: 456,
    conflict3: null,
    conflict3_num: null,
    consumptionDate: null,
    decision_text: 'Nope.',
    name: 'Bad Name',
    state: 'REJECTED',
  }, {
    choice: 2,
    comment: {
      comment: 'My internal decision comment.',
    },
    conflict1: null,
    conflict1_num: null,
    conflict2: null,
    conflict2_num: null,
    conflict3: null,
    conflict3_num: null,
    consumptionDate: null,
    decision_text: 'Good work.',
    name: 'Good Name',
    state: 'APPROVED',
  }, {
    choice: 3,
    name: 'Whatever',
    state: 'NE',
    decision_text: null,
    conflict1: null,
    conflict1_num: null,
    conflict2: null,
    conflict2_num: null,
    conflict3: null,
    conflict3_num: null,
  } ],
  natureBusinessInfo: 'Nature of business can be pretty long so this one is more realistic. It even contains ' +
    'spaces and punctuation.',
  nrNum: 'NR 2000951',
  nwpta: [],
  previousNr: null,
  previousRequestId: null,
  previousStateCd: 'DRAFT',
  priorityCd: 'Y',
  requestTypeCd: 'CR',
  state: 'APPROVED',
  submitCount: 1,
  submittedDate: 'Wed, 17 Oct 2018 11:37:20 GMT',
  submitter_userid: '',
  userId: 'tester',
  xproJurisdiction: null,
}

describe('ActionButtons.vue', () => {
  let instance

  beforeEach(() => {
    const Constructor = Vue.extend(ActionButtons)
    instance = new Constructor({ store })
    instance.$store.state.myKeycloak = {}
    instance.can_edit = true
    instance.edit = function () {return null}
    instance.is_viewing = false
    instance.toggleDetails = function () {return null}
  })

  describe('Initialization', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'INPROGRESS'
      instance.$store.state.examiner = 'AdaLovelace'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'NE',
          },
        compName2: { choice: 2, name: 'Good Name', state: 'NE' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_approver' ])
      sessionStorage.setItem('USERNAME', 'GraceHopper')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('hides decision and hold buttons for IN PROGRESS NR of another examiner', () => {
      expect(vm.$el.querySelector('#examine-decide-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-hold-button')).toBeNull()
    })

    it('shows the cancel and get next buttons when viewing an IN PROGRESS NR of another examiner', () => {
      expect(vm.$el.querySelector('#examine-cancel-button')).not.toBeNull()
      expect(vm.$el.querySelector('#examine-get-next-button')).not.toBeNull()
    })
  })

  describe('Editors/Staff cannot see Decision-related buttons for APPROVED NRs ', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'APPROVED'
      instance.$store.state.examiner = 'AdaLovelace'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'Good Name', state: 'APPROVED' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
      sessionStorage.setItem('USERNAME', 'GraceHopper')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('hides decision and hold buttons of an APPROVED NR from an editor user', () => {
      expect(vm.$el.querySelector('#examine-decide-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-hold-button')).toBeNull()
    })

    it('Hides the get next button from an editor user', () => {
      expect(vm.$el.querySelector('#examine-get-next-button')).toBeNull()
    })

    //TODO : TEST FOR RESET BUTTON reopen button for completed NRs for examiners and editors
    // also for completed NRs for viewers.  SHouldn't see them
  })

  describe('Viewers cannot see any buttons', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'HOLD'
      instance.$store.state.furnished = 'N'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'NE' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_viewer' ])
      sessionStorage.setItem('USERNAME', 'GraceHopper')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('hides all the buttons from a view-only user', () => {
      expect(vm.$el.querySelector('#examine-decide-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-hold-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-get-next-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-cancel-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull()
      expect(vm.$el.querySelector('#examine-button')).toBeNull()
    })
  })

  describe('Editors/Staff can see Cancel Buttons on DRAFT NRs', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'DRAFT'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'DRAFT',
          },
        compName2: { choice: 2, name: 'Good Name', state: 'DRAFT' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
      sessionStorage.setItem('USERNAME', 'GraceHopper')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Shows the cancel button for an editor user on an DRAFT NR', () => {
      expect(vm.$el.querySelector('#examine-cancel-button')).not.toBeNull()
    })
  })

  describe('Viewers cannot see the reset button for a furnished completed NR', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'APPROVED'
      instance.$store.state.furnished = 'Y'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'APPROVED' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_viewer' ])
      sessionStorage.setItem('USERNAME', 'AdaLovelace')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('hides the reset button from a view-only user', () => {
      expect(vm.$el.querySelector('#examine-reset-button')).toBeNull()
    })
  })

  describe('Editors can see the reset button for a completed, furnished NR', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'APPROVED'
      instance.$store.state.furnished = 'Y'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'APPROVED' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
      sessionStorage.setItem('USERNAME', 'Ada')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Shows the reset button for staff/editor', () => {
      expect(vm.$el.querySelector('#examine-reset-button')).not.toBeNull()
    })
  })

  describe('Viewers cannot see the reopen button for a completed NR', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'APPROVED'
      instance.$store.state.furnished = 'Y'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'APPROVED' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_viewer' ])
      sessionStorage.setItem('USERNAME', 'AdaLovelace')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('hides the reset button from a view-only user', () => {
      expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull()
    })
  })

  describe('Editors can see the reopen button for a completed, unfurnished NR', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)

      instance.$store.state.currentState = 'APPROVED'
      instance.$store.state.furnished = 'N'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'APPROVED' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
      sessionStorage.setItem('USERNAME', 'Ada')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Shows the reset button for staff/editor', () => {
      expect(vm.$el.querySelector('#examine-re-open-button')).not.toBeNull()
    })
  })

  describe('Editors cannot see the examine button for a draft NR', () => {
    let vm

    beforeEach(async () => {
      instance.$store.state.currentState = 'DRAFT'
      instance.$store.state.furnished = 'N'
      instance.$store.state.compInfo.compNames = {
        compName1:
          {
            choice: 1,
            name: 'Bad Name',
            state: 'REJECTED',
          },
        compName2: { choice: 2, name: 'They Named a Language after ME', state: 'NE' },
        compName3: { choice: 3, name: null, state: 'NE' },
      }
      vm = instance.$mount()
      sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
      sessionStorage.setItem('USERNAME', 'Ada')
      vm.$store.commit('setLoginValues')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    it('Hides the examine button for staff/editor', () => {
      expect(vm.$el.querySelector('#examine-button')).toBeNull()
    })
  })

  describe('Reset & Re-Open', () => {
    let vm

    beforeEach(async () => {
      let response = sinon.fake.resolves({ data })
      sinon.replace(axios, 'get', response)
      sinon.replace(axios, 'put', response)

      // stub out updateRequest action from index - we don't care what it does and it errors during testing
      // instance.$store._actions.updateRequest[0] = sinon.stub()

      // NR that is completed with one rejected name (conflict) and one approved name

      vm = instance.$mount()
      vm.$store.dispatch('getpostgrescompInfo', 'NR 2000951')
      await sleep(100)
    })

    afterEach(() => {
      sinon.restore()
    })

    describe('Reset', () => {
      beforeEach(() => {
        jest.setTimeout(100000)
        instance.$store.state.furnished = 'Y'
      })

      it('displays RESET button and not RE-OPEN button', () => {
        expect(vm.$el.querySelector('#examine-reset-button')).not.toBeNull()
        expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull()
      })

      it('Resets NR status upon reset', async () => {
        vm.reset()
        await sleep(10000)

        expect(instance.$store.state.currentState).toEqual('INPROGRESS')
      })

      it('keeps decision data upon reset',async () => {
        vm.reset()
        await sleep(10)

        expect(instance.$store.state.compInfo.compNames.compName1.state).toEqual('REJECTED')
        expect(instance.$store.state.compInfo.compNames.compName1.decision_text).toEqual('Nope.')
        expect(instance.$store.state.compInfo.compNames.compName1.conflict1).toEqual('Bada Boom Bad Name')
        expect(instance.$store.state.compInfo.compNames.compName1.conflict1_num).toEqual(123)
        expect(instance.$store.state.compInfo.compNames.compName2.comment.comment).toEqual('My internal decision comment.')
      })

      describe('For Editors', () => {
        beforeEach(async () => {
          sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
          vm.$store.commit('setLoginValues')
          await sleep(100)
        })

        it('NR is opened to edit screen', async () => {
          vm.reset()
          await sleep(10)

          expect(instance.$store.state.is_editing).toEqual(true)
        })
      })
    }) // end RESET

    describe('Re-Open', () => {
      beforeEach(() => {
        jest.setTimeout(100000)
        instance.$store.state.furnished = 'N'
      })

      it('displays RE-OPEN button and not RESET button', () => {
        vm.$nextTick(function () {
          expect(vm.$el.querySelector('#examine-reset-button')).toBeNull()
          expect(vm.$el.querySelector('#examine-re-open-button')).toBeNull()
        })
      })


      it('Re-opens NR status upon button click', async () => {
        vm.reOpen()
        await sleep(10000)

        expect(instance.$store.state.currentState).toEqual('INPROGRESS')
      })

      it('keeps decision data upon re-open', async () => {
        vm.reOpen()
        await sleep(10)

        expect(instance.$store.state.compInfo.compNames.compName1.state).toEqual('REJECTED')
        expect(instance.$store.state.compInfo.compNames.compName1.decision_text).toEqual('Nope.')
        expect(instance.$store.state.compInfo.compNames.compName1.conflict1).toEqual('Bada Boom Bad Name')
        expect(instance.$store.state.compInfo.compNames.compName1.conflict1_num).toEqual(123)
        expect(instance.$store.state.compInfo.compNames.compName2.comment.comment).toEqual('My internal decision comment.')
      })

      describe('For Editors', () => {
        beforeEach(async () => {
          sessionStorage.setItem('USER_ROLES', [ 'names_editor' ])
          vm.$store.commit('setLoginValues')
          await sleep(100)
        })

        it('NR is opened to edit screen', async () => {
          vm.reOpen()
          await sleep(10)

          expect(instance.$store.state.is_editing).toEqual(true)
        })
      })
    })
  })
})
