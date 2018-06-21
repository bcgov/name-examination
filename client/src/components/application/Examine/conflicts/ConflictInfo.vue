/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <div class="col conflict-info-view">
            <h2>{{ currentConflictName }}</h2>
            <div class="add-top-padding">
              <h3>NR Number</h3>
              <p>{{ currentConflictNumber }}</p>
            </div>
            <div v-if="is_corp" class="add-top-padding"><corpMatch /></div>
            <div v-else class="add-top-padding"><namesMatch /></div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import namesMatch from '@/components/application/Examine/conflicts/conflictInfoType/namesMatch.vue';
import corpMatch from '@/components/application/Examine/conflicts/conflictInfoType/corpMatch.vue';

  export default {
    name: 'ConflictInfo',
    components: {
      namesMatch,
      corpMatch
    },
    computed: {
      currentConflictName() {
          return  this.$store.getters.currentConflictName;
      },
      currentConflictNumber() {
          return this.$store.getters.currentConflictNumber;
      },
      is_corp() {
        console.log('Checking if data is corp or names')
        if(this.$store.getters.currentConflictSource == 'CORP'){
          return true
        }else{
          return false
        }
      }
    },
    watch: {
      currentConflictName: function (val) {
        console.log('watcher fired:' + val)
        this.runRecipe()
      }
    }
  }
</script>

<style scoped>
  .conflict-info-view {
    background-color: #00000;
    padding: 10px;
  }
</style>
