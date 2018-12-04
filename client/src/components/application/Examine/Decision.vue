/* eslint-disable */
<template>
  <span>
    <div class="row">
      <div class="col-6 add-top-padding">
        <h3>Conditions</h3>
        <div>
        <multiselect
          v-model="conditions_selected"
          :options="conditions_onlycustomerfacing"
          :multiple="true"
          :custom-label="conditionsLabel"
          name="phrase"
          track-by="phrase"
          :close-on-select="true"
          deselectLabel=""
          selectLabel=""
          selectedLabel=""
          placeholder=""
          :disabled="customer_message_override !== null"
        />
        </div>
      </div>
      <div class="col-6 add-top-padding">
        <h3>Conflicts</h3>
        <multiselect
          v-model="conflicts_selected"
          :options="conflictList"
          :multiple="true"
          :custom-label="conflictsLabel"
          track-by="nrNumber"
          :max="3"
          :close-on-select="true"
          deselectLabel=""
          selectLabel=""
          selectedLabel=""
          placeholder=""
          :disabled="customer_message_override !== null"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-6 add-top-padding">
        <h3>Generic Rejection Reason (label TBD)</h3>
        <multiselect
          v-model="decision_reasons_selected"
          :options="listDecisionReasons"
          :multiple="true"
          label="name"
          track-by="name"
          :close-on-select="true"
          deselectLabel=""
          selectLabel=""
          selectedLabel=""
          placeholder=""
          :disabled="customer_message_override !== null"
        />
      </div>
      <div class="col-6 add-top-padding">
        <h3>Trademarks</h3>
        <div>
        <multiselect
          v-model="trademarks_selected"
          :options="trademarks"
          :multiple="true"
          :custom-label="trademarksLabel"
          name="name"
          track-by="name"
          :close-on-select="true"
          deselectLabel=""
          selectLabel=""
          selectedLabel=""
          placeholder=""
          :disabled="customer_message_override !== null"
        />
        </div>
      </div>
    </div>

    <!-- internal alerts -->
    <div class="row">
      <div class="col add-top-padding">
        <div class="alert alert-warning"
             v-for="record in conditions_onlyinternalinstructions" v-bind:key="record.id">
            {{ record.text }}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col add-top-padding">
        <h3>Message to Requestor</h3>
        <div class="customer-msg-box">
          <pre>{{ customer_message_display }}</pre>
        </div>

        <!-- character count warning -->
        <div v-bind:class="{ 'warning': customer_message_display.length > 955,
                              'character_count': true }">
          Character count: {{ customer_message_display.length }}
          <span v-if="customer_message_display.length > 955" style="color: red;">
            <i class="fa fa-warning"></i>
            The message will be cut off at 955 characters.
          </span>
        </div>


        <a href="#" id="edit-customer-message-link" data-toggle="modal"
           data-target="#edit-customer-message-modal">Edit...</a>
        <a href="#" id="clear-customer-message-link" v-if="customer_message_override"
           @click="clearCustomerMessagOverride">Clear Customer Message Override</a>
      </div>
    </div>

    <internalcomments ref="decisioncomments" layout="decision"></internalcomments>

    <!-- Edit Customer Comments popup -->
    <div class="modal fade" id="edit-customer-message-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Edit Customer Comments</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea id="edit-customer-message-textarea" class="form-control" rows="10"
                      v-model="customer_message_display"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-secondary"
                    data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-sm btn-primary"
                    @click="saveCustomerMessageOverride">Save</button>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
