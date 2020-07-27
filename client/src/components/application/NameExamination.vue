<!--eslint-disable-->
<template>
  <fragment name="namex-fragment">
    <div class="notice-banner being-examined"
         v-if="(currentState == 'INPROGRESS') && (examiner != userId) && auth">
      <v-icon class="notice-icon">lock</v-icon>This NR is being examined by {{ examiner }}
    </div>
    <div class="notice-banner prev-rejected"
         v-if="this.exactHistoryMatches">
      <v-icon class="notice-icon">warning</v-icon>Similar name previously <b>{{ exactMatch }}</b>
    </div>
    <Transactions v-if="$store.state.transactionsModalVisible" />
    <CommentsPopUp v-if="showCommentsPopUp" />
    <v-container fluid name-exam-container v-if="showExaminationArea">
      <v-layout>
          <RequestInfoHeader />
      </v-layout>
      <v-layout v-if="!is_editing" wrap>
        <v-flex lg12><CompName /></v-flex>
      </v-layout>
    </v-container>
  </fragment>
</template>

<script>
/* eslint-disable */
  import CommentsPopUp from '@/components/application/Examine/CommentsPopUp'
  import CompName from '@/components/application/Examine/CompName.vue';
  import RequestInfoHeader from '@/components/application/Examine/RequestInfoHeader.vue';
  import Transactions from './Transactions'

  export default {
    name: "NameExanination",
    data() {
      return {
        exactMatch: null,
        model: false,
        visible: true,
      }
    },
    components: { Transactions, CommentsPopUp, CompName, RequestInfoHeader, },
    computed: {
      stated() {
        return this.$store
      },
      auth() {
        return this.$store.getters.isAuthenticated
      },
      details() {
        return this.$store.getters.details
      },
      is_making_decision() {
        return this.$store.getters.is_making_decision
      },
      is_complete() {
        return this.$store.getters.is_complete
      },
      is_editing() {
        return  this.$store.state.is_editing
      },
      examiner() {
        return this.$store.getters.examiner
      },
      userId() {
        return this.$store.getters.userId
      },
      currentState() {
        return this.$store.getters.currentState
      },
      historiesJSON() {
        return this.$store.getters.historiesJSON
      },
      is_viewing() {
        return this.is_editing || this.$store.state.is_header_shown
      },
      is_expanded() {
        if (this.is_editing || this.is_viewing) return true
        return false
      },
      showExaminationArea () {
        return this.$store.state.showExaminationArea
      },
      exactHistoryMatches() {
        // initialize to reset any previous value
        this.exactMatch = null;

        try {
          var currentName = this.$store.getters.currentName.toUpperCase()
          // check for exact matches in history for alert re. previous submissions
          if (this.historiesJSON != null) {

            let exactMatches = this.historiesJSON.names.filter(function (record) {
                                return currentName == record.name.toUpperCase()
                              });

            for (let i=0; i<exactMatches.length; i++) {
              if (exactMatches[i].name_state_type_cd === 'R' || exactMatches[i].name_state_type_cd === 'REJECTED' || exactMatches[i].submit_count > 3) {
                this.exactMatch = 'REJECTED'
                return true
              }
            }
            if (exactMatches.length > 0) {
              this.exactMatch = 'APPROVED'
              return true
            }
          }
          return false;
        }
        catch(e) {
          return false;
        }
      },
      showCommentsPopUp() {
        if (this.$store.state.showCommentsPopUp) {
          return this.$store.state.showCommentsPopUp
        }
        return false
      },
    },
    watch: {
      exactMatch(val) {
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
  .being-examined {
    background-color: var(--xl-cyan);
    border-bottom: 1px solid var(--l-cyan);
  }

  .name-exam-container {
    margin: 0;
    padding: 0;
    background-color: white;
    position: absolute !important;
  }

  .notice-banner {
    position: relative;
    padding: 8px 0px 25px 8px;
    height: 42px;
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    z-index: 999;
    box-shadow: inset 0px -16px 16px -10px white, 0 4px 4px -4px rgba(0, 0, 0, 0.4);
  }

  .notice-icon {
    position: relative;
    top: 2px;
    font-size: 22px;
    margin: 0 5px 0 20px;
  }

  .prev-rejected {
    background-color: var(--xl-red);
    border-bottom: 1px solid var(--l-red);
  }

</style>
