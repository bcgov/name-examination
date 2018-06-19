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

        return this.corpConflictInfo.applicants.clientFirstName

      },
      clientLastName() {

        return this.corpConflictInfo.applicants.clientLastName

      },
      firstName() {

        return this.corpConflictInfo.applicants.firstName

      },
      middleName() {

        return this.corpConflictInfo.applicants.middleName

      },
      lastName() {

        return this.corpConflictInfo.applicants.lastName

      },
      addressLine1() {

        return this.corpConflictInfo.applicants.addressLine1

      },
      addressLine2() {

        return this.corpConflictInfo.applicants.addressLine2

      },
      addressLine3() {

        return this.corpConflictInfo.applicants.addressLine3

      },
      city() {

        return this.corpConflictInfo.applicants.city

      },
      province() {

        return this.corpConflictInfo.applicants.statePprovinceCd

      },
      country() {

        return this.corpConflictInfo.applicants.countryTypeCd

      },
      postalCode() {

        return this.corpConflictInfo.applicants.postalCd

      },
      contactName() {

        return this.corpConflictInfo.applicants.contact

      },
      phone() {

        return this.corpConflictInfo.applicants.phoneNumber

      },
      conEmail() {

        return this.corpConflictInfo.applicants.emailAddress

      },
      fax() {

        return this.corpConflictInfo.applicants.faxNumber

      },
      corpConflictInfo() {
        let tmp = this.$store.getters.corpConflictJSON
        if(tmp == null){
          // show this for testing
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