/* eslint-disable */

  import internalcomments from "@/components/application/Examine/InternalComments.vue";
  import Multiselect from 'vue-multiselect';

  export default {
    name: "Decision",
    data: function ()
    {
      return {
        conditions_selected: [],
        conflicts_selected: [],
        decision_reasons_selected: [],
        trademarks_selected: [],
        customer_message_override: null,
        conflictList: []
      }
    },
    computed: {
      acceptance_will_be_conditional() {
        return this.$store.getters.acceptance_will_be_conditional;
      },
      require_consent_or_condition_set() {
        return this.$store.getters.require_consent_or_condition
      },
      is_making_decision: {
        get: function() {
          return this.$store.getters.is_making_decision;
        },
        set: function(value) {
          this.$store.commit('is_making_decision', value);
        }
      },
      decision_made: {
        get: function () {
          return this.$store.getters.decision_made;
        },
        set: function (value) {
          this.$store.commit('decision_made', value);
        }
      },
      currentNameObj: {
        get: function () {
          return this.$store.getters.currentNameObj;
        },
        set: function (value) {
          this.$store.dispatch('currentNameObj', value);
        }
      },
      exactMatchesConflicts() {
        return this.$store.getters.exactMatchesConflicts;
      },
      synonymMatchesConflicts() {
        return this.$store.getters.synonymMatchesConflicts;
      },
      currentConflict() {
        return this.$store.getters.currentConflict;
      },
      listDecisionReasons() {
        return this.$store.getters.listDecisionReasons;
      },
      conditions() {
        /* Re-arrange the fields in object to be easier to use in dropdowns.

        In the case of multiple conditions per word, break each condition into its own row for the
        dropdown (the nested for loops below). At time of development there is no data that actually
        has multiple conditions per word.

        Note: in the case where a word does not have any conditions (ie: nothing in the conditions
        xref table) we never get to the point where we create the revised_match_object, and never
        push it to the array. It is as if they were not returned.
        */

        try {
          if (this.$store.getters.conditionsJSON.restricted_words_conditions !== undefined) {
            var condition_matches = this.$store.getters.conditionsJSON.restricted_words_conditions;
            var retval = []

            for (let wordmatch of condition_matches) {
             for (let condition of wordmatch.cnd_info) {
               var revised_match_object = {};
               revised_match_object.id = wordmatch.word_info.id;
               revised_match_object.phrase = wordmatch.word_info.phrase;
               revised_match_object.allow_use = (condition.allow_use == 'Y')?true:false;
               revised_match_object.consent_required = (condition.consent_required == 'Y')?true:false;
               revised_match_object.instructions = condition.instructions;
               revised_match_object.text = condition.text;

               retval.push(revised_match_object);
             }
            }

            return retval;

          }
          else return []
        } catch (err) {
          return [];
        }
      },
      conditions_onlycustomerfacing() {
        /* subset of conditions, only those that have customer instructions
        */

        var arr_conditions = this.conditions.filter(function (el) {
          return el.instructions !== '' && el.instructions !== null
        });

        return arr_conditions;

      },
      conditions_onlyinternalinstructions() {
        return this.conditions.filter(function (el) {return el.text !== '' && el.text !== null});

      },
      currentCondition() {
        var currentCondition = this.$store.getters.currentCondition;
        if (currentCondition == null) return null;

        // only use the currentCondition if it requires consent
        if (currentCondition.consent_required != 'Y') return null;

        // Re-arrange the fields in object to be easier to use in dropdowns - match main list
        var revised_match_object = {};
        revised_match_object.phrase = currentCondition.word;
        revised_match_object.allow_use = (currentCondition.allow_use == 'Y')?true:false;
        revised_match_object.consent_required = (currentCondition.consent_required == 'Y')?true:false;
        revised_match_object.instructions = currentCondition.instructions;
        revised_match_object.text = currentCondition.text;

        return revised_match_object;

      },
      trademarks() {
        try {
          if (this.$store.getters.trademarksJSON !== null) {
            return this.$store.getters.trademarksJSON.names;
          }
          else return []
        } catch (err) {
          return [];
        }
      },
      currentTrademark() {
        return this.$store.getters.currentTrademark;
      },
      customer_message() {
        /*
        Build customer message based on selected conditions, conflicts, trademarks, and format.
         */

        var retval = [];

        // CONFLICTS
        for (var i = 0; i < this.conflicts_selected.length; i++) {

          // check whether "Consent Required" condition is set - if so, set message re. "Requires consent from..."
          if (this.require_consent_or_condition_set) {
            retval.push('Consent required from ' + this.conflicts_selected[i].text);
          }

          // if "Consent Required" condition is not set, set message re. "Rejected due..."
          else {
            retval.push('Rejected due to conflict with ' + this.conflicts_selected[i].text);
          }
        }

        // CONDITIONS
        for (var i = 0; i < this.conditions_selected.length; i++) {

          if (this.conditions_selected[i].phrase !== undefined && this.conditions_selected[i].phrase !== '') {
            retval.push(this.conditions_selected[i].phrase + ' - ' + this.conditions_selected[i].instructions);
          }
          else {
            retval.push(this.conditions_selected[i].instructions);
          }
        }

        // TRADEMARKS
        for (var i = 0; i < this.trademarks_selected.length; i++) {
          retval.push('Registered Trademark: ' + this.trademarks_selected[i].name + ' - Application #' + this.trademarks_selected[i].application_number);
        }

        // GENERIC DECISION REASONS
        for (var i = 0; i < this.decision_reasons_selected.length; i++) {
          retval.push(this.decision_reasons_selected[i].reason);
        }


        return retval;

      },
      customer_message_display: {
        get: function () {
          /*
          The text version of customer_message that is sent to API to be stored in DB.
           */

          // if there's a customer message override (ie: the examiner has edited the text) then use
          // that...
          if (this.customer_message_override) {
            return this.customer_message_override;

          } else {
            // otherwise build out formatted text with line breaks...
            var retval = '';

            for (var i = 0; i < this.customer_message.length; i++) {
              retval += this.customer_message[i] + '\n\n';
            }

            return retval;
          }
        },
        set: function (value) {
          /*
          This sets the message override from editing in the popup, NOT customer_message_display
          calculated field.
           */
          //this.customer_message_override = value;

        }
      },
    },
    components: {
      internalcomments,
      Multiselect,
    },
    mounted: function () {
      // pre-select the conflict from the display screen
      if (this.currentConflict !== null && this.currentConflict !== undefined) {
        this.conflicts_selected.push(this.currentConflict);
      }
      this.setConflictList();

      // pre-select the condition from the display screen
      if (this.currentCondition !== null && this.currentCondition !== undefined) {
        this.conditions_selected.push(this.currentCondition);
              // reset the conditional acceptance flag
        this.$store.commit('require_consent_or_condition', true);
      }

      // pre-select the trademark from the display screen
      if (this.currentTrademark !== null && this.currentTrademark !== undefined) {
        this.trademarks_selected.push(this.currentTrademark);
      }

    },
    watch: {
      decision_made: function() {
        this.nameAcceptReject();
      },
      conditions_selected: function (current_state, prev_state) {
        // set state variable indicating whether acceptance will be conditional or not
        let condition_selected = false;
        let consent_required = this.require_consent_or_condition_set;

        if (this.conditions_selected.length === 0) {
          consent_required = false;
        }

        for (var i = 0; i < this.conditions_selected.length; i++) {
          if (this.conditions_selected[i].consent_required) {
            if (this.conditions_selected.length === 1 && !prev_state || prev_state.length === 0) {
              consent_required = true;
            }
            condition_selected = true;
            break;
          }
        }

        this.$store.commit('require_consent_or_condition', consent_required);
        this.$store.commit('acceptance_will_be_conditional', condition_selected && consent_required);
      },
      exactMatchesConflicts: function (val) {
        console.log('synonymMatchesConflicts watcher fired: ',val);
        this.setConflictList();
      },
      synonymMatchesConflicts: function (val) {
        console.log('synonymMatchesConflicts watcher fired: ',val);
        this.setConflictList();
      }
    },
    methods: {
      clearCustomerMessagOverride() {
        this.customer_message_override = null;
      },
      saveCustomerMessageOverride(obj) {
        console.log('save customer message override...');
        console.log(obj);
        this.customer_message_override = $('#edit-customer-message-textarea').val();

        $('#edit-customer-message-modal').modal('hide');
      },
      conflictsLabel(obj) {
        return obj.text + ' - ' + obj.nrNumber;
      },
      conditionsLabel(obj) {
        if (obj.display_string !== undefined) return obj.display_string;
        else return obj.phrase + ' - ' + obj.instructions;
      },
      trademarksLabel(obj) {
        return obj.name + ' - ' + obj.application_number;
      },
      nameAcceptReject() {
        // save decision text, state, decision comment, and up to three conflicts

        if (this.decision_made == 'APPROVED') {
          this.currentNameObj.state = 'APPROVED'; // accepted

          // conditionally accepted if any conditions selected with condition_required flag TRUE
          if (this.acceptance_will_be_conditional && this.require_consent_or_condition_set) {
            this.currentNameObj.state = 'CONDITION'
          }

          // if there were conflicts selected but this is an approval, this will result in
          // accidental "rejected due to conflict" messaging. Remove it by clearing the selected
          // conflicts (Issue #767).
          // Do NOT clear the conflicts if the "Consent Required" condition is also set - then it's
          // intentional.
          if (!this.require_consent_or_condition_set) {
            this.conflicts_selected = [];
          }
        }
        else {
          this.currentNameObj.state = 'REJECTED';
        }
        for (var i = 0; i < this.conflicts_selected.length; i++) {
          if (i == 0) {
            this.currentNameObj.conflict1 = this.conflicts_selected[i].text;
            this.currentNameObj.conflict1_num = this.conflicts_selected[i].nrNumber;
          }
          if (i == 1) {
            this.currentNameObj.conflict2 = this.conflicts_selected[i].text;
            this.currentNameObj.conflict2_num = this.conflicts_selected[i].nrNumber;

          }
          if (i == 2) {
            this.currentNameObj.conflict3 = this.conflicts_selected[i].text;
            this.currentNameObj.conflict3_num = this.conflicts_selected[i].nrNumber;

          }
        }

        this.currentNameObj.decision_text = this.customer_message_display.substr(0,955);

        // add new comment
        this.$refs.decisioncomments.addNewComment();

        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject');
        this.decision_made = null;
        this.is_making_decision = false;
      },
      setConflictList() {
        let conflictList = [];
        let exactMatches = this.exactMatchesConflicts;
        let synonymMatches = this.synonymMatchesConflicts;
        let seenNRs = [];

        for (let i=0; i<exactMatches.length; i++) {
          seenNRs.push(exactMatches[i].nrNumber);
          conflictList.push(exactMatches[i])
        }
        for (let i=0; i<synonymMatches.length; i++) {
          if (synonymMatches[i].nrNumber != undefined && !seenNRs.includes(synonymMatches[i].nrNumber)) {
            seenNRs.push(synonymMatches[i].nrNumber);
            conflictList.push(synonymMatches[i])
          }
        }
        this.conflictList = conflictList;
      },
    },
  }



</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>

  .customer-msg-box {
    padding: 10px;
    border: 1px solid #bbb;
  }

  .customer-msg-box > p {
    margin-bottom: 10px;
  }

  #edit-customer-message-link,
  #clear-customer-message-link {
    font-size: 12px;
    float: right;
  }

  #clear-customer-message-link {
    margin-right: 20px;
  }

  .customer-msg-box pre {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    white-space: pre-line;
  }

</style>

<!-- unscoped styles -->
<style>

  .multiselect, .multiselect__input, .multiselect__single {
    font-size: 12px;
  }

  .multiselect__option {
    min-height: inherit;
    padding: 5px;
  }

  .character_count {
    float: left;
    padding: 5px;
  }
  .character_count.warning {
    background-color: #ffa;
  }


</style>
