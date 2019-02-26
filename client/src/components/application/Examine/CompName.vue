<!--eslint-disable-->
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col">

          <div id="top-buttons">

            <!-- GET NEXT button -->
            <button v-shortkey="['alt', 'n']" @shortkey="getNextCompany()" class="btn btn-sm btn-secondary" id="examine-get-next-button"
                    v-if="userIsAnExaminer && !is_making_decision && !is_my_current_nr"
                    @click="getNextCompany()" >Get <u>N</u>ext</button>

            <!-- CANCEL button -->
            <button class="btn btn-sm btn-danger" id="examine-cancel-button"
                    v-if="canCancel && !is_making_decision && !is_cancelled && !is_approved_expired && !is_consumed" data-toggle="modal" data-target="#add-cancel-comment-modal">
              Cancel Request</button>

            <!-- HOLD button -->
            <button v-shortkey="['alt', 'h']" @shortkey="holdRequest()" class="btn btn-sm btn-warning" id="examine-hold-button"
                    v-if="!is_making_decision && is_my_current_nr"
                    @click="holdRequest()"><u>H</u>old</button>

            <!-- DECISION button -->
            <button v-shortkey="['alt', 'd']" @shortkey="startDecision()" class="btn btn-sm btn-primary" id="examine-decide-button"
                    v-if="userIsAnExaminer && !is_making_decision && !is_complete && is_my_current_nr && !is_name_decision_made"
                    @click="startDecision()"><u>D</u>ecision</button>

            <!-- ACCEPT/REJECT/CANCEL DECISION buttons -->
            <button v-shortkey="['alt', 'a']" @shortkey="nameAccept()" class="btn btn-sm btn-primary" id="decision-approve-button"
                    v-if="userIsAnExaminer && is_making_decision" @click="nameAccept()">
              <span v-if="acceptance_will_be_conditional">Conditionally </span><u>A</u>pprove
            </button>
            <button v-shortkey="['alt', 'r']" @shortkey="nameReject()" class="btn btn-sm btn-danger" id="decision-reject-button"
                    v-if="is_making_decision" @click="nameReject()" ><u>R</u>eject
            </button>
            <button v-shortkey="['alt', 'c']" @shortkey="is_making_decision=false" class="btn btn-sm btn-secondary" id="decision-cancel-button"
                    v-if="is_making_decision" @click="is_making_decision=false">Ba<u>c</u>k
            </button>

            <!-- RE-OPEN (un-furnished) button -->
            <button class="btn btn-sm btn-danger" id="examine-re-open-button"
                    v-if="userCanEdit && is_complete && !is_furnished && !is_cancelled && !is_approved_expired" @click="reOpen()" >
              Re-Open</button>

            <!-- RESET (from furnished) button -->
            <button class="btn btn-sm btn-danger" id="examine-reset-button"
                    v-if="userCanEdit && is_complete && is_furnished && !is_cancelled && !is_approved_expired" @click="reset()">
              RESET</button>

            <!-- EXAMINE button - to claim/examine an NR that is on hold -->
            <button class="btn btn-sm btn-primary" id="examine-button" v-if="can_claim"
                    @click="claimNR()" >Examine</button>


          </div>

          <table>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==1,
                               accepted: compName1.state == 'APPROVED'}">
              <td>1.</td>
              <td id="name1">
                {{ compName1.name }}
                <span class="name-state-icon" v-html="setIcon(compName1.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_1"
                        v-on:click="undoDecision(1)">Undo Decision</button>
                <span class="decision-text"
                        v-bind:class="{'completed-decision-text': is_complete}">{{ decision_1 }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==2,
                               accepted: compName2.state == 'APPROVED'}">
              <td>2.</td>
              <td id="name2">
                {{ compName2.name }}
                <span class="name-state-icon" v-html="setIcon(compName2.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_2"
                        v-on:click="undoDecision(2)">Undo Decision</button>
                <span class="decision-text"
                        v-bind:class="{'completed-decision-text': is_complete}">{{ decision_2 }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==3,
                               accepted: compName3.state == 'APPROVED'}">
              <td>3.</td>
              <td id="name3" >
                {{ compName3.name }}
                <span class="name-state-icon" v-html="setIcon(compName3.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_3"
                        v-on:click="undoDecision(3)">Undo Decision</button>
                <span id="decision-text3" class="decision-text"
                      v-bind:class="{'completed-decision-text': is_complete}">{{ decision_3 }}</span>
              </td>
            </tr>
          </table>

          <div>

            <!-- QUICK APPROVE/REJECT BUTTONS -->
            <span class="float-right" style="margin-left: 10px;" v-if="userIsAnExaminer && !is_making_decision && !is_complete && is_my_current_nr && !is_name_decision_made">
              <button v-shortkey="['alt', 'a']" @shortkey="quickApprove()" class="btn btn-sm btn-outline-primary" id="examine-quick-approve-button"
                      @click="quickApprove">Quick <u>A</u>pprove</button>
              <button  v-shortkey="['alt', 'i']" @shortkey="rejectDistinctive()" class="btn btn-sm btn-outline-danger" id="examine-reject-distinctive-button"
                      @click="rejectDistinctive">Reject D<u>i</u>stinctive</button>
              <button v-shortkey="['alt', 'e']" @shortkey="rejectDescriptive()" class="btn btn-sm btn-outline-danger" id="examine-reject-descriptive-button"
                      @click="rejectDescriptive">Reject D<u>e</u>scriptive</button>
            </span>

            <!-- MANUAL SEARCH -->
            <div v-if="userCanEdit && !is_making_decision && !is_complete" id="manual-search">
              <form class="form-inline" @submit.prevent="onSubmit">
                <div class="manual-search-bar">
                  <input ref="search" type="text" class="search form-control" v-model="searchStr"  v-shortkey="['alt', 's']" @shortkey="setFocus()" tabindex="1">
                  <button class="btn-search" type="submit"><i class="fa fa-search" tabindex="8"/></button>
                  <button class="btn-reset" v-if="is_running_manual_search" @click="resetSearchStr" tabindex="7"><i class="fa fa-times" /></button>
                </div>
                <input ref="advanced-search" type="text" class="advanced-search form-control" placeholder="Exact Phrase" v-model="exactPhrase">
              </form>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- CANCEL COMMENT popup -->
    <div class="modal fade" id="add-cancel-comment-modal" tabindex="-1" role="dialog">
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


  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'CompName',
    data: function () {
      return {
        searchStr: '',
        exactPhrase: '',
        retval: [],
        is_running_manual_search: false,
        add_comment_display: "",
        cancel_comment_display: "",
        searching: false,
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
        if (this.$store.getters.furnished === "Y") return true;
        return false;
      },
      is_cancelled() {
        if (this.$store.getters.currentState === "CANCELLED") return true;
        return false;
      },
      is_approved_expired() {
        // if there is no expiry date, this NR is not approved-expired
        if (this.$store.getters.expiryDate == null) return false;

        let expired_date = new Date(this.$store.state.expiryDate);
        let today = new Date();
        console.log('***');
        console.log(this.$store.getters.currentState);
        console.log(expired_date);
        if (this.$store.getters.currentState === "APPROVED" && today > expired_date) return true;
        return false;
      },
      is_consumed() {
        if (this.consumptionDate != null) return true;
        else return false;
      },
      is_editing() {
        return  this.$store.getters.is_editing;
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
      compName1() {
        return this.$store.getters.compName1;
      },
      compName2() {
        return this.$store.getters.compName2;
      },
      compName3() {
        return this.$store.getters.compName3;
      },
      compName1State() {
        return this.$store.getters.compName1.state;
      },
      compName2State() {
        return this.$store.getters.compName2.state;
      },
      compName3State() {
        return this.$store.getters.compName3.state;
      },
       decision_1() {
        return this.decisionReasonOrConflictList(this.compName1);
      },
       decision_2() {
        return this.decisionReasonOrConflictList(this.compName2);
      },
       decision_3() {
        return this.decisionReasonOrConflictList(this.compName3);
      },
      currentNameObj: {
        get: function() {
          return this.$store.getters.currentNameObj;
        },
        set: function (value) {
          this.$store.commit('currentNameObj', value);
        }
      },
      currentName() {
        return this.$store.getters.currentName;
      },
      currentChoice: {
        get: function () {
          return this.$store.getters.currentChoice
        },
        set: function (value) {
          this.$store.commit('currentChoice', value);
        }
      },
      is_undoable_1() {
        // first test generic reasons why a name would or wouldn't be undoable
        var undoable = this.is_undoable(this.compName1);

        if (undoable) {
          // if name choices 2 and 3 have not been decided, then 1 is undoable
          if ((this.compName2.state == 'NE' || this.compName2.state == null) &&
              (this.compName3.state == 'NE' || this.compName3.state == null)) {
            undoable = true;
          }
          else undoable = false;
        }

        return undoable;
      },
      is_undoable_2() {
        // first test generic reasons why a name would or wouldn't be undoable
        var undoable = this.is_undoable(this.compName2);

        if (undoable) {
          // if name choice 3 has not been decided, then 2 is undoable
          if (this.compName3.state == 'NE' || this.compName3.state == null) {
            undoable = true;
          }
          else undoable = false;
        }

        return undoable;
      },
      is_undoable_3() {
        // first test generic reasons why a name would or wouldn't be undoable
        var undoable = this.is_undoable(this.compName3);

        return undoable;
      },
      listDecisionReasons() {
        return this.$store.getters.listDecisionReasons;
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
    mounted() {
      console.log('Compname Mounted')
      if(this.$store.getters.nrNumber == null){
        console.log('Mounted->get next NR number')
        this.$store.dispatch('getpostgrescompNo');
      }
      this.setFocus();

      // set manual search string based on current name - fixes bug related to leaving
      // and coming back to same NR
      this.searching = true;
      this.setManualSearchStr(this.currentName);
    },
    methods: {
      /**
       * decisionReasonOrConflictList:  gets the decision reason(s) whether or not there's anything in the decision text field.
       * In some older NRs, there is no decision reason text.  In these cases we want to display the list of conflicts instead.
       */
       decisionReasonOrConflictList: function (compname) {

          if (!compname) {
              return;
          }

          if (this.is_complete) {

              if (compname.decision_text) {
                return compname.decision_text;
              } else {
                return this.getConflictList(compname);
              }
          } else {
              return compname.decision_text
          }
      },
      getConflictList(compname) {
          if (!compname.conflict1) {
              return;
          }

          let reasons = `Rejected due to conflicts:\n${compname.conflict1}`;
          if (compname.conflict2) {
              reasons += ", " + compname.conflict2;
          }
          if (compname.conflict3) {
              reasons += ", " + compname.conflict3;
          }

          return reasons;
      },
      getNextCompany() {
        this.$store.dispatch('resetValues');
        this.searching = true;
        this.$store.dispatch('getpostgrescompNo');
      },
      startDecision() {
        this.$store.state.is_making_decision = true;
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
      runManualRecipe(){
        console.log("Running manual recipe on " + this.searchStr + '/' + this.exactPhrase);
        console.log('HERE2: ', this.exactPhrase)
        this.$store.dispatch('runManualRecipe', {searchStr:this.searchStr, exactPhrase:this.exactPhrase});
      },
      setIcon(name_state) {
        if (name_state == 'REJECTED') {
          return '<i class="fa fa-times icon-rejected"></i>';
        }
        else if (name_state == 'APPROVED' || name_state == 'CONDITION') {
          return '<i class="fa fa-check icon-accepted"></i>';
        }
        else return '';
      },
      undoDecision(name_number) {
        console.log(name_number);
        this.$store.dispatch('undoDecision', name_number);

        // set the undone name choice to the current (actionable) choice
        if (name_number == 1) this.currentNameObj = this.compName1;
        if (name_number == 2) this.currentNameObj = this.compName2;
        if (name_number == 3) this.currentNameObj = this.compName3;

      },
      is_undoable(name) {

        // if the NR is closed in any way, a name is not undoable - the NR will have to be
        // re-opened first.

        if (!this.userIsAnExaminer) return false;

        if (!this.is_my_current_nr) return false;

        // if the NR is furnished, nothing is undoable
        if (this.$store.state.furnished === 'Y')  return false;

        // if this name is complete (ie: anything other than NE) it's undoable
        if (name.state == 'NE' || name.state == null) return false;

        return true;
      },
      quickApprove() {
        this.currentNameObj.decision_text = ''
        console.log('quickApprove')

        this.decision_made = 'APPROVED'
        this.nameAcceptReject()
      },
      rejectDescriptive() {

        this.currentNameObj.decision_text = 'Require descriptive second word or phrase * E.G. ' +
          'Construction, Gardening, Investments, Holdings, Etc.'
        this.decision_made = 'REJECTED'
        this.nameAcceptReject()
      },
      rejectDistinctive() {
        // When this was written, the 16th index of listDecisionReasons was the string needed for a distinctive term missing
        // it was decided to HARD CODE this value until another solution is found
        // var distinctiveStr = this.listDecisionReasons[16].reason
        this.currentNameObj.decision_text = "Require distinctive, nondescriptive first word or " +
          "prefix * E.G. Person's name, initials, geographic location, etc."
        this.decision_made = 'REJECTED'
        this.nameAcceptReject()
      },
      onSubmit()
      {
        this.$store.dispatch('resetValues');
        console.log('HERE1: ', this.exactPhrase)
        this.$store.dispatch('runManualRecipe', {searchStr:this.searchStr, exactPhrase:this.exactPhrase});

        if (this.searchStr != this.currentName) this.is_running_manual_search = true;
      },
      resetSearchStr(){
        this.searching = true;
        this.setManualSearchStr(this.currentName);
        this.exactPhrase = '';
        this.is_running_manual_search = false;
      },
      nameAcceptReject() {

        // save decision
        console.log('nameAcceptReject decision_made:' + this.decision_made)
        if (this.decision_made == 'APPROVED') {
          this.currentNameObj.state = 'APPROVED';
        }
        else {
          this.currentNameObj.state = 'REJECTED';
        }

        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject');
        this.decision_made = null;
        this.is_making_decision = false;
      },
      setFocus: function() {
        if(this.$refs.search) {
          this.$refs.search.focus();
        }
      },
      setManualSearchStr(val) {
        console.log('setManualSearchStr() called with ' + val);
        this.searchStr =  val;
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
      currentName: function (val) {
        console.log('CompName.currentName watcher fired:' + val)
        this.searching = true;
        this.setManualSearchStr(val);
      },
      nrNumber: function (val) {
        console.log('CompName.nrNumber watcher fired:' + val)
        if(val != null){ this.runManualRecipe()}
      },
      searchStr: function (val) {
        console.log('searchStr watcher fired: ' + val)
        if (this.searching) {
          this.runManualRecipe();
          this.searching = false;
        }
      }
    }
  }
</script>


<style scoped>
  .name-sect {
  }
  .name-option {
    font-size:1.3em;
    text-align: left;
  }
  .active-name-option{
    font-weight: bold;
  }

  #top-buttons {
    float: right;
    margin: 10px 0 10px 10px;
  }
  #top-buttons button {
    float: right;
    margin-left: 5px;
  }

  .name-option > td {
    vertical-align: top;
  }
  .name-option.accepted {
    color: #007bff;
    font-size: 20px;
  }
  .decision-text {
    font-size: 11px;
    width: 600px;
    position: relative;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .completed-decision-text {
    font-size: 15px;
    white-space: pre-wrap;
  }

  .manual-search-bar {
    width: 70%;
    margin-right: 5px;
  }

  .search {
    width: 99%;
    max-width: 700px;
    min-width: 200px;
    font-size: 16px;
  }

  .advanced-search {
    font-size: 16px;
    width: 20%;
    min-width: 50px;
    max-width: 300px;
  }

  #manual-search {
    width: 100%;
    max-width: 1030px;
  }

  #manual-search button {
    width: 0.5%;
    min-width: 20px;
    max-width: 20px;
    border: none;
    background-color: transparent;
    padding: 0;
    color: #666;
    margin-top: -1px;
  }

  .btn-search {
    margin-left: -25px;
  }

  .btn-search .fa-search {
    font-size: 14px;
  }

  .btn-reset {
    margin-left: -40px;
}
</style>

<!-- not scoped -->
<style>
  .name-state-icon .icon-rejected {
    color: #c00;
  }
  .name-state-icon .icon-accepted {
    color: #007bff;
    font-size: 20px;
  }

  .btn-undo {
    padding: 2px 5px;
    font-size: 11px;
  }
</style>
