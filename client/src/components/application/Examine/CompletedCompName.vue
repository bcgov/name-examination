<!--eslint-disable-->
<template>
  <div>
    <div>
      <div class="row">
        <div class="col">

          <div id="top-buttons">

            <!-- GET NEXT button -->
            <button v-shortkey="['alt', 'n']" @shortkey="getNextCompany()" class="btn btn-sm btn-secondary" id="examine-get-next-button"
                    @click="getNextCompany()" >Get <u>N</u>ext</button>

            <!-- CANCEL button -->
            <button class="btn btn-sm btn-danger" id="examine-cancel-button"
                    v-if="!is_cancelled && !is_approved_expired && !is_consumed" data-toggle="modal" data-target="#add-cancel-comment-modal">
              Cancel Request</button>

            <!-- RE-OPEN (un-furnished) button -->
            <button class="btn btn-sm btn-danger" id="examine-re-open-button"
                    v-if="!is_furnished && !is_cancelled && !is_approved_expired" @click="reOpen()" >
              Re-Open</button>

            <!-- RESET (from furnished) button -->
            <button class="btn btn-sm btn-danger" id="examine-reset-button"
                    v-if="is_furnished && !is_cancelled && !is_approved_expired" data-toggle="modal" data-target="#add-comment-reset-modal">
              RESET</button>

            <!-- EXAMINE button - to claim/examine an NR that is on hold -->
            <button class="btn btn-sm btn-primary" id="examine-button" v-if="can_claim"
                    @click="claimNR()" >Examine</button>


          </div>

          <table>
            <tr class="name-option"
                v-bind:class="{ accepted: compName1.state === 'APPROVED' }">
              <td>1.</td>
              <td id="name1">
                {{ compName1.name }}
                <span class="name-state-icon" v-html="setIcon(compName1.state)"></span>
                <span class="decision-text">{{ compName1.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{ accepted: compName2.state === 'APPROVED' }">
              <td>2.</td>
              <td id="name2">
                {{ compName2.name }}
                <span class="name-state-icon" v-html="setIcon(compName2.state)"></span>
                <span class="decision-text">{{ compName2.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                v-bind:class="{ accepted: compName3.state === 'APPROVED' }">
              <td>3.</td>
              <td id="name3" >
                {{ compName3.name }}
                <span class="name-state-icon" v-html="setIcon(compName3.state)"></span>
                <span class="decision-text">{{ compName3.decision_text }}</span>
              </td>
            </tr>
          </table>

        </div>

      </div>

    </div>

    <!-- RESET COMMENT popup -->
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
    name: 'CompletedCompName',
    data: function () {
      return {
        add_comment_display: "",
        cancel_comment_display: "",
        resetting: false,
      }
    },
    computed: {
      currentState() {
        return this.$store.getters.currentState;
      },
      userId() {
        return this.$store.getters.userId;
      },
      is_furnished() {
        if (this.$store.getters.furnished === "Y") return true;
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
      compName1() {
        return this.$store.getters.compName1;
      },
      compName2() {
        return this.$store.getters.compName2;
      },
      compName3() {
        return this.$store.getters.compName3;
      },
      currentName() {
        return this.$store.getters.currentName;
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
    },
    methods: {
      getNextCompany() {
        this.$store.dispatch('resetValues');
        this.searching = true;
        this.$store.dispatch('getpostgrescompNo');
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
      setIcon(name_state) {
        if (name_state == 'REJECTED') {
          return '<i class="fa fa-times icon-rejected"></i>';
        }
        else if (name_state == 'APPROVED' || name_state == 'CONDITION') {
          return '<i class="fa fa-check icon-accepted"></i>';
        }
        else return '';
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
      add_comment_display: function(val) {
        console.log('add_comment_display watcher fired:' + val)
        if (val)
          $("#reset-nr-after-comment-button").prop('disabled', false);
        else
          $("#reset-nr-after-comment-button").prop('disabled', true);
      },
      cancel_comment_display: function(val) {
        console.log('cancel_comment_display watcher fired:' + val)
        if (val)
          $("#cancel-nr-after-comment-button").prop('disabled', false);
        else
          $("#cancel-nr-after-comment-button").prop('disabled', true);
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
  .name-option {
    font-size:1.3em;
    text-align: left;
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
    font-size: 15px;
    width: 600px;
    position: relative;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
  }
</style>
