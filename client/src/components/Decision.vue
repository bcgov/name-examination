/* eslint-disable */
<template>
  <span>

    <div class="row">
      <div class="col-6 add-top-padding">
        <h3>Conditions</h3>
        <div>
        <multiselect
          v-model="conditions_selected"
          :options="conditions"
          :multiple="true"
          label="display_string"
          name="phrase"
          track-by="display_string"
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
          label="display_string"
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
          label="name"
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

  const myMixin = {
    created(){
      console.log("It works!")
    }
  }

  export default {
    name: "Decision",
    mixins: [myMixin],
    data: function ()
    {
      return {
        conditions_selected: [],
        conflicts_selected: [],
        decision_reasons_selected: [],
        trademarks_selected: [],
        customer_message_override: null,
      }
    },
    computed: {
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
      conflictList() {
        // augment conflict list with a display string for dropdown
        var conflict_list = this.$store.getters.conflictList;
        $.each(conflict_list, function()
        {
          this.display_string = this.text + ' - ' + this.nrNumber;
        });
        return conflict_list;
      },
      currentConflict() {
        if (this.$store.getters.currentConflict !== null) {
          var conflict = Object.assign({}, this.$store.getters.currentConflict); // copy not reference
          console.log(this.$store.getters.currentConflict);

          // augment conflict with a display string for dropdown
          conflict.display_string = conflict.text + ' - ' + conflict.nrNumber;
          return conflict;
        }
        else return null;
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
               revised_match_object.consenting_body = condition.consenting_body;
               revised_match_object.instructions = condition.instructions;
               revised_match_object.text = condition.text;

               // display string for dropdown
               revised_match_object.display_string = revised_match_object.phrase + ' - '
                 + revised_match_object.text + ' ' + revised_match_object.consenting_body;

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
      customer_message() {
        /*
        Build customer message based on selected conditions, conflicts, trademarks, and format.
         */

        var retval = [];

        // CONFLICTS
        for (var i = 0; i < this.conflicts_selected.length; i++) {
          retval.push('Rejected due to conflict with ' + this.conflicts_selected[i].text);
        }

        // CONDITIONS
        for (var i = 0; i < this.conditions_selected.length; i++) {
          retval.push(this.conditions_selected[i].display_string + '\n\n' + this.conditions_selected[i].instructions);
        }

        // TRADEMARKS
        for (var i = 0; i < this.trademarks_selected.length; i++) {
          retval.push('Trademark: ' + this.trademarks_selected[i].name + '\n'
            + 'Require a letter of consent from trademark holder or franchisor.  Please email to consent.letters@gov.bc.ca');
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
      }
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

      // pre-select the condition from the display screen TODO


      // pre-select the trademark from the display screen TODO

    },
    watch: {
      decision_made: function() {
        console.log('got to decision_made watcher, with value ' + this.decision_made);
        this.nameAcceptReject();
      },
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
      nameAcceptReject() {

        // save decision text, state, and up to three conflicts
        this.currentNameObj.decision_text = this.customer_message_display.substr(0,955);
        if (this.decision_made == 'A') {
          if (this.conditions_selected.length > 0) this.currentNameObj.state = 'C'; // conditionally accepted
          else this.currentNameObj.state = 'A'; // accepted
        }
        else {
          this.currentNameObj.state = 'R';
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

        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject');
        this.decision_made = null;
        this.is_making_decision = false;
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
