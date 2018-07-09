/* eslint-disable */
<template>
  <div>
    <div class="upper-section container-fluid">
      <div class="namePage">

        <div class="RequestInfoHeader">
          <requestinfoheaderview />
        </div>
      </div>
    </div>

    <div class="lower-section container-fluid">

      <!-- msg re. in progress with someone else -->
      <div id="examiner-warning" class="alert alert-warning"
           v-if="currentState == 'INPROGRESS' && examiner != userId">
        This NR is being examined by {{ examiner }}.
      </div>


     <div class="namePage">
       <div class="row" >
         <div class="col"><compnameview /></div>
       </div>

       <decision v-if="is_making_decision" />
       <div class="row" v-else-if="!is_complete">
         <compmatches />
         <div class="col"><matchissues /></div>
       </div>


     </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
  import requestinfoheaderview from '@/components/application/Examine/RequestInfoHeader.vue';
  import compnameview from '@/components/application/Examine/CompName.vue';
  import compmatches from '@/components/application/Examine/NameMatches.vue';
  import matchissues from '@/components/application/Examine/IssueInfo.vue';
  import decision from "@/components/Decision";

  export default {
    name: "SearchResults",
    data: function ()
    {
      return {
        visible: true
      }
    },
    computed: {
      details() {
        return this.$store.getters.details;
      },
      is_making_decision() {
        return this.$store.getters.is_making_decision;
      },
      is_complete() {
        return this.$store.getters.is_complete;
      },
      examiner() {
        return this.$store.getters.examiner;
      },
      userId() {
        return this.$store.getters.userId;
      },
      currentState() {
        return this.$store.getters.currentState;
      },
    },
    components: {
      requestinfoheaderview,
      compnameview,
      compmatches,
      matchissues,
      decision,
    },
  }
</script>

<style scoped>
  .namePage > .row {
    margin-top: 10px;
  }

  #examiner-warning {
    margin-left: -15px;
    margin-right: -15px;
    border-radius: unset;
  }
</style>
