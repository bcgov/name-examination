/* eslint-disable */
<template>
  <div class="container-fluid">


      <div class="row" >
        <div class="col" style="padding-left: 0;"><conflictlistview /></div>
        <div class="col"><conflictinfoview /></div>
        <div class="col client-info-view">
          <h2>{{ currentName }}</h2>
          <div class="add-top-padding">
            <h3>Submitted</h3>
            <p>{{ submittedDate }}</p>
          </div>
          <div class="add-top-padding"><clientinfoview /></div>
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
    },
    currentName() {
      return this.$store.getters.currentName;
    },
    submittedDate() {
      return this.$store.getters.submittedDate;
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

  .client-info-view {
    background-color: #efefef;
    padding: 10px;
  }
</style>
