/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <div class="col conflict-info-view">
            <h2>{{ currentConflictName }}</h2>
            <div class="add-top-padding">
              <h3>NR Number</h3>
              <p>{{ currentConflictNumber}}</p>
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
      currentConflict() {
        return  this.$store.getters.currentConflict;
      },
      currentConflictName() {
        if (this.currentConflict !== null) return this.currentConflict.text;
        else return null;
      },
      currentConflictNumber() {
        if (this.currentConflict !== null) return this.currentConflict.nrNumber;
        else return null;
      },
    }
  }
</script>

<style scoped>
  .conflict-info-view {
    background-color: #00000;
    padding: 10px;
  }
</style>
