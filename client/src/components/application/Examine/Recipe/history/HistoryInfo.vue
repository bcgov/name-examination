<!--eslint-disable-->
<template>
  <v-container fluid style="max-height: 450px;" ma-0 pt-0 mx-4 pr-5>
    <v-layout>
      <v-flex>
        <span>
          <h2 id="currentHistoryName">{{ selectedHistory }}</h2>
          <div v-if="selectedHistory" class="col client-info-view">

          <div class="add-top-padding">
            <h3>NR #</h3>
            <p>{{nrNum}}</p>

            <h3>Submitted</h3>
            <p>{{ submittedDate }}</p>
          </div>

          <h3>Client</h3>
          <p>{{ clientFirstName }} {{ clientLastName}}</p>

          <h3>Applicant Info</h3>
          <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
          <p>{{ addressLine1 }}</p>
          <p>{{ addressLine2 }}</p>
          <p>{{ addressLine3 }}</p>
          <p>{{ city }} {{ province }}{{ postalCode }}</p>
          <p>{{ country }}</p>

          <div class="row">
            <div v-if="phone" class="col add-top-padding">
              <h3>Phone</h3>
              <p>{{ phone }}</p>
            </div>
            <div v-if="fax" class="col add-top-padding">
              <h3>Fax</h3>
              <p>{{ fax }}</p>
            </div>
          </div>

          <h3 v-if="conEmail">Email</h3>
          <p>{{ conEmail }}</p>

          <h3>Contact</h3>
          <p>{{ contactName }}</p>
          <h3>Submit Count: {{submitCount}}</h3>
          <h3>Name State</h3>
          <p>{{nameState}}</p>

          <h3 v-if="decisionText">Decision Text</h3>
          <p v-if="decisionText">{{ decisionText }}</p>

          <h3 v-if="conflicts.length > 0">Conflicts</h3>
          <p v-for="conflict in conflicts">{{ conflict }}</p>


          <br />
          <div>
            <h3>Comments</h3>
            <div class="comment-box" v-if="comments">
              <p v-for="comment in comments">
                <span class="comment-examiner">{{ comment.examiner }}</span>
                :<br />
                <span class="comment-timestamp">{{ comment.timestamp }}</span>
                <span class="comment-text">{{ comment.comment }}</span>
              </p>
            </div>
          </div>
         </div>
          <div v-else class="add-top-padding">
            <NullMatch />
          </div>
        </span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import NullMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/NullMatch.vue';

  export default {
    name: 'HistoryInfo',
    components: {
      NullMatch
    },
    computed: {
      selectedHistory() {
        if (this.$store.getters.currentHistory == undefined) return '';
        return this.$store.getters.currentHistory.name;
      },
      clientFirstName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.clientFirstName

      },
      clientLastName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.clientLastName
      },
      firstName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.firstName

      },
      middleName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.middleName

      },
      lastName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.lastName

      },
      addressLine1() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.addrLine1

      },
      addressLine2() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.addrLine2

      },
      addressLine3() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.addrLine3

      },
      city() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.city

      },
      province() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.stateProvinceCd

      },
      country() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.countryTypeCd

      },
      postalCode() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.postalCd

      },
      contactName() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.contact

      },
      phone() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.phoneNumber

      },
      conEmail() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.emailAddress

      },
      fax() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.applicants.faxNumber

      },
      submittedDate() {
        if (this.selectedHistoryInfo == undefined) return '';
        if (this.selectedHistoryInfo.submittedDate != null)
          return new Date(this.selectedHistoryInfo.submittedDate).toLocaleString('en-ca', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        return null

      },
      submitCount() {
        if (this.selectedHistoryInfo == undefined) return '';
        if (this.selectedHistoryInfo.submitCount == undefined) return 'NA';
        return this.selectedHistoryInfo.submitCount;
      },
      nrNum() {
        if (this.selectedHistoryInfo == undefined) return '';
        return this.selectedHistoryInfo.nrNum;
      },
      nameState() {
        if (this.selectedHistoryInfo == undefined) return '';
        for (let i = 0; i < this.selectedHistoryInfo.names.length; i++) {
          if (this.selectedHistoryInfo.names[i].name === this.selectedHistory)
            return this.selectedHistoryInfo.names[i].state;
        }
        return '';
      },
      decisionText() {
        if (this.selectedHistoryInfo == undefined) return null;

        // get decision text for this particular name choice
        for (let i = 0; i < this.selectedHistoryInfo.names.length; i++) {
          if (this.selectedHistoryInfo.names[i].name === this.selectedHistory &&
            this.selectedHistoryInfo.names[i].decision_text != '') {
            return this.selectedHistoryInfo.names[i].decision_text;
          }
        }
        return null;
      },
      conflicts() {
        if (this.selectedHistoryInfo == undefined) return [];

        // get all conflicts (up to 3) for this particular name choice
        var conflicts = [];
        for (let i = 0; i < this.selectedHistoryInfo.names.length; i++) {
          if (this.selectedHistoryInfo.names[i].name === this.selectedHistory) {
            if (![null, ''].includes(this.selectedHistoryInfo.names[i].conflict1)) conflicts.push(this.selectedHistoryInfo.names[i].conflict1);
            if (![null, ''].includes(this.selectedHistoryInfo.names[i].conflict2)) conflicts.push(this.selectedHistoryInfo.names[i].conflict2);
            if (![null, ''].includes(this.selectedHistoryInfo.names[i].conflict3)) conflicts.push(this.selectedHistoryInfo.names[i].conflict3);
          }
        }
        return conflicts;
      },
      comments() {
        if (this.selectedHistoryInfo == undefined || this.selectedHistoryInfo.comments == undefined
          || this.selectedHistoryInfo.comments.length < 1) return '';
        return this.selectedHistoryInfo.comments;
      },
      selectedHistoryInfo() {
        return this.$store.getters.historiesInfoJSON;
      }
    },
    methods: {},
  }
</script>

<style scoped>
  .client-info-view {
    margin-left: 0;
    padding: 5px;
  }

  h3, h2 {
    font-size: 15px;
    color: var(--text);
    text-transform: capitalize !important;
    line-height: 1;
    margin: 12px 0 4px 0;
    padding: 0;
    font-weight: 600;
  }

  p, div {
    font-size: 14px;
    color: var(--text);
    line-height: 1;
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0 0 0 8px;
  }

  .comment-box {
    margin: 1px;
    background-color: lightyellow;
  }

  .comment-text {
    white-space: pre-line;
  }

  .comment-timestamp, .comment-examiner {
    font-style: italic;
  }
</style>
