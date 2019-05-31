<!--eslint-disable-->
<template>
  <fragment>
    <v-flex shrink pr-4 v-show="!is_editing" align-self-center>
      <!-- Edit Request button -->
      <v-btn class="mx-1 pa-0 action-button"
             flat
             id="nr-details-edit-button"
             v-if="can_edit"
             @click="edit"><img src="/static/images/buttons/edit-req.png" /></v-btn>
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
             v-if="userIsAnExaminer && !is_making_decision && !is_my_current_nr"
             @click="getNextCompany()"><img src="/static/images/buttons/get-next.png" /></v-btn>

      <!-- CANCEL button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-cancel-button"
             v-if="canCancel && !is_making_decision && !is_cancelled && !is_approved_expired && !is_consumed"
             data-target="#add-cancel-comment-modal"
             data-toggle="modal"><img src="/static/images/buttons/cancel-req.png"/></v-btn>

      <!-- HOLD button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             v-shortkey="['alt', 'h']"
             @shortkey="holdRequest()"
             id="examine-hold-button"
             v-if="!is_making_decision && is_my_current_nr"
             @click="holdRequest()"><img src="/static/images/buttons/hold-req.png"/></v-btn>

      <!-- DECISION button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             v-shortkey="['alt', 'd']"
             @shortkey="startDecision()"
             id="examine-decide-button"
             v-if="userIsAnExaminer && !is_making_decision && !is_complete && is_my_current_nr && !is_name_decision_made"
             @click="startDecision()"><img src="/static/images/buttons/decision.png"/></v-btn>

      <!-- ACCEPT/REJECT/CANCEL DECISION buttons -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             v-shortkey="['alt', 'a']"
             @shortkey="nameAccept()"
             id="decision-approve-button"
             v-if="userIsAnExaminer && is_making_decision"
             @click="nameAccept()">
        <img v-if="acceptance_will_be_conditional" src="/static/images/buttons/dec-cond-approve.png"/>
        <img v-else src="/static/images/buttons/dec-approve.png"/>
      </v-btn>
      <v-btn flat
             v-shortkey="['alt', 'r']"
             @shortkey="nameReject()"
             class="mx-1 pa-0 action-button"
             id="decision-reject-button"
             v-if="is_making_decision"
             @click="nameReject()"><img src="/static/images/buttons/dec-reject.png"/></v-btn>
      <v-btn flat
             v-shortkey="['alt', 'c']"
             @shortkey="is_making_decision=false"
             class="ma-0 pa-0 action-button"
             id="decision-cancel-button"
             v-if="is_making_decision"
             @click="is_making_decision=false"><img src="/static/images/buttons/dec-back.png"/></v-btn>

      <!-- RE-OPEN (un-furnished) button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-re-open-button"
             v-if="userCanEdit && is_complete && !is_furnished && !is_cancelled && !is_approved_expired"
             @click="reOpen()"><img src="/static/images/buttons/reopen-req.png"/></v-btn>

      <!-- RESET (from furnished) button -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-reset-button"
             v-if="userCanEdit && is_complete && is_furnished && !is_cancelled && !is_approved_expired"
             @click="reset()"><img src="/static/images/buttons/reset-req.png"/></v-btn>

      <!-- EXAMINE button - to claim/examine an NR that is on hold -->
      <v-btn flat
             class="mx-1 pa-0 action-button"
             id="examine-button"
             v-if="can_claim"
             @click="claimNR()"><img src="/static/images/buttons/examine.png"/></v-btn>
    </v-flex>
    <div class="modal fade"
         id="add-cancel-comment-modal"
         role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Please give a comment to explain why this NR is being CANCELLED</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
              <textarea id="cancel-comment-text" class="form-control" rows="10"
                        v-model="cancel_comment_display"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-secondary"
                    data-dismiss="modal" @click="cancelNrCancel">Cancel</button>
            <button type="button" id="cancel-nr-after-comment-button" class="btn btn-sm btn-danger" disabled="true"
                    data-dismiss="modal" @click="cancelNr">CANCEL REQUEST</button>
          </div>
        </div>
      </div>
    </div>

  </fragment>
</template>

<script>
/* eslint-disable */
import moment from 'moment'

