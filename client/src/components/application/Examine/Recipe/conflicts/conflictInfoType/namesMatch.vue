<!--eslint-disable -->
<template>
  <span>
      <br/>
      <h3>Client</h3>
      <p>{{ clientFirstName }} {{ clientLastName}}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ addressLine1 }}</p>
      <p>{{ addressLine2 }}</p>
      <p>{{ addressLine3 }}</p>
      <p>{{ city }}, {{ province }}</p>
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
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.clientFirstName

      },
      clientLastName() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.clientLastName
      },
      firstName() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.firstName

      },
      middleName() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.middleName

      },
      lastName() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.lastName

      },
      addressLine1() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine1

      },
      addressLine2() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine2

      },
      addressLine3() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.addrLine3

      },
      city() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.city

      },
      province() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.statePprovinceCd

      },
      country() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.countryTypeCd

      },
      postalCode() {
          if (this.namesConflictInfo == undefined) return '';
        return this.namesConflictInfo.applicants.postalCd

      },
      contactName() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.contact

      },
      phone() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.phoneNumber

      },
      conEmail() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.emailAddress

      },
      fax() {
          if (this.namesConflictInfo == undefined) return '';
          return this.namesConflictInfo.applicants.faxNumber

      },
      namesConflictInfo() {
        console.log(this.$store.getters.historiesJSON);
        return this.$store.getters.historiesJSON;
      }
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>


