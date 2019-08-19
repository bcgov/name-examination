/* eslint-disable */
<template>
  <v-container ma-0 pa-0 fluid container-style id="compare-container">
    <v-layout v-for="(conflict, i) in comparedConflicts"
              :key="`compare-${i}`"
              column>
      <v-layout header-style px-3>
        <v-flex text-style text-left>{{ conflict.text }}</v-flex>
        <v-flex width-15 text-right>{{ conflict.nrNumber }}</v-flex>
        <v-flex width-10 text-right>{{ conflict.jurisdiction }}</v-flex>
        <v-flex width-20 text-right>{{ formatDate(conflict.startDate) }}</v-flex>
      </v-layout>
      <CorpMatch class="conflict-info-view" v-if="conflict.type === 'corp'" />
      <NamesMatch class="conflict-info-view" v-if="conflict.type === 'name'" />
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import CorpMatch from '../conflicts/conflictInfoType/CorpMatch.vue'
  import NamesMatch from '../conflicts/conflictInfoType/NamesMatch.vue'
  import { mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'Compare',
    components: { CorpMatch, NamesMatch, },
    computed: {
      ...mapGetters(['comparedConflicts'])
    },
    methods: {
      formatDate(d) {
        return moment(d).format('YYYY-MM-DD')
      }
    }
  }
</script>

<style scoped>
  .text-style {
    width: 65%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .width-10 {
    width: 10%;
  }

  .width-20 {
    width: 20%;
  }

  .width-15 {
    width: 15%;
  }

  .container-style {
    background-color: var(--xl-blue);
  }

  .header-style {
    background-color: var(--l-blue);
    height: 32px;
    color: var(--link);
    font-size: 16px;
    font-weight: 500;
    padding-top: 3px;
  }
</style>
