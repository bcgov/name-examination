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
              <td v-shortkey.once="['f1']" @shortkey="runAlert()" >{{ compName1 }}</td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==2}">
              <td>2.</td>
              <td>{{ compName2 }}</td>
            </tr>
            <tr class="name-option"
                  v-bind:class="{'active-name-option': currentChoice==3}">
              <td>3.</td>
              <td>{{ compName3 }}</td>
            </tr>
          </table>
        </div>
        <div class="col" id="top-buttons">
          <button class="btn btn-sm btn-secondary" @click="getNextCompany()" >Get Next</button>
          <button class="btn btn-sm btn-primary" v-if="is_my_current" @click="nameApproved()">
            Accept</button>
          <button class="btn btn-sm btn-danger" v-if="is_my_current" @click="nameRejected()" >
            Reject</button>
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
      is_my_current() {
        return this.$store.getters.is_my_current;
      },
      is_complete() {
        // indicates a complete BUT REVERTABLE (not yet furnished) NR that can be re-opened.
        if (this.$store.state.furnished) return false;
        else {
          if (['APPROVED', 'REJECTED', 'CONDITION'].indexOf(this.$store.getters.currentState) >= 0 ) return true;
          else false;
        }
      }
    },
    mounted() {
    },
    methods: {
      getNextCompany() {
        this.$store.dispatch('getpostgrescompNo');
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
      runAlert(){
        alert("Here")
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
