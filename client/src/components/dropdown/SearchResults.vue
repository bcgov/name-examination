/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="namePage">

        <div class="row mh0" >
          <div class="col" ><requestinfoheaderview /></div>
        </div>

        <div class="row mh1" >
          <div class="col" ><requestinfoview /></div>
        </div>

        <div class="row mh2" >
          <div class="col"><compnameview /></div>
        </div>

        <div class="row mh3">
          <div class="col-2"><compmatches /></div>
          <div class="col"><matchissues /></div>
        </div>

        <div class="row mh4">
          <div class="col" ><examinationmenu /></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
  import requestinfoheaderview from '@/components/dropdown/Search/RequestInfoHeader.vue';
  import requestinfoview from '@/components/dropdown/Search/RequestInfo.vue';
  import compnameview from '@/components/dropdown/Search/CompName.vue';
  import compmatches from '@/components/dropdown/Search/NameMatches.vue';
  import matchissues from '@/components/dropdown/Search/IssueInfo.vue';
  import examinationmenu from '@/components/dropdown/Search/ExaminationMenu.vue';

  export default {
    name: "SearchResults",
    data:{
      visble: true
    },
    components: {
      requestinfoheaderview,
      requestinfoview,
      compnameview,
      compmatches,
      matchissues,
      examinationmenu
    },
  }
</script>

<style scoped>
  #namedPage {
    height: 100%;
  }
  .mh0 div {
    height: 25%; /* 30% of viewport height*/
  }
  .mh1 div {
    height: 20%; /* 30% of viewport height*/
  }
  .mh2 div {
    height: 30%; /* 50% of viewport height*/
  }
  .mh3 div {
    height: 30%; /* 20% of viewport height*/
  }
  .mh4 div {
    height: 15%; /* 20% of viewport height*/
  }
</style>
