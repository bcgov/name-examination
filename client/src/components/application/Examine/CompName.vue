<!--eslint-disable-->
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col">

          <div id="top-buttons">
            <button v-shortkey="['alt', 'n']" @shortkey="getNextCompany()" class="btn btn-sm btn-secondary" id="examine-get-next-button"
                    v-if="!is_making_decision && !is_my_current_nr"
                    @click="getNextCompany()" >Get <u>N</u>ext</button>
            <button v-shortkey="['alt', 'h']" @shortkey="holdRequest()" class="btn btn-sm btn-warning" id="examine-hold-button"
                    v-if="!is_making_decision && is_my_current_nr"
                    @click="holdRequest()"><u>H</u>old</button>
            <button v-shortkey="['alt', 'd']" @shortkey="startDecision()" class="btn btn-sm btn-primary" id="examine-decide-button"
                    v-if="!is_making_decision && !is_complete && is_my_current_nr"
                    @click="startDecision()"><u>D</u>ecision</button>
            <button class="btn btn-sm btn-primary" id="decision-approve-button"
                    v-if="is_making_decision" @click="nameAccept()">
              <span v-if="acceptance_will_be_conditional">Conditionally </span>Approve
            </button>
            <button class="btn btn-sm btn-danger" id="decision-reject-button"
                    v-if="is_making_decision" @click="nameReject()" >Reject</button>
            <button class="btn btn-sm btn-secondary" id="decision-cancel-button"
                    v-if="is_making_decision" @click="is_making_decision=false">Cancel</button>

            <button class="btn btn-sm btn-danger" id="examine-re-open-button"
                    v-if="is_complete && !is_furnished && !is_cancelled && !is_approved_expired" @click="reOpen()" >
              Re-Open</button>

            <button class="btn btn-sm btn-danger" id="examine-reset-button"
                    v-if="is_complete && is_furnished && !is_cancelled && !is_approved_expired" data-toggle="modal" data-target="#add-comment-reset-modal">
              RESET</button>

            <!-- EXAMINE button - to claim/examine an NR that is on hold -->
            <button class="btn btn-sm btn-primary" id="examine-button" v-if="can_claim"
                    @click="claimNR()" >Examine</button>
          </div>

          <table>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==1,
                               accepted: compName1.state == 'A'}">
              <td>1.</td>
              <td id="name1">
                {{ compName1.name }}
                <span class="name-state-icon" v-html="setIcon(compName1.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_1"
                        v-on:click="undoDecision(1)">Undo Decision</button>
                <span class="decision-text">{{ compName1.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==2,
                               accepted: compName2.state == 'A'}">
              <td>2.</td>
              <td id="name2">
                {{ compName2.name }}
                <span class="name-state-icon" v-html="setIcon(compName2.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_2"
                        v-on:click="undoDecision(2)">Undo Decision</button>
                <span class="decision-text">{{ compName2.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{'active-name-option': currentChoice==3,
                               accepted: compName3.state == 'A'}">
              <td>3.</td>
              <td id="name3" >
                {{ compName3.name }}
                <span class="name-state-icon" v-html="setIcon(compName3.state)"></span>
                <button class="btn btn-undo" v-if="is_undoable_3"
                        v-on:click="undoDecision(3)">Undo Decision</button>
                <span class="decision-text">{{ compName3.decision_text }}</span>
              </td>
            </tr>
          </table>

          <div >
            <div align="right" v-if="!is_making_decision && !is_complete && is_my_current_nr">

              <button v-shortkey="['alt', 'a']" @shortkey="quickApprove()" class="btn btn-sm btn-outline-primary" id="examine-quick-approve-button"
                      @click="quickApprove">Quick <u>A</u>pprove</button>
              <button  v-shortkey="['alt', 'i']" @shortkey="rejectDistinctive()" class="btn btn-sm btn-outline-danger" id="examine-reject-distinctive-button"
                      @click="rejectDistinctive">Reject D<u>i</u>stinctive</button>
              <button v-shortkey="['alt', 'e']" @shortkey="rejectDescriptive()" class="btn btn-sm btn-outline-danger" id="examine-reject-descriptive-button"
                      @click="rejectDescriptive">Reject D<u>e</u>scriptive</button>
            </div>
            <div v-if="!is_making_decision" id="manual-search">
              <form class="form-inline my-2 my-lg-0" @submit.prevent="onSubmit">
                <input ref="search" type="text" class="search form-control" v-model="searchStr"  v-shortkey="['alt', 's']" @shortkey="setFocus()">
                <button class="btn-search" type="submit"><i class="fa fa-search" /></button>
                <button class="btn-reset" v-if="is_running_manual_search" @click="resetSearchStr">
                  <i class="fa fa-times" /></button>
              </form>
            </div>
          </div>

        </div>

      </div>

    </div>
    <div class="modal fade" id="add-comment-reset-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Please give a comment to explain why this NR is being RESET</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea id="reset-comment-text" class="form-control" rows="10"
                      v-model="add_comment_display"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-secondary"
                    data-dismiss="modal" @click="cancelReset">Cancel</button>
            <button type="button" id="reset-nr-after-comment-button" class="btn btn-sm btn-danger" disabled="true"
                    data-dismiss="modal" @click="reset">RESET</button>
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
        retval: [],
        is_running_manual_search: false,
        add_comment_display: "",
        resetting: false,
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

        let expired_date = new Date(this.$store.getters.expiryDate);
        let date = new Date();
        if (this.$store.getters.currentState === "APPROVED" && date > expired_date) return true;
        return false;
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
      acceptance_will_be_conditional() {
        return this.$store.getters.acceptance_will_be_conditional;
      },
      can_claim() {
        console.log('got to can_claim with status ' + this.currentState);
        // can this user claim the NR? Based on state.
        if (['DRAFT', 'HOLD'].indexOf(this.currentState) > -1) return true;
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
    },
    mounted() {
      console.log('Compname Mounted')
      if(this.$store.getters.nrNumber == null){
        console.log('Mounted->get next NR number')
        this.$store.dispatch('getpostgrescompNo');
      }
      this.setFocus();
    },
    methods: {
      getNextCompany() {
        this.$store.dispatch('getpostgrescompNo');
      },
      startDecision() {
        this.$store.state.is_making_decision = true;
      },
      nameAccept() {
        this.$store.commit('decision_made', 'A');
      },
      nameReject() {
        this.$store.commit('decision_made', 'R');
      },
      reOpen() {
        this.$store.state.currentState = 'INPROGRESS';
        this.$store.dispatch('resetDecision', 1);
        this.$store.dispatch('resetDecision', 2);
        this.$store.dispatch('resetDecision', 3);
        this.$store.dispatch('updateRequest');
      },
      reset() {
        this.resetting = true;
        if (this.compName1 != undefined)
          this.$store.dispatch('resetDecision', 1);
        else
          console.log('Error no compName1 on this NR')
      },
      cancelReset() {
        this.add_comment_display = "";
        $("#reset-comment-text").prop('disabled', false);
      },
      claimNR() {
        this.$store.dispatch('updateNRState', 'INPROGRESS');
      },
      holdRequest() {
        this.$store.dispatch('updateNRState', 'HOLD');
      },
      runRecipe(){
        this.$store.dispatch('runRecipe')
      },
      setIcon(name_state) {
        if (name_state == 'R') {
          return '<i class="fa fa-times icon-rejected"></i>';
        }
        else if (name_state == 'A' || name_state == 'C') {
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
        if (this.currentState != 'INPROGRESS') return false;

        // if the NR is furnished, nothing is undoable
        if (this.$store.state.furnished === 'Y')  return false;

        // if this name is complete (ie: anything other than NE) it's undoable
        if (name.state == 'NE' || name.state == null) return false;

        return true;
      },
      quickApprove() {
        this.currentNameObj.decision_text = ''
        console.log('quickApprove')

        this.decision_made = 'A'
        this.nameAcceptReject()
      },
      rejectDescriptive() {

        this.currentNameObj.decision_text = 'Require descriptive second word or phrase * E.G. ' +
          'Construction, Gardening, Investments, Holdings, Etc.'
        this.decision_made = 'R'
        this.nameAcceptReject()
      },
      rejectDistinctive() {
        // When this was written, the 16th index of listDecisionReasons was the string needed for a distinctive term missing
        // it was decided to HARD CODE this value until another solution is found
        // var distinctiveStr = this.listDecisionReasons[16].reason
        this.currentNameObj.decision_text = "Require distinctive, nondescriptive first word or " +
          "prefix * E.G. Person's name, initials, geographic location, etc."
        this.decision_made = 'R'
        this.nameAcceptReject()
      },
      onSubmit()
      {
        console.log("Running manual recipe on " + this.searchStr);
        this.$store.dispatch('runManualRecipe', this.searchStr);

        if (this.searchStr != this.currentName) this.is_running_manual_search = true;
      },
      resetSearchStr(){
        this.searchStr = this.currentName
        this.is_running_manual_search = false;
      },
      nameAcceptReject() {

        // save decision
        console.log('nameAcceptReject decision_made:' + this.decision_made)
        if (this.decision_made == 'A') {
          this.currentNameObj.state = 'A';
        }
        else {
          this.currentNameObj.state = 'R';
        }

        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject');
        this.decision_made = null;
        this.is_making_decision = false;
      },
      setFocus: function() {
        this.$refs.search.focus();
      }
    },
    watch: {
      add_comment_display: function(val) {
        console.log('add_comment_display watcher fired:' + val)
        if (val)
          $("#reset-nr-after-comment-button").prop('disabled', false);
        else
          $("#reset-nr-after-comment-button").prop('disabled', true);
      },
      compName1State: function (val) {
        console.log('compName1 watcher fired:' + val)
        if (this.resetting) {
          if (this.compName2 != undefined)
            this.$store.dispatch('resetDecision', 2);
          else {
            // create new comment object with just text, and add it to list of comments in data structure
            var newCommentData = {
              comment: this.add_comment_display,
              examiner: this.$store.state.examiner
            };
            this.internalComments = this.internalComments.concat(newCommentData);
          }
        }
      },
      compName2State: function (val) {
        console.log('compName2 watcher fired:' + val)
        if (this.resetting) {
          if (this.compName3 != undefined)
            this.$store.dispatch('resetDecision', 3);
          else {
            // create new comment object with just text, and add it to list of comments in data structure
            var newCommentData = {
              comment: this.add_comment_display,
              examiner: this.$store.state.examiner
            };
            this.internalComments = this.internalComments.concat(newCommentData);
          }
        }
      },
      compName3State: function (val) {
        console.log('compName3 watcher fired:' + val)
        if (this.resetting) {
          // create new comment object with just text, and add it to list of comments in data structure
          var newCommentData = {
            comment: this.add_comment_display,
            examiner: this.$store.state.examiner
          };
          this.internalComments = this.internalComments.concat(newCommentData);
        }
      },
      currentName: function (val) {
        console.log('CompName.currentName watcher fired:' + val)
        this.searchStr =  val
      },
      currentChoice: function (val) {
        console.log('CompName.currentChoice watcher fired:' + val)
        if(val != undefined ) { this.runRecipe() }
      },
      currentState: function (val) {
        console.log('CompName.currentState watcher fired:' + val)
        if (this.resetting) {
          this.resetting = false;
          this.$store.dispatch('updateRequest');
          this.add_comment_display = "";
          $("#reset-comment-text").prop('disabled', false);
        }
      },
      internalComments: function (val) {
        console.log('CompName.internalComments watcher fired:' + val)
        if (this.resetting)
          this.$store.commit('furnished', "N");
      },
      is_furnished: function (val) {
        console.log('CompName.is_furnished watcher fired:' + val)
        if (this.resetting && val === false)
          this.$store.commit('currentState', 'INPROGRESS');
      },
      nrNumber: function (val) {
        console.log('CompName.nrNumber watcher fired:' + val)
        if(val != null){ this.runRecipe()}
      }
    }
  }
</script>


<style scoped>
  .name-sect {
  }
  .name-option {
    font-size:1.2em;
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

  .search{
    width: 350px;
  }

  #manual-search button {
    width: 20px;
    border: none;
    background-color: transparent;
    padding: 0;
    color: #666;
    margin-top: -1px;
  }

  .btn-search{
    margin-left: -25px;
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
