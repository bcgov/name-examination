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
import conflictlistview from '@/components/application/Examine/conflicts/ConflictList.vue';
import conflictinfoview from '@/components/application/Examine/conflicts/ConflictInfo.vue';

// ClientInfo - read-only component
import clientinfoview from '@/components/application/Examine/client/ClientInfo.vue';

export default {
  name: 'IssueInfo',
  computed: {
    currentName() {
      return this.$store.getters.currentName;
    },
    submittedDate() {
      return this.$store.getters.submittedDate;
    },
    is_Conflict() {
      if(this.currentRecipeCard == 'Conflicts') { return true }
      return false
    },
    is_Consent() {
      if(this.currentRecipeCard == 'Consent') { return true }
      return false
    },
    is_Trademarks() {
      if(this.currentRecipeCard == 'Trademarks') { return true }
      return false
    },
    is_History() {
      if(this.currentRecipeCard == 'History') { return true }
      return false
    },
    is_Format() {
      if(this.currentRecipeCard == 'Format') { return true }
      return false
    },
    currentRecipeCard() {
      return this.$store.getters.currentRecipeCard
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
