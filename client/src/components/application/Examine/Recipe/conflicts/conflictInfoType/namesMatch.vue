<!--eslint-disable -->
<template>
  <span>
      <h3>Submitted</h3>
      <p>{{submittedDate}}</p>
      <h3>Client</h3>
      <p>{{ clientFirstName }} {{ clientLastName}}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ addressLine1 }}</p>
      <p>{{ addressLine2 }}</p>
      <p>{{ addressLine3 }}</p>
      <p>{{ city }} {{ province }}</p>
      <p>{{ postalCode }}</p>
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

      <h3>Email</h3>
      <p>{{ conEmail }}</p>

      <h3>Contact</h3>
      <p>{{ contactName }}</p>

  </span>

</template>

<script>
/* eslint-disable */
  export default {
    name: 'namesMatch',
    computed: {
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
      namesConflictInfo() {
        return this.$store.getters.namesConflictJSON;
      }
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>


