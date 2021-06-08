<!--eslint-disable-->
<template>
  <v-container pt-0 pb-3 px-3 fluid align-start bg-color id="history-container">
    <spinner className="history-list-spinner" />
    <v-layout align-items-start class="history-list-layout">
      <v-layout wrap style="width: 45%" align-items-start>
        <v-flex item-heading>Client</v-flex>
        <v-flex lg9>{{ clientFirstName }} {{ clientLastName}}</v-flex>
        <v-flex header-mg lg3 item-heading>Applicant</v-flex>
        <v-flex header-mg lg9>
          <div class="item-detail">{{ firstName }} {{ lastName }}</div>
          <div class="item-detail">{{ addressLine1 }}</div>
          <div class="item-detail">{{ addressLine2 }}</div>
          <div class="item-detail">{{ addressLine3 }}</div>
          <div class="item-detail">{{ city }} {{ province }} {{ postalCode }} {{ country }}</div>
        </v-flex>
        <v-flex lg3 header-mg item-heading>Phone</v-flex>
        <v-flex header-mg lg9>{{ phone }}</v-flex>
        <v-flex header-mg lg3 item-heading>Email</v-flex>
        <v-flex header-mg lg9>{{ conEmail }}</v-flex>
        <v-flex header-mg lg3 item-heading>Contact</v-flex>
        <v-flex header-mg lg9>{{ contactName }}</v-flex>
      </v-layout>
      <v-layout wrap style="width: 55%;" align-items-start>
        <v-flex header-mg lg3 item-heading>Name State</v-flex>
        <v-flex header-mg lg9>{{nameState}}</v-flex>
        <v-flex lg12 header-mg v-if="conflicts.length > 0">
          <div class="item-heading item-detail">Decision:</div>
          <div class="ml-3 mt-1" v-for="(conflict, i) in conflicts">{{ `${i+1}. ${conflict}` }}</div>
        </v-flex>
        <v-flex lg12 header-mg v-if="decisionText">{{ decisionText }}</v-flex>
      </v-layout>
    </v-layout>
    <v-layout wrap v-if="comments.length > 0" align-items-start>
      <v-flex lg12 item-heading>Comments</v-flex>
      <v-flex lg12 ml-3>
      <template v-for="(comment, i) in comments">
        <div :key="'hi-comment-'+i">{{ comment.comment }}</div>
        <div :key="'hi-comment-'+i" class="ml-3 ft-ital mb-2">{{ comment.examiner + ' - ' +
                                                              formatDate(comment.timestamp)}}</div>
      </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import spinner from '@/components/application/spinner.vue'
  import NullMatch from '@/components/application/Examine/Recipe/conflicts/conflictInfoType/NullMatch.vue';
  import moment from 'moment'

  export default {
    name: 'HistoryInfo',
    components: { NullMatch, spinner },
    data() {
      return {}
    },
    mounted() {
      this.$el.scrollIntoViewIfNeeded()
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
    methods: {
      formatDate(timestamp) {
        return moment(timestamp, 'ddd, DD MMM YYYY HH:mm:ss zz').format('YYYY-MMM-dd')
      },
    },
  }
</script>

<style scoped>
  .history-list-spinner:not(.hidden) ~ .history-list-layout {
    display: none !important;
  }
  .item-heading {
    font-weight: 600 !important;
  }
  .header-mg {
    margin-top: 3px;
  }
  .bg-color {
    background-color: var(--xl-cyan);
  }

</style>
