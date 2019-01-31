/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <spinner className="conflict-detail-spinner hidden" />

          <div class="col conflict-info-view">
            <div v-if="is_corp" class="add-top-padding">
              <corpMatch />
            </div>
            <div v-else-if="is_names" class="add-top-padding">
              <namesMatch />
            </div>
            <div v-else class="add-top-padding">
              <nullMatch />
            </div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import nullMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/nullMatch.vue';
import namesMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/namesMatch.vue';
import corpMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/corpMatch.vue';
import spinner from '@/components/application/spinner.vue';

  export default {
    name: 'ConflictInfo',
    components: {
      spinner,
      namesMatch,
      corpMatch,
      nullMatch
    },
    computed: {

      currentConflict: {
        get: function () {
          return this.$store.getters.currentConflict;
        }
      },
      is_corp() {
        if (this.currentConflict != undefined) {
          if (this.currentConflict.source === 'CORP') return true;
          return false
        }
        return false;
      },
      is_names() {
        if (this.currentConflict != undefined) {
          if (this.currentConflict.source === 'NR') return true;
          return false
        }
        return false;
      },
    },
  }
</script>

<style scoped>
  .conflict-info-view {
    /*background-color: #000000;*/
    padding: 10px;
  }

  /* hide the panel content when spinner is showing, ie: results are loading */
  .spinner:not(.hidden) + .conflict-info-view {
    display: none;
  }

  h3, h2 {
    font-size: 15px;
  }
  p {
    font-size: 14px;
  }

</style>
