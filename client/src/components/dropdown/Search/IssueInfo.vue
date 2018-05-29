/* eslint-disable */
<template>
  <div class="container-fluid">
    <div class="issue-sects" >

      <div class="row" >
        <div class="col"><conflictlistview /></div>
        <div class="col"><conflictinfoview /></div>
        <div class="col"><clientinfoview /></div>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import conflictlistview from '@/components/dropdown/Search/conflicts/ConflictList.vue';
import conflictinfoview from '@/components/dropdown/Search/conflicts/ConflictInfo.vue';

// ClientInfo - read-only component
import clientinfoview from '@/components/dropdown/Search/client/ClientInfo.vue';

export default {
  name: 'IssueInfo',
  computed: {
    issueText() {
      return this.$store.getters.issueText;
    }
  },
  components: {
    conflictlistview,
    conflictinfoview,
    clientinfoview
  }
}
</script>

<style scoped>
  .issue-sects {
  }
</style>
