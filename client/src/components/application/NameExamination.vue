<!--eslint-disable-->
<template>
  <div>
    <div class="upper-section container-fluid">

      <div class="namePage" >

        <div class="RequestInfoHeader">
          <requestinfoheaderview />
        </div>
      </div>
    </div>

    <div class="lower-section container-fluid">

      <div class="alert alert-warning examiner-warning"
           v-if="currentState == 'INPROGRESS' && examiner != userId && auth">
        This NR is being examined by {{ examiner }}.
      </div>

      <div id="exact-history-match-banner" class="examiner-warning"
           v-if="this.exactHistoryMatches">
        Similar name previously <b>{{ exactMatch }}</b>
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
  import stateheaderview from '@/components/application/sections/StateHeader.vue';
  import requestinfoheaderview from '@/components/application/Examine/RequestInfoHeader.vue';
  import compnameview from '@/components/application/Examine/CompName.vue';
  import recipemenu from '@/components/application/Examine/RecipeMenu.vue';
  import matchissues from '@/components/application/Examine/IssueInfo.vue';
  import decision from '@/components/application/Examine/Decision.vue';

  export default {
    name: "SearchResults",
    data: function () {
        return {
          visible: true,
          exactMatch: null,
          model: false,
        }
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      },
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

        // initialize to reset any previous value
        this.exactMatch = null;

        try {
          var currentName = this.$store.getters.currentName.toUpperCase();
          // check for exact matches in history for alert re. previous submissions
          if (this.historiesJSON != null) {

            let exactMatches = this.historiesJSON.names.filter(function (record) {
                                return currentName == record.name.toUpperCase();
                              });

            for (let i=0; i<exactMatches.length; i++) {
              if (exactMatches[i].name_state_type_cd === 'R' || exactMatches[i].name_state_type_cd === 'REJECTED' || exactMatches[i].submit_count > 3) {
                this.exactMatch = 'REJECTED';
                return true;
              }
            }
            if (exactMatches.length > 0) {
              this.exactMatch = 'APPROVED';
              return true;
            }
          }
          return false;
        }
        catch(e) {
          return false;
        }
      },
    },
    components: {
      stateheaderview,
      requestinfoheaderview,
      compnameview,
      recipemenu,
      matchissues,
      decision,
    },
    watch: {
      exactMatch: function (val) {
        console.log('exactMatch watcher fired, ' + val)
        if (val == 'REJECTED')
          $("#exact-history-match-banner").addClass("alert alert-danger");
        else if (val == 'APPROVED')
          $("#exact-history-match-banner").addClass("alert alert-warning");
      },
      auth: {
        handler(selection) {
          if (auth != true) { this.$router.push("/Signin") }
        }
      }
    }
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
