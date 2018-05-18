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
    align-content: center;
    border: 1px solid #eee;
    padding: 0px;
    //box-shadow: 0 2px 3px #ccc;
    background-color: rgba(154, 205, 142, 0.65);
    height:300px;
  }
</style>
