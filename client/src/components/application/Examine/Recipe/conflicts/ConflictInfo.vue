/* eslint-disable */
<template>
  <v-container ma-0 pa-0 fluid bg-color id="conflict-info-container">
    <v-layout id="conflict-info-layout">
      <spinner className="conflict-detail-spinner pb-5"/>
      <CorpMatch id="corpmatch"
                 class="conflict-info-view"
                 :conflictData="corpConflictJSON"
                 v-if="is_corp"/>
      <NamesMatch id="namematch"
                  :conflictData="namesConflictJSON"
                  class="conflict-info-view"
                  v-else-if="is_names"/>
      <NullMatch class="conflict-info-view" v-else/>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import CorpMatch from './conflictInfoType/CorpMatch.vue'
  import NamesMatch from './conflictInfoType/NamesMatch.vue'
  import NullMatch from './conflictInfoType/NullMatch.vue'
  import spinner from '@/components/application/spinner.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ConflictInfo',
    components: { CorpMatch, NamesMatch, NullMatch, spinner, },
    mounted() {
      this.scrollIntoView()
    },
    computed: {
      ...mapGetters(['currentConflict', 'namesConflictJSON', 'corpConflictJSON']),
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
    watch: {
      currentConflict(newData, oldData) {
        if (newData) {
          this.scrollIntoView()
        }
      }
    },
    methods: {
      scrollIntoView() {
        this.$nextTick(function () {
          this.$el.scrollIntoViewIfNeeded()
        })
      }
    }
  }
</script>

<style scoped>
  .conflict-detail-spinner:not(.hidden) ~ .conflict-info-view {
    display: none !important;
  }
  .bg-color {
    background-color: var(--l-blue);
  }

</style>
