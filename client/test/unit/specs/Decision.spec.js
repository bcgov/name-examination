/* eslint-disable */
import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import Decision from '@/components/application/Examine/Decision';
import store from '@/store'

describe('Decision.vue', () => {

  let instance;
  let vm;

  let makeDecision = function(decision) {
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
    instance = new Constructor({store:store});

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

      instance.conditions_selected = [
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
    });

    it('Displays each condition in customer message', () => {
      expect(instance.customer_message_display).toContain("Sample doctor condition text, not requiring consent.");
      expect(instance.customer_message_display).toContain("Sample condition requiring consent.");
    });

    it('Sets conditional approval flag', () => {
      expect(instance.acceptance_will_be_conditional).toBe(true);
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

      instance.conditions_selected = [
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
    });

    it('Does not set conditional approval flag', () => {
      expect(instance.acceptance_will_be_conditional).toBe(false);
    });
  });

  describe('When "consent required" condition has been selected WITHOUT conflicts', () => {

    it('Contains "consent required" message', () => {

      instance.conditions_selected = [
        {
          "id": "CONSENTREQUIRED",
          "consent_required": true,
          "display_string": "Consent Required",
          "instructions": "Consent Required.",
        },
      ];
      expect(instance.customer_message_display).toContain("Consent Required.");
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

      instance.conditions_selected = [
        {
          "id": "CONSENTREQUIRED",
          "consent_required": true,
          "display_string": "Consent Required",
          "instructions": "Consent Required.",
        },
      ];
      instance.conflicts_selected = [
        {
          "nrNumber": "0299669",
          "text": "DR. EARL J. MCDONALD INC.",
          "source": "CORP",
        }
      ];

    });

    it('Does not contain "consent required" standalone message', () => {
      expect(instance.customer_message_display).not.toContain("Consent Required.");
    });

    it('Conflict message includes "consent required" and not "rejected"', () => {
      expect(instance.customer_message_display).toContain("Consent required from DR. EARL J. MCDONALD INC.");
      expect(instance.customer_message_display).not.toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
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

  describe('When conflicts have been selected without "consent required" condition', () => {
    beforeEach(() => {

      instance.decision_made = null;

      instance.conflicts_selected = [
        {
          "nrNumber": "0299669",
          "text": "DR. EARL J. MCDONALD INC.",
          "source": "CORP",
        },
        {
          "nrNumber": "111",
          "text": "SAMPLE CONFLICT",
          "source": "CORP",
        }
      ];

    });

    it('Conflict message includes "rejected" and not "consent required"', () => {
      expect(instance.customer_message_display).not.toContain("Consent required from from DR. EARL J. MCDONALD INC.");
      expect(instance.customer_message_display).toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
    });

    it('Contains message for each conflicts', () => {
      expect(instance.customer_message_display).toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
      expect(instance.customer_message_display).toContain("Rejected due to conflict with SAMPLE CONFLICT");

    });

    it('Clears the decision text re. conflicts upon APPROVED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("APPROVED");

      expect(customer_message_after_decision).not.toContain("Rejected due to conflict with DR. EARL J. MCDONALD INC.");
      expect(customer_message_after_decision).not.toContain("Rejected due to conflict with SAMPLE CONFLICT");
    });

    it('Saves the decision text as built by examiner upon REJECTED decision made', () => {
      var customer_message_initial, customer_message_after_decision;
      [customer_message_initial, customer_message_after_decision] = makeDecision("REJECTED");

      expect(customer_message_after_decision).toBe(customer_message_initial);
    });

  });

});




