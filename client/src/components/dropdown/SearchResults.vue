/* eslint-disable */
<template>
  <div>
    <!--search-Results-view></search-Results-view -->

  <div class="container">

    <div class="row mh1">
      <div class="col-8"><compnameview /></div>
      <div class="col"><compinfoview /></div>
    </div>

    <div class="row mh2">
      <div class="col-5"><compmatches /></div>
      <div class="col"><matchissues /></div>
    </div>

    <div class="row mh3">
      <div class="col"><examinationmenu /></div>
    </div>

  </div>

  </div>
</template>

<script>
/* eslint-disable */
  import compnameview from '@/components/dropdown/search/compName.vue';
  import compinfoview from '@/components/dropdown/search/compType.vue';
  import compmatches from '@/components/dropdown/search/nameMatches.vue';
  import matchissues from '@/components/dropdown/search/IssueInfo.vue';
  import examinationmenu from '@/components/dropdown/search/examinationMenu.vue';

  export default {
    name: "searchResults",

    components: {
      compnameview,
      compinfoview,
      compmatches,
      matchissues,
      examinationmenu
    },
    methods: {
      onClick: function () {

      }
    }
  }

  function getIssueInfo(CID) {
    // var info = getInfoFromCellID(CID);
    var divCell = document.getElementById('ISSUE-INFO');
    divCell.innerText="Issue Info Formatted";
  }

</script>

<style scoped>
  .mh1 div {
    height: 30vh; /* 30% of viewport height*/
  }
  .mh2 div {
    height: 50vh; /* 50% of viewport height*/
  }
  .mh3 div {
    height: 20vh; /* 20% of viewport height*/
  }
</style>
