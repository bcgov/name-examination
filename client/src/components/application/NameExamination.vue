<!--eslint-disable-->
<template>
  <fragment >
    <div class="alert alert-warning"
         v-if="(currentState == 'INPROGRESS') && (examiner != userId) && auth" >
      This NR is being examined by {{ examiner }}
    </div >
    <div id="exact-history-match-banner" class="ml-1 mb-0 alert alert-info"
         v-if="this.exactHistoryMatches" >Similar name previously <b >{{ exactMatch }}</b ></div >
    <comments-pop-up />
    <v-container fluid ma-0 pa-0 style="position: relative; background-color: white;" >
      <v-layout >
        <requestinfoheaderview />
      </v-layout >
    </v-container>
      <template v-if="!is_editing">
        <div style="position: relative; width: 100%; background-color: white;" >
        <div class="lower-section container-fluid" >
          <div class="namePage" v-if="!is_editing" >
            <div class="row" >
              <div class="col" style="background-color: white" >
                <compnameview />
              </div >
            </div >
            <decision v-if="is_making_decision" />
            <div class="row" v-else-if="!is_complete" >
              <recipemenu />
              <div class="col" >
                <matchissues />
              </div >
            </div >
          </div >
        </div>
        </div>
      </template>
  </fragment>
</template>

<script>
/* eslint-disable */
  import stateheaderview from '@/components/application/sections/StateHeader.vue';
  import requestinfoheaderview from '@/components/application/Examine/RequestInfoHeader.vue';
  import compnameview from '@/components/application/Examine/CompName.vue';
  import recipemenu from '@/components/application/Examine/RecipeMenu.vue';
  import matchissues from '@/components/application/Examine/IssueInfo.vue';
  import decision from '@/components/application/Examine/Decision.vue';
  import CommentsPopUp from './Examine/CommentsPopUp'

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
      is_editing() {
        return  this.$store.state.is_editing;
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
      is_viewing() {
        return this.is_editing || this.$store.state.is_header_shown;
      },
      is_expanded() {
        if (this.is_editing || this.is_viewing) return true
        return false
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
      CommentsPopUp,
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
  #info-header-container {
  }

  .white-bg {
    background-color: white !important;
  }

  .grey-bg {
    background-color: var(--xl-grey) !important;
  }

  .namePage > .row {
    margin-top: 10px;

  }
</style>
