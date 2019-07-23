/* eslint-disable */
import Vue from 'vue';
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(require('vue-shortkey'))
import Decision from '@/components/application/Examine/Decision';
import store from '@/store'

describe('Decision.vue', () => {

  let instance;
  let vm;

  let makeDecision = function (decision) {
    // Fake a decision being made, and return the decision text from before and after the decision
    // was made.

    // make the decision
    var customer_message_initial = instance.customer_message_display;
    instance.decision_made = decision;
    instance.nameAcceptReject();
    var customer_message_after_decision = instance.customer_message_display;

    // return the pre and post decision text for comparisons
    return [customer_message_initial, customer_message_after_decision];
  }

  beforeEach(() => {
    const Constructor = Vue.extend(Decision);
    instance = new Constructor({store: store});

    instance.decision_made = null;

    // stub $refs for function call that is not part of these tests
    instance.$refs = {
      decisioncomments: {
        addNewComment() {
          return null;
        }
      }
    };
  });

  describe('When conditions have been selected with consent required', () => {

    beforeEach(() => {

      instance.conditionsSelected = [
        {
          "id": 223,
          "phrase": "DOCTOR",
          "allow_use": true,
          "consent_required": false,
          "instructions": "Sample doctor condition text, not requiring consent."
        },
        {
          "id": 1,
          "phrase": "TEST",
          "allow_use": true,
          "consent_required": true,
          "instructions": "Sample condition requiring consent."
        }
      ];
      vm = instance.$mount();
    });

    it('Displays each condition in customer message', () => {
      vm.$nextTick(function () {
        expect(instance.customer_message_display).toContain("Sample doctor condition text, not requiring consent.")
        expect(instance.customer_message_display).toContain("Sample condition requiring consent.");
      })
    });

    it('Sets conditional approval flag', () => {
      vm.$nextTick(function() {
        expect(instance.acceptance_will_be_conditional).toBe(true);
      })
    });

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("APPROVED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("REJECTED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });
  });

  describe('When conditions have been selected with NO consent required', () => {

    beforeEach(() => {

      instance.conditionsSelected = [
        {
          "id": 223,
          "phrase": "DOCTOR",
          "allow_use": true,
          "consent_required": false,
          "instructions": "Sample doctor condition text, not requiring consent."
        },
        {
          "id": 1,
          "phrase": "TEST",
          "allow_use": true,
          "consent_required": false,
          "instructions": "Sample condition NOT requiring consent."
        }
      ];
      vm = instance.$mount()
    });

    it('Does not set conditional approval flag', () => {
      expect(instance.acceptance_will_be_conditional).toBe(false);
    });
  });

  describe('When "consent required" condition has been selected WITHOUT conflicts', () => {

    beforeEach(() => {
      vm = instance.$mount()
    });

    it('Contains "consent required" message', () => {

      instance.consent_required_by_user = true

      vm.$nextTick(function () {
        expect(vm.$el.querySelect('#conditional-accept-button')).toBeDefined()
      })
    });

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("APPROVED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("REJECTED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });

  });

  describe('When "consent required" condition has been selected WITH conflicts', () => {
    beforeEach(() => {

      instance.selectedConflicts = [
        {
          "nrNumber": "0299669",
          "text": "DR. EARL J. MCDONALD INC.",
          "source": "CORP",
        }
      ];
      vm = instance.$mount()
    });

    it('Conflict message includes "consent required" and not "rejected"', () => {
      vm.$nextTick(function () {
        expect(instance.customer_message_display).toContain("Consent required from DR. EARL J. MCDONALD INC.")
        expect(instance.customer_message_display).not.toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
      })
    });

    it('Saves the decision text as built by examiner upon APPROVED decision made', () => {
      vm.$nextTick(function () {
        var customer_message_initial, customer_message_after_decision;
        [customer_message_initial, customer_message_after_decision] = makeDecision("APPROVED")

        expect(customer_message_after_decision).toBe(customer_message_initial);
      })
    });

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      vm.$nextTick(function () {
        var customer_message_initial, customer_message_after_decision;
        [customer_message_initial, customer_message_after_decision] = makeDecision("REJECTED")

        expect(customer_message_after_decision).toBe(customer_message_initial);
      })
    });

  });

  describe('When conflicts have been selected without "consent required" condition', () => {
    beforeEach(() => {

      instance.decision_made = null;

      instance.selectedConflicts = [
        {
          "nrNumber": "0299669",
          "text": "DR. EARL J. MCDONALD INC.",
          "source": "CORP",
        },
        {
          "nrNumber": "1234",
          "text": "SAMPLE CONFLICT",
          "source": "CORP",
        }
      ];
      vm = instance.$mount()
    });

    it('Conflict message includes "rejected" and not "consent required"', () => {
      expect(instance.customer_message_display).toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
    });

    it('Contains message for each conflicts', () => {
      expect(instance.customer_message_display).toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
      expect(instance.customer_message_display).toContain("Rejected due to conflict with SAMPLE CONFLICT");

    });

    it('Clears the decision text re. conflicts upon APPROVED decision made', () => {
      vm.$nextTick(function () {
        var customer_message_initial, customer_message_after_decision;
        [customer_message_initial, customer_message_after_decision] = makeDecision("APPROVED")

        expect(customer_message_after_decision).not.toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.")
        expect(customer_message_after_decision).not.toContain("Rejected due to conflict with SAMPLE CONFLICT");
      })
    });

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("REJECTED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });

  });

  describe('When there are possible conflicts dropdown', () => {
    beforeEach(() => {

      instance.$store.state.exactMatchesConflicts = [
        {
          text: 'test1',
          nrNumber: 'NR1111',
          source: 'CORP'
        }
      ];
      instance.$store.state.synonymMatchesConflicts = [
        {
          text: 'test2',
          nrNumber: 'NR2222',
          source: 'CORP'
        }
      ];

      vm = instance.$mount();
      setTimeout(() => {
        done();
      }, 100)

    });

    it('displays the conflicts in exactMatch and synonymMatch in the dropdown', () => {
      expect(instance.conflictList).toEqual(
        [
          {
            text: 'test1',
            nrNumber: 'NR1111',
            source: 'CORP'
          },
          {
            text: 'test2',
            nrNumber: 'NR2222',
            source: 'CORP'
          }
        ]
      );
      expect(vm.$el.querySelector('#conflicts-select-area .v-select-list').textContent).toEqual('test1test2');
    });

  });

});




