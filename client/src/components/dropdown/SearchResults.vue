/* eslint-disable */
<template>
  <div>
    <div class="upper-section container-fluid">
      <div class="namePage">

        <div v-if="details" class="RequestInfoHeader">
          <requestinfoheaderview />
          <requestinfoview />
        </div>
        <div v-else class="RequestInfoHeader">
          <requestinfoheaderview />
        </div>
      </div>
    </div>

    <div class="lower-section container-fluid">
      <div class="namePage">
        <div class="row" >
          <div class="col"><compnameview /></div>
        </div>

        <div class="row">
          <compmatches />
          <div class="col"><matchissues /></div>
        </div>

        <div class="row">
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
</style>
