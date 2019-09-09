import Vue from 'vue'

import Decision from '@/components/application/Examine/Decision'
import store from '@/store'
import { cleanState } from '../../features/specs/support/clean.state'
import { createApiSandbox } from '../sandbox/Generic-api-stubs.js'

describe('Testing Decision.vue', () => {
  let data = {}
  let makeDecision
  const Constructor = Vue.extend(Decision)

  beforeAll( () => {
    //There are no api calls that actually influence the outcomes of these tests.  They will all pass without
    //the sandbox, however, have included it to prevent console errors.
    data.api = createApiSandbox()
  })

  afterAll( () => {
    data.api.restore()
  })

  beforeEach( done => {
    store.replaceState(cleanState())
    data.instance = new Constructor({store})
    data.vm = data.instance.$mount()

    makeDecision = (decision) => {
      // Fake a decision being made, and return the decision text from before and after the decision
      // was made.
      var customer_message_initial = data.instance.customer_message_display
      data.instance.decision_made = decision
      data.instance.nameAcceptReject()
      var customer_message_after_decision = data.instance.customer_message_display

      // return the pre and post decision text for comparisons
      return [customer_message_initial, customer_message_after_decision]
    }

    setTimeout( () => { done() }, 1000)
  })

  describe('Testing the Decision customer message text:  starting with conflicts requiring consent', () => {
    beforeEach( done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.selectedConditions = [
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

    test('It displays each condition in customer message', () => {
      expect(data.vm.customer_message_display).toContain('Sample doctor condition text, not requiring consent.')
      expect(data.vm.customer_message_display).toContain('Sample condition requiring consent.')
    })

    test('The acceptanceWillBeConditional getter is set correctly', () => {
      expect(data.vm.$store.getters.acceptanceWillBeConditional).toBe(true)
    })

    test('It saves the decision text as built by examiner upon APPROVED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('APPROVED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

    test('It saves the decision text as built by examiner upon REJECTED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })
  })

  describe('When conditions have been selected with NO consent required', () => {
    beforeEach( done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.selectedConditions = [
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
      setTimeout(() => { done() }, 1000)
    })

    test('Does not set conditional approval flag', () => {
      expect(data.vm.$store.getters.acceptanceWillBeConditional).toBe(false)
    })
  })

  describe('When "consent required" condition has been selected WITHOUT conflicts', () => {
    beforeEach (done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.consentRequiredByUser = true
      setTimeout(() => { done() }, 1000)
    })

    test('Contains "consent required" message', () => {
      expect(data.vm.customer_message_display).toContain('Consent Required')
    })

    test('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('APPROVED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

    test('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When "consent required" condition has been selected WITH conflicts', () => {
    beforeEach( done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.selectedConflicts = [
        {
          'nrNumber': '0299669',
          'text': 'DR. EARL J. MCDONALD INC.',
          'source': 'CORP',
        },
      ]
      state.consentRequiredByUser = true
      setTimeout(() => { done() }, 1000)
    })

    test('Conflict message includes "consent required" and not "rejected"', () => {
      expect(data.vm.customer_message_display).toContain('Consent required')
      expect(data.vm.customer_message_display).not.toContain('Rejected')
    })

    test('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('APPROVED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

    test('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When conflicts have been selected without "consent required" condition', () => {
    beforeEach(done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.selectedConflicts = [
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
      setTimeout(() => { done() }, 1000)
    })

    test('Conflict message includes "rejected" and not "consent required"', () => {
      expect(data.vm.customer_message_display).toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
    })

    test('Contains message for each conflicts', () => {
      expect(data.vm.customer_message_display).toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
      expect(data.vm.customer_message_display).toContain('Rejected due to conflict with SAMPLE CONFLICT')

    })

    test('Clears the decision text re. conflicts upon APPROVED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('APPROVED')

      expect(customer_message_after_decision).not.toContain('Rejected due to conflict with DR. EARL J. MCDONALD INC.')
      expect(customer_message_after_decision).not.toContain('Rejected due to conflict with SAMPLE CONFLICT')
    })

    test('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      let customer_message_initial, customer_message_after_decision
      [customer_message_initial, customer_message_after_decision] = makeDecision('REJECTED')

      expect(customer_message_after_decision).toBe(customer_message_initial)
    })

  })

  describe('When there are possible conflicts dropdown', () => {
    beforeEach( done => {
      let { state } = data.vm.$store
      state.is_making_decision = true
      state.userId = 'Joe'
      state.examiner = 'Joe'
      state.currentNameObj = {
        name: 'blah',
        choice: null,
      }
      state.exactMatchesConflicts = [
        {
          text: 'test1',
          nrNumber: 'NR1111',
          source: 'CORP',
        },
      ]
      state.synonymMatchesConflicts = [
        {
          text: 'test2',
          nrNumber: 'NR2222',
          source: 'CORP',
        },
      ]
      setTimeout(() => { done() }, 1000)
    })

    test('displays the conflicts in exactMatch and synonymMatch in the dropdown', () => {
      expect(data.vm.conflictList).toEqual(
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
    })
  })
})
