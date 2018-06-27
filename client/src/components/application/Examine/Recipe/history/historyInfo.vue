/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <div class="col conflict-info-view">

            <div v-if="is_corp" class="add-top-padding"><corpMatch /></div>
            <div v-else class="add-top-padding"><namesMatch /></div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import namesMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/namesMatch.vue';
import corpMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/corpMatch.vue';

  export default {
    name: 'historyInfo',
    components: {
      namesMatch,
      corpMatch
    },
    computed: {
      currentConflict() {
        return  this.$store.getters.currentConflict;
      },
      is_corp() {
        if (this.currentConflict !== null){
          if( this.currentConflict.source == 'CORP') {
            return true
          }
        }else{
          return false
        }
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
