/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

          <div class="col client-info-view">
            <h2>{{ currentName }}</h2>
            <div class="add-top-padding">
              <h3>NR Number</h3>
              <p>{{ nrNumberMatch }}</p>
            </div>
            <div class="add-top-padding"><clientinfomatch /></div>
          </div>

      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

import clientinfomatch from '@/components/dropdown/Search/client/ClientInfoMatch.vue';

  export default {
    name: 'ConflictInfo',
    components: {
      clientinfomatch
    },
    computed: {
        name() {
          return  this.$store.getters.firstName;
        },
        nrNumberMatch: {
          get: function() {
            return this.$store.getters.nrNumberMatch;
          },
          set: function(value) {
            console.log("match:" + value)
            this.$store.commit('nrNumberMatch', value);
          }
        },
      },
      watch: {
        nrNumberMatch: function (val) {
          this.$store.dispatch('getMatchedConflictInfo', this.nrNumberMatch)
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
