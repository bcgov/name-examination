<!--eslint-disable -->
<template>
  <v-container ma-0 pt-0 pb-3 px-3 fluid align-start>
    <v-layout align-items-start>
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
        <v-flex header-mg lg3 item-heading>Submit Count</v-flex>
        <v-flex header-mg lg9>{{ submitCount }}</v-flex>
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
        <template v-for="comment in comments">
          <div>{{ comment.comment }}</div>
          <div class="ml-3 ft-ital mb-2">{{ comment.examiner + ' - ' + formatDate(comment.timestamp)}}</div>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'namesMatch',
    computed: {
      currentConflictName() {
        let currentConflict = this.$store.getters.currentConflict;
        if (currentConflict != null)
          return currentConflict.text;
        else
          return "";
      },
      clientFirstName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.clientFirstName == undefined) return '';
          return this.namesConflictInfo.applicants.clientFirstName
      },
      clientLastName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.clientLastName == undefined) return '';
          return this.namesConflictInfo.applicants.clientLastName
      },
      firstName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.firstName == undefined) return '';
          return this.namesConflictInfo.applicants.firstName
      },
      middleName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.middleName == undefined) return '';
          return this.namesConflictInfo.applicants.middleName
      },
      lastName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.lastName == undefined) return '';
          return this.namesConflictInfo.applicants.lastName
      },
      addressLine1() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.addrLine1 == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine1
      },
      addressLine2() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.addrLine2 == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine2
      },
      addressLine3() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.addrLine3 == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine3
      },
      city() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.city == undefined) return '';
          return this.namesConflictInfo.applicants.city
      },
      province() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.stateProvinceCd == undefined) return '';
          return this.namesConflictInfo.applicants.stateProvinceCd
      },
      country() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.countryTypeCd == undefined) return '';
          return this.namesConflictInfo.applicants.countryTypeCd
      },
      postalCode() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.postalCd == undefined) return '';
        return this.namesConflictInfo.applicants.postalCd

      },
      contactName() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.contact == undefined) return '';
          return this.namesConflictInfo.applicants.contact
      },
      phone() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.phoneNumber == undefined) return '';
          return this.namesConflictInfo.applicants.phoneNumber
      },
      conEmail() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.emailAddress == undefined) return '';
          return this.namesConflictInfo.applicants.emailAddress
      },
      fax() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.applicants == undefined ||
            this.namesConflictInfo.applicants.faxNumber == undefined) return '';
          return this.namesConflictInfo.applicants.faxNumber
      },
      submittedDate() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.submittedDate == undefined) return '';
          return new Date(this.namesConflictInfo.submittedDate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
      },
      nrNum() {
        if (this.namesConflictInfo == undefined) return '';
        return this.namesConflictInfo.nrNum;
      },
      namesConflictInfo() {
        return this.$store.getters.namesConflictJSON;
      },
      decisionText() {
        if (this.namesConflictInfo == undefined) return '';

        // get decision text for this particular name choice
        for (let i = 0; i < this.namesConflictInfo.names.length; i++) {
          if (this.namesConflictInfo.names[i].name === this.currentConflictName &&
              this.namesConflictInfo.names[i].decision_text != '') {
            return this.namesConflictInfo.names[i].decision_text;
          }
        }
        return null;
      },
      conflicts() {
        if (this.namesConflictInfo == undefined) return [];

        // get all conflicts (up to 3) for this particular name choice
        var conflicts = [];
        for (let i = 0; i < this.namesConflictInfo.names.length; i++) {
          if (this.namesConflictInfo.names[i].name === this.currentConflictName) {
            if (![null, ''].includes(this.namesConflictInfo.names[i].conflict1)) conflicts.push(this.namesConflictInfo.names[i].conflict1);
            if (![null, ''].includes(this.namesConflictInfo.names[i].conflict2)) conflicts.push(this.namesConflictInfo.names[i].conflict2);
            if (![null, ''].includes(this.namesConflictInfo.names[i].conflict3)) conflicts.push(this.namesConflictInfo.names[i].conflict3);
          }
        }
        return conflicts;
      },
    },
    methods: {
    },
  }
</script>

<style scoped>
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


