<template>
  <v-layout justify-end>
    <v-flex shrink pr-4 v-show="!is_editing" align-self-center>
      <!-- Edit Request button -->
      <v-btn class="mx-1 pa-0 action-button"
             flat
             v-shortkey="['alt', 'd']"
             @shortkey="edit"
             id="nr-details-edit-button"
             v-if="can_edit && showButtons"
             @click="edit"><img src="/static/images/buttons/edit-req.png" /></v-btn>

      <!--SHOW DETAILS-->
      <v-btn flat
             v-shortkey="['alt', 'b']"
             @shortkey="toggleDetails()"
             class="mx-1 pa-0 action-button"
             id="nr-details-show-hide-details-button"
             @click="toggleDetails">
        <img v-if="is_viewing"
             id="hide-details-graphic"
             src="/static/images/buttons/hide-details.png"/>
        <img v-else
             id="show-details-graphic"
             src="/static/images/buttons/show-details.png"/>
      </v-btn>

      <!--GET NEXT button-->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             v-shortkey="['alt', 'n']"
             @shortkey="getNextCompany()"
             id="examine-get-next-button"
             v-if="userIsAnExaminer && !is_my_current_nr"
             @click="getNextCompany()"><img src="/static/images/buttons/get-next.png" /></v-btn>

      <!-- CANCEL button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-cancel-button"
             v-if="canCancel && !is_making_decision && !is_cancelled && !is_approved_expired && showButtons"
             @click="showCancelModal()"><img src="/static/images/buttons/cancel-req.png"/></v-btn>

      <!--HOLD REQUEST-->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             v-shortkey="['alt', 'h']"
             @shortkey="holdRequest()"
             id="examine-hold-button"
             v-if="is_my_current_nr"
             @click="holdRequest()"><img src="/static/images/buttons/hold-req.png"/></v-btn>

      <!-- RE-OPEN (un-furnished) button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-re-open-button"
             v-if="userCanEdit && is_complete && !is_furnished && !is_cancelled && !is_approved_expired && showButtons"
             @click="reOpen()"><img src="/static/images/buttons/reopen-req.png"/></v-btn>

      <!-- RESET (from furnished) button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-reset-button"
             v-if="userCanEdit && is_complete && is_furnished && !is_cancelled && !is_approved_expired && showButtons"
             @click="reset()"><img src="/static/images/buttons/reset-req.png"/></v-btn>

      <!-- EXAMINE button - to claim/examine an NR that is on hold -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-button"
             v-shortkey="['alt', 'x']"
             @shortkey="claimNR()"
             v-if="can_claim && showButtons"
             @click="claimNR()"><img src="/static/images/buttons/examine.png"/></v-btn>
    </v-flex>

    <!--CANCELATION COMMENTS MODAL-->

    <v-dialog v-model="showCancelCommentsModal" persistent width="60%" hide-overlay>
      <v-card>
        <v-card-title class="fw-700 fs-18 mb-0 pb-0">
          Cancel Name Request
        </v-card-title>
        <v-card-text>
          <span class="fs-15 my-2">Please provide comments to explain why the NR is being cancelled</span>
          <v-textarea id="cancel-comment-text"
                      flat
                      class="cancel-text-area"
                      :rows="10"
                      v-model="cancel_comment_display"></v-textarea></v-card-text>
        <div style="display: flex; justify-content: flex-end;">
          <div>
            <v-btn flat
                   class="c-link"
                   @click="hideCancelModal()">Cancel</v-btn>
          </div>
          <div>
            <v-btn flat
                   class="c-priority"
                   :disabled="cancelSubmitDisabled"
                   @click="cancelNr">Submit Cancellation
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
import { isFutureDate } from "../../../../static/js/validators"

