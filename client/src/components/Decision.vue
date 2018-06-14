/* eslint-disable */
<template>
  <span>

    <div class="row">
      <div class="col add-top-padding">
        <h3>Consent Required</h3>
        <select multiple class="form-control" v-model="consent_selected"
                :disabled="customer_message_override">
          <option v-for="message in consent_bodies" :value="message.full_message"
                  :key="message.message">
            {{ message.full_message }}
          </option>
        </select>
      </div>
      <div class="col add-top-padding">
        <h3>Conflicts</h3>
        <select multiple class="form-control" v-model="conflicts_selected"
                :disabled="customer_message_override">
          <option v-for="conflict in conflictList" :value="conflict.text"
                  :key="conflict.nrNumber + conflict.text">
            {{ conflict.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="col add-top-padding">
        <h3>Generic Rejection Reason (label TBD)</h3>
        <select multiple class="form-control" v-model="decision_reasons_selected"
                :disabled="customer_message_override">
          <option v-for="reason in listDecisionReasons" :value="reason.reason"
                  :key="reason.name">{{ reason.name }}</option>
        </select>
      </div>
      <div class="col">
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

  import internalcomments from "@/components/dropdown/Search/InternalComments.vue";

  export default {
    name: "Decision",
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
      conflictList() {
        return this.$store.getters.conflictList;
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
      format_selection() {

      },
      customer_message() {
        /*
        Build customer message based on selected consent, conflicts, trademarks, and format.
         */

        var retval = [];

        // CONFLICTS
        for (var i = 0; i < this.conflicts_selected.length; i++) {
          retval.push('Rejected due to conflict with ' + this.conflicts_selected[i]);
        }

        // CONSENT
        for (var i = 0; i < this.consent_selected.length; i++) {
          retval.push('Consent Required: ' + this.consent_selected[i]);
        }

        // TRADEMARKS
        // TODO

        // GENERIC DECISION REASONS
        for (var i = 0; i < this.decision_reasons_selected.length; i++) {
          retval.push(this.decision_reasons_selected[i]);
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
      addInternalComment() {
        // function not needed but I might need to remember this syntax for calling component method
        //this.$refs.decisioncomments.addNewComment();
      },
    }
  }



</script>

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
  }
</style>
