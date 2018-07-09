/* eslint-disable */
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col">

          <div id="top-buttons">
            <button class="btn btn-sm btn-secondary" v-if="!is_making_decision"
                    @click="getNextCompany()" >Get Next</button>
            <button class="btn btn-sm btn-primary"
                    v-if="!is_making_decision && !is_complete && is_my_current_nr"
                    @click="startDecision()" >Approve/Reject...</button>

            <button class="btn btn-sm btn-primary" v-if="is_making_decision"
                    @click="nameAccept()">
              <span v-if="acceptance_will_be_conditional">Conditionally </span>Accept
            </button>
            <button class="btn btn-sm btn-danger" v-if="is_making_decision"
                    @click="nameReject()" >Reject</button>
            <button class="btn btn-sm btn-secondary" v-if="is_making_decision"
                    @click="is_making_decision=false">Cancel</button>

            <button class="btn btn-sm btn-danger"
                    v-if="is_complete && !is_furnished" @click="reOpen()" >
              Re-Open</button>

            <!-- EXAMINE button - to claim/examine an NR that is on hold -->
            <button class="btn btn-sm btn-primary" v-if="can_claim" @click="claimNR()" >
              Examine</button>
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
          <div v-if="!is_making_decision && !is_complete">
            <input v-model="currentName" class="form-control" onChange="runRecipe"/>
            <button @click="runManualSearch()">Manual Search</button>
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
    computed: {
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
        return this.$store.getters.furnished;
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
    },
    mounted() {
      if(this.$store.getters.nrNumber == null){
        console.log('Mounted->get next NR number')
        this.$store.dispatch('getpostgrescompNo');
      }
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
        this.$store.dispatch('updateNRState', 'INPROGRESS');
      },
      claimNR() {
        this.$store.dispatch('updateNRState', 'INPROGRESS');
      },
      runRecipe(){
        this.$store.dispatch('runRecipe')
      },
      setIcon(name_state) {
        if (name_state == 'R') {
          return '<i class="fa fa-times icon-rejected"></i>';
        }
        else if (name_state == 'A') {
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
        if (this.$store.state.furnished)  return false;

        // if this name is complete (ie: anything other than NE) it's undoable
        if (name.state == 'NE' || name.state == null) return false;

        return true;
      },
    },
    watch: {
      currentChoice: function (val) {
        console.log('CompName.currentChoice watcher fired:' + val)
        if(val != undefined ) { this.runRecipe() }
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
