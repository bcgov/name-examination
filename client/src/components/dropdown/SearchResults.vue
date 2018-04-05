/* eslint-disable */
<template>
  <div>
    <!--search-Results-view></search-Results-view -->

  <div class="container">

    <div class="row mh0" >
      <div class="col-8"><requestinfoview /></div>
    </div>

    <div class="row mh1" >
      <div class="col"><compnameview /></div>
    </div>

    <div class="row mh2">
      <div class="col-3"><compmatches /></div>
      <div class="col"><matchissues v-on:click="visble = !visble" /></div>
     </div>

    <div class="row mh3">
      <div class="col"><examinationmenu /></div>
    </div>

  </div>

  </div>
</template>

<script>
/* eslint-disable */
  import requestinfoview from '@/components/dropdown/search/RequestInfo.vue';
  import compnameview from '@/components/dropdown/search/CompName.vue';
  import compmatches from '@/components/dropdown/search/NameMatches.vue';
  import matchissues from '@/components/dropdown/search/IssueInfo.vue';
  import examinationmenu from '@/components/dropdown/search/ExaminationMenu.vue';

  export default {
    name: "SearchResults",
    data:{
      visble: true
    },
    components: {
      requestinfoview,
      compnameview,
      compmatches,
      matchissues,
      examinationmenu
    },
  }
</script>

<style scoped>
  .mh0 div {
    height: 25%; /* 30% of viewport height*/
  }
  .mh1 div {
    height: 30%; /* 30% of viewport height*/
  }
  .mh2 div {
    height: 30%; /* 50% of viewport height*/
  }
  .mh3 div {
    height: 15%; /* 20% of viewport height*/
  }
</style>
