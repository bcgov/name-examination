/* eslint-disable */
<template>
  <span>
      <h3>Client</h3>
      <p>{{ clientFirstName }} {{ clientLastName}}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ addressLine1 }}</p>
      <p>{{ addressLine2 }}</p>
      <p>{{ addressLine3 }}</p>
      <p>{{ city }}, {{ CONFLICTprovince }}</p>
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

          return this.namesConflictInfo.applicants.clientFirstName

      },
      clientLastName() {
          return this.namesConflictInfo.applicants.clientLastName
      },
      firstName() {

          return this.namesConflictInfo.applicants.firstName

      },
      middleName() {

          return this.namesConflictInfo.applicants.middleName

      },
      lastName() {

          return this.namesConflictInfo.applicants.lastName

      },
      addressLine1() {

          return this.namesConflictInfo.applicants.addrLine1

      },
      addressLine2() {

          return this.namesConflictInfo.applicants.addrLine2

      },
      addressLine3() {

          return this.namesConflictInfo.applicants.addrLine3

      },
      city() {

          return this.namesConflictInfo.applicants.city

      },
      province() {

          return this.namesConflictInfo.applicants.statePprovinceCd

      },
      country() {

          return this.namesConflictInfo.applicants.countryTypeCd

      },
      postalCode() {

        return this.namesConflictInfo.applicants.postalCd

      },
      contactName() {

          return this.namesConflictInfo.applicants.contact

      },
      phone() {

          return this.namesConflictInfo.applicants.phoneNumber

      },
      conEmail() {

          return this.namesConflictInfo.applicants.emailAddress

      },
      fax() {

          return this.namesConflictInfo.applicants.faxNumber

      },
      namesConflictInfo() {
        let tmp = this.$store.getters.namesConflictJSON
        if(tmp == null){
          tmp = this.$store.getters.nrData
        }
        return tmp
      }
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>


