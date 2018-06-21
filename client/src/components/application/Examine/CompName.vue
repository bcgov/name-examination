/* eslint-disable */
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col">

          <table>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==1}">
              <td>1.</td>
              <td id="name1" >
                {{ compName1.name }}
                <span class="name-state-icon" v-html="setIcon(compName1.state)"></span>
                {{ compName1.decision_text }}
              </td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==2}">
              <td>2.</td>
              <td id="name2" >
                {{ compName2.name }}
                <span class="name-state-icon" v-html="setIcon(compName2.state)"></span>
                {{ compName2.decision_text }}
              </td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==3}">
              <td>3.</td>
              <td id="name3" >
                {{ compName3.name }}
                <span class="name-icon" v-html="setIcon(compName3.state)"></span>
                {{ compName3.decision_text }}
              </td>
            </tr>
          </table>
          <div v-if="!is_making_decision">
            <input v-model="currentName" class="form-control" onChange="runRecipe"/>
            <button @click="runManualSearch()">Manual Search</button>
          </div>
        </div>

        <div class="col" id="top-buttons">
          <button class="btn btn-sm btn-secondary" v-if="!is_making_decision"
                  @click="getNextCompany()" >Get Next</button>
          <button class="btn btn-sm btn-primary" v-if="!is_making_decision"
                  @click="startDecision()" >Approve/Reject...</button>

          <button class="btn btn-sm btn-primary" v-if="is_making_decision"
                  @click="nameApproved()">Accept</button>
          <button class="btn btn-sm btn-danger" v-if="is_making_decision"
                  @click="nameRejected()" >Reject</button>
          <button class="btn btn-sm btn-secondary" v-if="is_making_decision"
                  @click="is_making_decision=false">Cancel</button>

          <button class="btn btn-sm btn-danger" v-if="is_complete" @click="reOpen()" >
            Re-Open</button>
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
      currentChoice() {
        return this.$store.getters.currentChoice;
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
      currentChoice: {
        get: function () {
          return this.$store.getters.currentChoice
        },
        set: function (value) {
          this.$store.commit('currentChoice', value);
        }
      },
      is_complete() {
        // indicates a complete BUT REVERTABLE (not yet furnished) NR that can be re-opened.
        if (this.$store.state.furnished) return false;
        else {
          if (['APPROVED', 'REJECTED', 'CONDITION'].
               indexOf(this.$store.getters.currentState) >= 0 ) return true;
          else false;
        }
      }
    },
    mounted() {
      this.$store.dispatch('getpostgrescompNo');
    },
    methods: {
      getNextCompany() {
        this.$store.dispatch('getpostgrescompNo');
      },
      startDecision() {
        this.$store.state.is_making_decision = true;
      },
      nameApproved() {
        this.$store.dispatch('nameApproved');
      },
      nameRejected() {
        this.$store.dispatch('nameRejected');
        alert("here")
      },
      reOpen() {
        this.$store.dispatch('updateNRState', 'INPROGRESS');
      },
      nextChoice(){
        console.log('running nextChoice ' )
        if(this.currentChoice == 1){
          this.currentChoice = 2
        }else if(this.currentChoice == 2){
          this.currentChoice = 3
        }else{
          this.currentChoice = 1
        }
        //check if current name is null - move on to next choice if it is - stop if current choice is 1
        if(this.currentName == null) {
          if(this.currentChoice != 1) {
            this.nextChoice()
          }
        }
        this.runRecipe()
      },
      runRecipe() {
        console.log('Running Recipe')
        this.$store.dispatch('checkConflicts');
        //this.$store.dispatch('checkTrademarks');
        //this.$store.dispatch('checkConsent');
        //this.$store.dispatch('checkHistories');
        //this.$store.dispatch('checkFormat');
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
    },
    watch: {
      currentChoice: function (val) {
        console.log('watcher fired:' + val)
        this.runRecipe()
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
  #top-buttons button {
    float: right;
    margin-left: 5px;
  }

</style>

<!-- not scoped -->
<style>

  .name-state-icon .icon-rejected {
    color: #c00;
  }
  .name-state-icon .icon-accepted {
    color: #38761d;
  }
</style>