export default {
  name: 'ActionButtons',
  props: ['can_edit', 'edit', 'is_viewing', 'toggleDetails'],
  data: function () {
    return {
      add_comment_display: '',
      cancel_comment_display: '',
    }
  },
  computed: {
    decision_made: {
      get: function () {
        return this.$store.getters.decision_made;
      },
      set: function (value) {
        this.$store.commit('decision_made', value);
      }
    },
    currentState() {
      return this.$store.getters.currentState;
    },
    userId() {
      return this.$store.getters.userId;
    },
    userIsAnExaminer() {
      return this.$store.getters.userHasApproverRole;
    },
    userCanEdit() {
      return this.$store.getters.userHasEditRole;
    },
    canCancel() {
      return this.userCanEdit;
    },
    is_my_current_nr() {
      return this.$store.getters.is_my_current_nr;
    },
    is_complete() {
      return this.$store.getters.is_complete;
    },
    is_furnished() {
      if (this.$store.getters.furnished === 'Y') return true;
      return false;
    },
    is_cancelled() {
      if (this.$store.getters.currentState === 'CANCELLED') return true;
      return false;
    },
    is_approved_expired() {
      // if there is no expiry date, this NR is not approved-expired
      if (this.$store.getters.expiryDate == null) return false;

      let expired_date = moment(this.$store.state.expiryDate, 'YYYY-MM-DD').clone();
      let today = new moment();
      console.log('***');
      console.log(this.$store.getters.currentState);
      console.log(expired_date);
      if (this.$store.getters.currentState === 'APPROVED' && today.isAfter(expired_date)) return true;
      return false;
    },
    is_consumed() {
      if (this.consumptionDate != null) return true;
      else return false;
    },
    is_editing() {
      return  this.$store.state.is_editing;
    },
    is_making_decision: {
      get: function() {
        return this.$store.getters.is_making_decision;
      },
      set: function(value) {
        this.$store.commit('is_making_decision', value);
      }
    },
    is_name_decision_made() {
      // is a decision already made for the current name? Happens right after reset/re-open.
      if (this.currentNameObj.state !== 'NE') return true;
      else return false;
    },
    acceptance_will_be_conditional() {
      return this.$store.getters.acceptance_will_be_conditional;
    },
    can_claim() {
      console.log('got to can_claim with status ' + this.currentState);
      // can this user claim the NR? Based on state.
      if (this.userIsAnExaminer && ['DRAFT', 'HOLD'].indexOf(this.currentState) > -1) return true;
      else return false;
    },
    currentNameObj: {
      get: function() {
        return this.$store.getters.currentNameObj;
      },
      set: function (value) {
        this.$store.commit('currentNameObj', value);
      }
    },
    internalComments: {
      get: function() {
        return this.$store.getters.internalComments;
      },
      set: function(value) {
        this.$store.commit('internalComments', value);
      }
    },
    consumptionDate() {
      return this.$store.getters.consumptionDate;
    },
  },
  methods: {
   getNextCompany() {
      this.$store.dispatch('resetValues');
      this.$store.dispatch('getpostgrescompNo');
    },
    startDecision() {
      this.is_making_decision = true
    },
    nameAccept() {
      this.$store.commit('decision_made', 'APPROVED');
      this.$store.commit('currentCondition', null);
    },
    nameReject() {
      this.$store.commit('decision_made', 'REJECTED');
      this.$store.commit('currentCondition', null);
    },
    reOpen() {
      /* Workflow:
       If EXAMINER:
       - move to INPROGRESS
       If EDITOR (ADMIN):
       - move to INPROGRESS with edit screen open
       - upon save/cancel, move to DRAFT
       */
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

      this.$store.commit('furnished', 'N');

      // update request in database and NRO
      this.$store.dispatch('updateRequest');
    },
    claimNR() {
      this.$store.dispatch('updateNRState', 'INPROGRESS');
    },
    holdRequest() {
      this.$store.dispatch('updateNRState', 'HOLD');
    },
    setFocus: function() {
      if(this.$refs.search) {
        this.$refs.search.focus();
      }
    },
    addNewComment(value) {
      // create new comment object with just text, and add it to list of comments in data structure
      var newCommentData = {
        comment: value,
        examiner: this.$store.state.examiner
      };
      this.internalComments = this.internalComments.concat(newCommentData);
    },
    cancelNr() {
      this.addNewComment(this.cancel_comment_display);
      this.$store.dispatch('cancelNr', 'CANCELLED');
    },
    cancelNrCancel() {
      this.cancel_comment_display = "";
      $("#cancel-comment-text").prop('disabled', false); // TODO need this?
    },
  },
  watch: {
    cancel_comment_display: function(val) {
      console.log('cancel_comment_display watcher fired:' + val)
      if (val)
        $("#cancel-nr-after-comment-button").prop('disabled', false);
      else
        $("#cancel-nr-after-comment-button").prop('disabled', true);
    },
  }
}
</script>


<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
