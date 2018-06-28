/* eslint-disable */
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col">

          <div id="top-buttons">
            <button class="btn btn-sm btn-secondary" v-if="!is_making_decision"
                    @click="getNextCompany()" >Get Next</button>
            <button class="btn btn-sm btn-primary" v-if="!is_making_decision && !is_complete"
                    @click="startDecision()" >Approve/Reject...</button>

            <button class="btn btn-sm btn-primary" v-if="is_making_decision"
                    @click="nameAccept()">Accept</button>
            <button class="btn btn-sm btn-danger" v-if="is_making_decision"
                    @click="nameReject()" >Reject</button>
            <button class="btn btn-sm btn-secondary" v-if="is_making_decision"
                    @click="is_making_decision=false">Cancel</button>

            <button class="btn btn-sm btn-danger" v-if="is_complete" @click="reOpen()" >
              Re-Open</button>
          </div>

          <table>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==1}">
              <td>1.</td>
              <td id="name1" >
                {{ compName1.name }}
                <span class="name-state-icon" v-html="setIcon(compName1.state)"></span>
                <span class="decision-text">{{ compName1.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==2}">
              <td>2.</td>
              <td id="name2" >
                {{ compName2.name }}
                <span class="name-state-icon" v-html="setIcon(compName2.state)"></span>
                <span class="decision-text">{{ compName2.decision_text }}</span>
              </td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==3}">
              <td>3.</td>
              <td id="name3" >
                {{ compName3.name }}
                <span class="name-state-icon" v-html="setIcon(compName3.state)"></span>
                <span class="decision-text">{{ compName3.decision_text }}</span>
              </td>
            </tr>
          </table>
          <div v-if="!is_making_decision">
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
          this.$store.getters.currentNameObj(value);
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
    },
    watch: {
      currentChoice: function (val) {
        console.log('currentChoice watcher fired:' + val)
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
    color: #38761d;
  }
</style>
