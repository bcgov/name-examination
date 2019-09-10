/* eslint-disable */
<template>
  <v-container ma-0
               pa-0
               fluid
               id="compare-container">
    <v-layout v-if="comparedConflicts.length > 0"
              v-for="(conflict, i) in comparedConflicts"
              :key="i+'-compared'"
              :id="i+'-compared'"
              mb-1
              bg-l-blue
              column>
      <v-layout header-style px-3>
        <v-flex text-style text-left>{{ conflict.text }}</v-flex>
        <v-flex width-15 text-right>{{ conflict.nrNumber }}</v-flex>
        <v-flex width-10 text-center>{{ formatJurisdiction(conflict.jurisdiction) }}</v-flex>
        <v-flex width-20 text-left>{{ formatDate(conflict.startDate) }}</v-flex>
      </v-layout>
      <CorpMatch data-testid="corpmatch"
                 :key="i + 'corp-match'"
                 :conflictData="conflict"
                 v-if="conflict.type === 'corp'" />
      <NamesMatch data-testid="namesmatch"
                  :key="i + '-name-match'"
                  :conflictData="conflict"
                  v-if="conflict.type === 'name'" />
    </v-layout>
    <v-layout text-center pa-3 v-if="comparedConflicts.length === 0">
      <v-flex>No conflicts have been added for comparisson.</v-flex>
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
      ...mapGetters({conflicts: 'comparedConflicts'}),
      comparedConflicts() {
        if (Array.isArray(this.conflicts)) {
          return this.conflicts
        }
        return []
      }
    },
    methods: {
      formatDate(d) {
        return moment(d).parseZone().format('YYYY-MM-DD')
      },
      formatJurisdiction(text) {
        if (text.includes('-')) {
          return text.split('-')[0].trim()
        }
        return text
      }
    }
  }
</script>

<style scoped>
  .text-style {
    width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .width-10 {
    width: 10%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }

  .width-20 {
    width: 20%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }

  .width-15 {
    width: 15%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }

  .bg-l-blue {
    background-color: var(--xl-blue);
  }

  #compare-container {
    background-color: white;
    height: 445px;
    overflow-y: scroll;
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
