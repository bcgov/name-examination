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
            <div class="add-top-padding"><namesMatch /></div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import namesMatch from '@/components/dropdown/Search/conflicts/conflictInfoType/namesMatch.vue';
import corpMatch from '@/components/dropdown/Search/conflicts/conflictInfoType/corpMatch.vue';

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
