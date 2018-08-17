<!--eslint-disable-->
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

      <!-- error msgs from backend -->
      <div class="modal fade" id="error-message-modal" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div v-if="errorMsg != ''">
              <div class="modal-header modal-header-error" id="errorModalLabel">
                <h5 class="modal-title">ERROR</h5>
              </div>
              <div class="modal-body pre-line">
                <section><i>{{ errorMsg }}</i></section>
              </div>
            </div>
            <div v-if="warningMsg != ''">
              <div class="modal-header modal-header-warning" id="warningModalLabel">
                <h5 class="modal-title">WARNING</h5>
              </div>
              <div class="modal-body pre-line">
                <section><i>{{ warningMsg }}</i></section>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-primary"
                      data-dismiss="modal">Continue</button>
            </div>
          </div>
        </div>
      </div>
      <!-- msg re. in progress with someone else -->
      <div class="alert alert-warning examiner-warning"
           v-if="currentState == 'INPROGRESS' && examiner != userId">
        This NR is being examined by {{ examiner }}.
      </div>

      <!-- msg re. exact history matches, ie: previous name submissions -->
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
          errorMsg: '',
          warningMsg: '',
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
        try {
          var currentName = this.$store.getters.currentName.toUpperCase();
          // check for exact matches in history for alert re. previous submissions
          if (this.historiesJSON != null) {

            let exactMatches = this.historiesJSON.names.filter(function (record) {
                                return currentName == record.name.toUpperCase();
                              });

            for (let i=0; i<exactMatches.length; i++) {
              if (exactMatches[i].name_state_type_cd === 'R' || exactMatches[i].submit_count > 3) {
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
      errorJSON() {
        return this.$store.getters.errorJSON
      },
    },
    components: {
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
      errorJSON: function(val) {
        console.log('errorJSON watcher fired')
        this.errorMsg = '';
        this.warningMsg = '';
        //if the errorJSON has new data populates the error/warning messages and triggers the popup
        if (val != null) {
          $('#error-message-modal').modal()
          let i;

          if (val.warnings != undefined) {
            for (i = 0; i < val.warnings.length; i++) {
              let msg = val.warnings[i].message;
              this.warningMsg += `${i + 1}) ` + msg + '\n';
            }
          }

          if (val.errors != undefined) {
            for (i = 0; i < val.errors.length; i++) {
              let error = Object.keys(val.errors[i].message)[0];
              let msg = val.errors[i].message[error][0];

              this.errorMsg += `${i + 1}) ` + error;
              this.errorMsg += ': ' + msg + '\n';
            }
          }

          if (val.message != undefined) {
            this.errorMsg = val.message;
          }
        }
      }
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

  .modal-header-error {
    background-color: #ea9999;
  }

  .modal-header-warning {
    background-color: #ffc107;
  }

  .pre-line {
    white-space: pre-line;
  }
</style>
