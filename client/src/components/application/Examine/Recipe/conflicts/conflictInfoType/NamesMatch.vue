<!--eslint-disable -->
<template>
  <span>
      <h3>NR #</h3>
      <p>{{nrNum}}</p>

      <h3>Submitted</h3>
      <p>{{submittedDate}}</p>

      <h3>Client</h3>
      <p>{{ clientFirstName }} {{ clientLastName}}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ addressLine1 }}</p>
      <p>{{ addressLine2 }}</p>
      <p>{{ addressLine3 }}</p>
      <p>{{ city }} {{ province }} {{ postalCode }}, {{ country }}</p>

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

      <h3>Email</h3>
      <p>{{ conEmail }}</p>

      <h3>Contact</h3>
      <p>{{ contactName }}</p>

      <h3 v-if="decisionText">Decision Text</h3>
      <p v-if="decisionText">{{decisionText}}</p>

      <h3 v-if="conflicts.length > 0">Conflicts</h3>
      <p v-for="conflict in conflicts">{{ conflict }}</p>

  </span>

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

</style>