export default {
  name: 'ActionButtons',
  props: ['can_edit', 'edit', 'is_viewing', 'toggleDetails'],
  data() {
    return {
      add_comment_display: '',
      cancel_comment_display: '',
      showCancelCommentsModal: false,
    }
  },
  mounted() {
    //to clear the modal when it closes (using listener to catch all ways the modal is closed eg. built in 'x')

  },
  computed: {
    acceptanceWillBeConditional() {
      return this.$store.getters.acceptanceWillBeConditional;
    },
    can_claim() {
      // can this user claim the NR? Based on state.
      if (this.userIsAnExaminer && ['DRAFT', 'HOLD'].indexOf(this.currentState) > -1) return true;
      else return false;
    },
    canCancel() {
      return this.userCanEdit && !this.other_examiner_inprogress && this.showButtons && !this.expired
    },
    cancelSubmitDisabled() {
      if (this.cancel_comment_display) {
        return this.cancel_comment_display.length === 0
      }
      return true
    },
    consumptionDate() {
      return this.$store.getters.consumptionDate;
    },
    currentNameObj: {
      get: function() {
        return this.$store.getters.currentNameObj;
      },
      set: function (value) {
        this.$store.commit('currentNameObj', value);
      }
    },
    currentState() {
      return this.$store.getters.currentState;
    },
    decision_made: {
      get: function () {
        return this.$store.getters.decision_made;
      },
      set: function (value) {
        this.$store.commit('decision_made', value)
      }
    },
    expired() {
      if (!this.$store.getters.expiryDate) return false
      let expDate = moment(this.$store.state.expiryDate, 'YYYY-MM-DD').clone()
      let today = new moment()
      return today.isAfter(expDate)
    },
    internalComments: {
      get: function() {
        return this.$store.getters.internalComments;
      },
      set: function(value) {
        this.$store.commit('internalComments', value)
      }
    },
    is_approved_expired() {
      // return true if NR is approved and expired

      // if there is no expiry date, this NR is not approved-expired
      if (this.$store.getters.expiryDate == null) return false;

      // NR will move to 'EXPIRED' state once expiry date is reached for 'APPROVED', 'CONDITIONAL' state.
      // If currentState is 'EXPIRED', then it was approved and expired.
      if (this.$store.getters.currentState === 'EXPIRED') return true

      return false
    },
    is_cancelled() {
      if (this.$store.getters.currentState === 'CANCELLED') return true;
      return false;
    },
    is_complete() {
      return this.$store.getters.is_complete;
    },
    showButtons() {
      if (this.consumptionDate) return false
      if (['HISTORICAL', 'COND-RESERVE', 'RESERVED'].includes(this.$store.getters.nr_status)) return false
      return true
    },
    is_editing() {
      return  this.$store.state.is_editing;
    },
    is_furnished() {
      if (this.$store.getters.furnished === 'Y') return true;
      return false;
    },
    is_making_decision: {
      get: function() {
        return this.$store.getters.is_making_decision;
      },
      set: function(value) {
        this.$store.commit('is_making_decision', value);
      }
    },
    is_my_current_nr() {
      return this.$store.getters.is_my_current_nr;
    },
    other_examiner_inprogress() {
      return this.userId !== this.$store.getters.examiner && this.$store.getters.nr_status === 'INPROGRESS'
    },
    is_name_decision_made() {
      // is a decision already made for the current name? Happens right after reset/re-open.
      if (this.currentNameObj.state !== 'NE') return true
      return false
    },
    userCanEdit() {
      return this.$store.getters.userHasEditRole && this.showButtons
    },
    userId() {
      return this.$store.getters.userId;
    },
    userIsAnExaminer() {
      return this.$store.getters.userHasApproverRole;
    },
  },
  methods: {
    addNewComment(value) {
      // create new comment object with just text, and add it to list of comments in data structure
      var newCommentData = {
        comment: value,
        examiner: this.$store.state.examiner
      };
      this.internalComments = this.internalComments.concat(newCommentData)
    },
    cancelNr() {
      this.addNewComment(this.cancel_comment_display)
      this.$store.dispatch('cancelNr', 'CANCELLED')
      this.hideCancelModal()
    },
    claimNR() {
      this.$store.dispatch('updateNRState', 'INPROGRESS');
      this.startDecision()
      this.$root.$emit('initializeconflicts')
    },
    getNextCompany() {
      this.$store.commit('toggleWordClassificationModal', false)
      this.$store.dispatch('resetValues');
      this.$store.dispatch('getpostgrescompNo');
      this.$store.dispatch('resetConflictList')
    },
    holdRequest() {
      this.is_making_decision = false
      this.$store.dispatch('updateNRState', 'HOLD');
      this.$store.dispatch('resetConflictList')
    },
    reOpen() {
      /* Workflow:
       If EXAMINER:
       - move to INPROGRESS
       If EDITOR (ADMIN):
       - move to INPROGRESS with edit screen open
       - upon save/cancel, move to DRAFT
       */
      this.$store.dispatch('resetConflictList')
      this.$store.commit('setSelectedConditions', [])
      this.$store.commit('setSelectedConflicts', [])
      this.$store.commit('setSelectedTrademarks', [])
      this.$root.$emit('initializeconflicts')
      if (this.userIsAnExaminer) {
        this.$store.commit('currentState', 'INPROGRESS');
      }
      else {
        this.$store.commit('currentState', 'INPROGRESS');

        // initialize user in edit mode, with previous state set so NR gets set back to draft
        //  when user is done changing name, adding comment, etc.
        this.$store.state.previousStateCd = 'DRAFT';
        this.$store.state.is_editing = true;
      }

      // set reset flag so name data is managed between Namex and NRO correctly
      this.$store.commit('hasBeenReset', true);

      // update request in database
      this.$store.dispatch('updateRequest');
    },
    reset() {
      /* Workflow:
       If EXAMINER:
       - move to INPROGRESS
       If EDITOR (ADMIN):
       - move to INPROGRESS with edit screen open
       - upon save/cancel, move to DRAFT
       */
      this.$store.dispatch('resetConflictList')
      this.$store.commit('setSelectedConditions', [])
      this.$store.commit('setSelectedConflicts', [])
      this.$store.commit('setSelectedTrademarks', [])
      this.$root.$emit('initializeconflicts')
      if (this.userIsAnExaminer) {
        this.$store.commit('currentState', 'INPROGRESS');
      }
      else {
        this.$store.commit('currentState', 'INPROGRESS');

        // initialize user in edit mode, with previous state set so NR gets set back to draft
        //  when user is done changing name, adding comment, etc.
        this.$store.state.previousStateCd = 'DRAFT';
        this.$store.state.is_editing = true;
      }
      this.$store.state.nrData.consent_dt = null
      this.$store.commit('resetConsent')

      this.$store.commit('furnished', 'N');

      // update request in database and NRO
      this.$store.dispatch('updateRequest');
    },
    setFocus: function() {
      if(this.$refs.search) {
        this.$refs.search.focus();
      }
    },
    startDecision() {
      this.$store.commit('setSelectedConflictID', null)
      this.$store.commit('setExpandedConflictID', null)
      this.is_making_decision = true
    },
    showCancelModal() {
      this.showCancelCommentsModal = true
    },
    hideCancelModal() {
      this.showCancelCommentsModal = false
      this.cancel_comment_display = ''
    }
  },
}
</script>

<style scoped>
  .cancel-text-area {
    margin-top: 10px;
    padding-top: 0px;
    padding-left: 8px;
    padding-right: 8px;
    background-color: white;
    border: 1px solid var(--l-grey);
  }
</style>
