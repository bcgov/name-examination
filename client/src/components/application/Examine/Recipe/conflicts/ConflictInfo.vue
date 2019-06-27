/* eslint-disable */
<template>
  <v-container>
    <spinner className="conflict-detail-spinner hidden" />
    <v-layout conflict-info-view>
      <v-flex v-if="is_corp"><CorpMatch /></v-flex>
      <v-flex v-else-if="is_names"><NamesMatch /></v-flex>
      <v-flex v-else><NullMatch /></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import CorpMatch from './conflictInfoType/CorpMatch.vue'
  import NamesMatch from './conflictInfoType/NamesMatch.vue'
  import NullMatch from './conflictInfoType/NullMatch.vue'
  import spinner from '@/components/application/spinner.vue'

  export default {
    name: 'ConflictInfo',
    components: { CorpMatch, NamesMatch, NullMatch, spinner, },
    computed: {
      currentConflict() {
        return this.$store.getters.currentConflict
      },
      is_corp() {
        if (this.currentConflict != undefined) {
          if (this.currentConflict.source === 'CORP') return true
        }
        return false
      },
      is_names() {
        if (this.currentConflict != undefined) {
          if (this.currentConflict.source === 'NR') return true
        }
        return false
      },
    },
  }
</script>

<style scoped>
  /* hide the panel content when spinner is showing, ie: results are loading */
  .conflict-detail-spinner:not(.hidden) ~ .conflict-info-view {
    display: none !important;
  }


</style>
