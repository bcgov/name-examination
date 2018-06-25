/* eslint-disable */
<template>
  <span>

    <div class="row">
      <div class="col-6 add-top-padding">
        <h3>Consent Required</h3>
        <div>
        <multiselect
          v-model="consent_selected"
          :options="consent_bodies"
          :multiple="true"
          label="full_message"
          name="message"
          track-by="full_message"
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
      </div>
    </div>

    <div class="row">
      <div class="col add-top-padding">
        <h3>Message to Requestor</h3>
        <div class="customer-msg-box">
          <pre>{{ customer_message_display }}</pre>
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
        consent_selected: [],
        conflicts_selected: [],
        decision_reasons_selected: [],
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

          // Somewhere, nrNumber is being replaced with value. So switch it back to nrNumber so
          // objects match and can be found in conflictList.
          conflict.nrNumber = conflict.value;
          delete conflict.value;

          // augment conflict with a display string for dropdown
          conflict.display_string = conflict.text + ' - ' + conflict.nrNumber;
          return conflict;
        }
        else return null;
      },
      currentNameObj: {
        get: function () {
          return this.$store.getters.currentNameObj;
        },
        set: function (value) {
          this.$store.dispatch('currentNameObj', value);
        }
      },
      listDecisionReasons() {
        return this.$store.getters.listDecisionReasons;
      },
      consent() {
        return this.$store.getters.consent;
      },
      consent_bodies() {
        // get list of consent bodies for all words in consent list
        console.log('got into consent_bodies()');

        var retval = [];

        for (var i = 0; i < this.consent.length; i++) {
          try {
            var word = this.consent[i].word;
            var word_code = getValueFromText(this.$store.getters.listRestrictedWords, word.toUpperCase());
            try {
              var messages = this.$store.getters.listRestrictedWordsReasons.filter(findArrValue(word_code));

              for (var j = 0; j < messages.length; j++) {
                construct_retval(word, messages[j].text);
              }

            } catch (err) {
              construct_retval(word, '<Could not find word or reason in list of restricted words>');
            }
          } catch (err) {
            construct_retval(word, '<Could not find word or reason in list of restricted words>');
          }
        }

        return retval;

        // helper function to cut down on duplicate code
        function construct_retval(word, message) {
          retval.push({
            word: word,
            message: message,
            full_message: word + ' - ' + message,
          })
        }

      },
      customer_message() {
        /*
        Build customer message based on selected consent, conflicts, trademarks, and format.
         */

        var retval = [];

        // CONFLICTS
        for (var i = 0; i < this.conflicts_selected.length; i++) {
          retval.push('Rejected due to conflict with ' + this.conflicts_selected[i].text);
        }

        // CONSENT
        for (var i = 0; i < this.consent_selected.length; i++) {
          retval.push('Consent Required: ' + this.consent_selected[i].full_message);
        }

        // TRADEMARKS
        // TODO

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

      // pre-select the consent/condition from the display screen TODO

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
        this.currentNameObj.decision_text = this.customer_message_display;
        if (this.decision_made == 'A') {
          if (this.consent_selected.length > 0) this.currentNameObj.state = 'CA'; // conditionally accepted
          else this.currentNameObj.state = 'A'; // accepted
        }
        else {
          this.currentNameObj.state = 'R';
        }
        for (var i = 0; i < this.conflicts_selected.length; i++) {
          if (i == 0) this.currentNameObj.conflict1 = this.conflicts_selected[i].text;
          if (i == 1) this.currentNameObj.conflict2 = this.conflicts_selected[i].text;
          if (i == 2) this.currentNameObj.conflict3 = this.conflicts_selected[i].text;
        }

        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject');
        this.decision_made = null;
        this.is_making_decision = false;
      },
    }
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


</style>
