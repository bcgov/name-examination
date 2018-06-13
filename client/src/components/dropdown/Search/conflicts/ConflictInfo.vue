/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <div class="col client-info-view">
            <h2>{{ currentConflictName }}</h2>
            <div class="add-top-padding">
              <h3>NR Number</h3>
              <p>{{ currentConflictNumber }}</p>
            </div>
            <div class="add-top-padding"><clientinfomatch /></div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import clientinfomatch from '@/components/dropdown/Search/conflicts/conflictInfoType/namesMatch.vue';

  export default {
    name: 'ConflictInfo',
    components: {
      clientinfomatch
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
  .client-info-view {
    background-color: #efefef;
    padding: 10px;
  }
</style>
