import Vue from 'vue'

import Decision from '@/components/application/Examine/Decision'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'
import { createApiSandbox } from '../sandbox/Generic-api-stubs.js'

describe('Decision.vue component', () => {
  let instance
  let vm
  createApiSandbox()
  const Constructor = Vue.extend(Decision)
  let makeDecision

  beforeEach((done) => {
    store.replaceState(cleanState())
    instance = new Constructor({ store: store })
    instance.$store.state.is_making_decision = true
    instance.$store.state.examiner = 'Joe'
    instance.$store.state.userId = 'Joe'
    instance.decision_made = null
    instance.$store.state.currentNameObj = {
      name: 'blah',
      choice: null,
    }

    makeDecision = function (decision) {
      // Fake a decision being made, and return the decision text from before and after the decision
      // was made.
      var customer_message_initial = instance.customer_message_display
      instance.decision_made = decision
      instance.nameAcceptReject()
      var customer_message_after_decision = instance.customer_message_display

      // return the pre and post decision text for comparisons
      return [ customer_message_initial, customer_message_after_decision ]
    }
    setTimeout(()=> { done() } )
  })

  describe('When conditions have been selected with consent required', () => {

    beforeEach((done) => {
      vm = instance.$mount()
      setTimeout(() => {
        done()
      }, 100)
    })

    describe('Now add data to the mounted component', () => {
      beforeEach((done) => {
        vm.selected_conditions = [
          {
            'id': 223,
            'phrase': 'DOCTOR',
            'allow_use': true,
            'consent_required': false,
            'instructions': 'Sample doctor condition text, not requiring consent.',
          },
          {
            'id': 1,
            'phrase': 'TEST',
            'allow_use': true,
            'consent_required': true,
            'instructions': 'Sample condition requiring consent.',
          },
        ]
        setTimeout(() => { done() }, 1000)
      })


    it('Displays each condition in customer message', () => {
        expect(vm.customer_message_display).toContain('Sample doctor condition text, not requiring consent.')
        expect(vm.customer_message_display).toContain('Sample condition requiring consent.')
    })

    it('Sets conditional approval flag', () => {
        expect(vm.$store.state.acceptance_will_be_conditional).toBe(true)

    })

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [ customer_message_initial, customer_message_after_decision ] = makeDecision('APPROVED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [ customer_message_initial, customer_message_after_decision ] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })
  })
  })

  describe('When conditions have been selected with NO consent required', () => {

    beforeEach(() => {
      vm = instance.$mount()
      vm.selected_conditions = [
        {
          'id': 223,
          'phrase': 'DOCTOR',
          'allow_use': true,
          'consent_required': false,
          'instructions': 'Sample doctor condition text, not requiring consent.',
        },
        {
          'id': 1,
          'phrase': 'TEST',
          'allow_use': true,
          'consent_required': false,
          'instructions': 'Sample condition NOT requiring consent.',
        },
      ]

    })

    it('Does not set conditional approval flag', () => {
      expect(vm.acceptance_will_be_conditional).toBe(false)
    })
  })

  describe('When "consent required" condition has been selected WITHOUT conflicts', () => {

    beforeEach((done) => {
      vm = instance.$mount()
      setTimeout(()=>{ done() }, 1000)
    })

    it('Contains "consent required" message', () => {

      vm.consent_required_by_user = true


        expect(vm.$el.querySelector('#conditional-accept-button')).toBeDefined()
    })

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [ customer_message_initial, customer_message_after_decision ] = makeDecision('APPROVED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [ customer_message_initial, customer_message_after_decision ] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When "consent required" condition has been selected WITH conflicts', () => {
    beforeEach(() => {
      vm = instance.$mount()
      vm.selected_conflicts = [
        {
          'nrNumber': '0299669',
          'text': 'DR. EARL J. MCDONALD INC.',
          'source': 'CORP',
        },
      ]
      vm.consent_required_by_user = true

    })

    it('Conflict message includes "consent required" and not "rejected"', () => {

        expect(vm.customer_message_display).toContain('Consent required from DR. EARL J. MCDONALD INC.')
        expect(vm.customer_message_display).not.toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
    })

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {

        var customer_message_initial, customer_message_after_decision;
        [ customer_message_initial, customer_message_after_decision ] = makeDecision('APPROVED')

        expect(customer_message_after_decision).toBe(customer_message_initial)

    })

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {

        var customer_message_initial, customer_message_after_decision;
        [ customer_message_initial, customer_message_after_decision ] = makeDecision('REJECTED')

        expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When conflicts have been selected without "consent required" condition', () => {
    beforeEach(() => {
      vm = instance.$mount()
      vm.decision_made = null

      vm.$store.state.selectedConflicts = [
        {
          'nrNumber': '0299669',
          'text': 'DR. EARL J. MCDONALD INC.',
          'source': 'CORP',
        },
        {
          'nrNumber': '1234',
          'text': 'SAMPLE CONFLICT',
          'source': 'CORP',
        },
      ]

    })

    it('Conflict message includes "rejected" and not "consent required"', () => {
      expect(vm.customer_message_display).toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
    })

    it('Contains message for each conflicts', () => {
      expect(vm.customer_message_display).toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
      expect(vm.customer_message_display).toContain('Rejected due to conflict with SAMPLE CONFLICT')

    })

    it('Clears the decision text re. conflicts upon APPROVED decision made', () => {

        var customer_message_initial, customer_message_after_decision;
        [ customer_message_initial, customer_message_after_decision ] = makeDecision('APPROVED')

        expect(customer_message_after_decision).not.toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
        expect(customer_message_after_decision).not.toContain('Rejected due to conflict with SAMPLE CONFLICT')
    })

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [ customer_message_initial, customer_message_after_decision ] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When there are possible conflicts dropdown', () => {
    beforeEach(() => {
      vm = instance.$mount()
      vm.$store.state.exactMatchesConflicts = [
        {
          text: 'test1',
          nrNumber: 'NR1111',
          source: 'CORP',
        },
      ]
      vm.$store.state.synonymMatchesConflicts = [
        {
          text: 'test2',
          nrNumber: 'NR2222',
          source: 'CORP',
        },
      ]

      setTimeout(() => {
        done()
      }, 1000)

    })

    it('displays the conflicts in exactMatch and synonymMatch in the dropdown', () => {
      expect(vm.conflictList)
      .toEqual(
        [
          {
            text: 'test1',
            nrNumber: 'NR1111',
            source: 'CORP',
          },
          {
            text: 'test2',
            nrNumber: 'NR2222',
            source: 'CORP',
          },
        ],
      )
      expect(vm.$el.querySelector('#conflicts-select-area .v-select-list').textContent).toEqual('test1test2')
    })

  })

})




