/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="namePage">

        <div v-if="details" class="RequestInfoHeader">
          <div class="row mh1" >
            <div class="col" ><requestinfoheaderview /></div>
          </div>
          <div class="row mh1" >
            <div class="col" ><requestinfoview /></div>
          </div>
        </div>
        <div v-else class="RequestInfoHeader">
          <div class="row mh1" >
            <div class="col" ><requestinfoheaderview /></div>
          </div>
        </div>
        <div class="row mh3" >
          <div class="col"><compnameview /></div>
        </div>

        <div class="row mh4">
          <div class="col-2 mid"><compmatches /></div>
          <div class="col"><matchissues /></div>
        </div>

        <div class="row mh5">
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
    computed: {
      details() {
        return this.$store.getters.details;
      }
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
    height: 150%;
  }
  .mh0 div {
    height: 0px; /* 30% of viewport height*/
  }
  .mh1 div {
    height: 20%; /* 30% of viewport height*/
  }
  .mh2 div {
    height: 40%; /* 50% of viewport height*/
  }
  .mh3 div {
    height: 20%; /* 20% of viewport height*/
  }
  .mh4 div {
    height: 30%; /* 20% of viewport height*/
  }
  .mh5 div {
    height: 15%; /* 20% of viewport height*/
  }
  .RequestInfoHeader {
    align-content: left;
    border: 2px solid #eee;
    padding: 1px;
    box-shadow: 0 2px 3px #ccc;
  }
</style>
