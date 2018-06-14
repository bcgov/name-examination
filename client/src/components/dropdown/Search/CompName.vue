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
              <td id="name1" v-shortkey.once="['arrowdown']" @shortkey="nextChoice('2')" >
                {{ compName1 }}</td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==2}">
              <td>2.</td>
              <td id="name2" v-shortkey.once="['arrowdown']" @shortkey="nextChoice('3')" >
                {{ compName2 }}</td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==3}">
              <td>3.</td>
              <td id="name3" v-shortkey.once="['arrowdown']" @shortkey="nextChoice('1')" >
                {{ compName3 }}</td>
            </tr>
          </table>
          <div>
          <p>
            <input v-model="currentName" class="form-control"  />
            <button @click="runManualSearch()">Manual Search</button>
          </p>
          </div>
        </div>

        <div class="col" id="top-buttons">
          <button class="btn btn-sm btn-secondary" v-if="!is_making_decision"
                  @click="getNextCompany()" >Get Next</button>
          <button class="btn btn-sm btn-primary" v-if="!is_making_decision"
                  @click="startDecision()" >Approve/Reject...</button>

          <button class="btn btn-sm btn-primary" v-if="is_my_current && is_making_decision"
                  @click="nameApproved()">Accept</button>
          <button class="btn btn-sm btn-danger" v-if="is_my_current && is_making_decision"
                  @click="nameRejected()" >Reject</button>
          <button class="btn btn-sm btn-secondary" v-if="is_my_current && is_making_decision"
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
      is_my_current() {
        return this.$store.getters.is_my_current;
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
      //console.log('Get Next nr Number')
      this.$store.dispatch('getpostgrescompNo');
      //console.log('Set current choices')
      //this.$store.dispatch('nextChoice',1);
      //console.log('Run Recipe')
      //this.runRecipe()
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
      },
      reOpen() {
        this.$store.dispatch('updateNRState', 'INPROGRESS');
      },
      nextChoice(choiceNum){
        console.log('running nextChoice ' + choiceNum)
        //alert("Here")
        this.$store.dispatch('nextChoice',choiceNum);
        //setFocus("name" + choiceNum )
        this.runRecipe()
      },
      runRecipe() {
        console.log('Running Recipe')
        this.$store.dispatch('checkConflicts');
        //this.$store.dispatch('checkTradmarks');
        //this.$store.dispatch('checkConsent');
        //this.$store.dispatch('checkHistory');
        //this.$store.dispatch('checkFormat');
      },
      setFontClassForNames(){
      }
    },
    watch: {
      compName1: function (val) {
        console.log('watcher fired:' + val)
        this.nextChoice(1)
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
