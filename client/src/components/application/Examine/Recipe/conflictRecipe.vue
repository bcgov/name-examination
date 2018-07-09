<!--eslint-disable-->
<template>
  <div class="container-fluid">

    <div class="row" >

      <div class="col" style="padding-right: 4px;">
        <conflictlistview /></div>
      <div class="col corpDet">
        <h2 id="currentConflictName">{{currentConflictName}}</h2>
        <conflictinfoview />
      </div>

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
  import conflictlistview from '@/components/application/Examine/Recipe/conflicts/ConflictList.vue';
  import conflictinfoview from '@/components/application/Examine/Recipe/conflicts/ConflictInfo.vue';

  // ClientInfo - read-only component
  import clientinfoview from '@/components/application/Examine/client/ClientInfo.vue';

  export default {
    name: 'IssueInfo',
    computed: {
      currentConflictName() {
        let currentConflict = this.$store.getters.currentConflict;
        if (currentConflict != null)
          return currentConflict.text;
        else
          return "";
      },
      currentName() {
        return this.$store.getters.currentName;
      },
      submittedDate() {
        return this.$store.getters.submittedDate;
     },
    },
    components: {
      conflictlistview,
      conflictinfoview,
      clientinfoview
    }
  }
</script>

<style scoped>
  #currentConflictName {
    background: #ff9999;
    padding: 0;
    margin: 0;
  }
  .issue-sects {
  }
  .client-info-view {
    background-color: #efefef;
    padding: 1px;
  }
  .corpDet {
    border: 1px solid #ff9999;
    margin-right: 2px;
    padding: 0;
  }
</style>
