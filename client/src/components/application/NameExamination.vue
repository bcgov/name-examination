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
      <div class="alert alert-warning examiner-warning"
           v-if="currentState == 'INPROGRESS' && examiner != userId">
        This NR is being examined by {{ examiner }}.
      </div>

      <!-- msg re. exact history matches, ie: previous name submissions -->
      <div class="alert alert-danger examiner-warning"
           v-if="this.exactHistoryMatches !== null && this.exactHistoryMatches.length > 0">
        This name has been requested <b>{{ this.exactHistoryMatches.length }}</b>
        time<span v-if="this.exactHistoryMatches !== null && this.exactHistoryMatches.length > 1">s
      </span> previously.
      </div>


     <div class="namePage">
       <div class="row" >
         <div class="col"><compnameview /></div>
       </div>

       <decision v-if="is_making_decision" />
       <div class="row" v-else-if="!is_complete">
         <recipemenu />
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
  import recipemenu from '@/components/application/Examine/RecipeMenu.vue';
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
      historiesJSON() {
        return this.$store.getters.historiesJSON;
      },
      exactHistoryMatches() {
        var currentName = this.$store.getters.currentName.toUpperCase();
        // check for exact matches in history for alert re. previous submissions
        if (this.historiesJSON !== null && this.historiesJSON.names !== undefined) {
          return this.historiesJSON.names.filter(function (record) {
            return currentName == record.name.toUpperCase();
          });
        }
        return [];
      },
    },
    components: {
      requestinfoheaderview,
      compnameview,
      recipemenu,
      matchissues,
      decision,
    },
  }
</script>

<style scoped>
  .namePage > .row {
    margin-top: 10px;
  }

  .examiner-warning {
    margin-left: -15px;
    margin-right: -15px;
    border-radius: unset;
  }
</style>
