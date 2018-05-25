/* eslint-disable */
<template>
  <span class="ClientInfo">
    <h3>Client</h3>
    <span v-if="!is_editing">
      <p>{{ firstName}} {{ lastName }}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ address }}</p>

      <h3>Email</h3>
      <p>{{ conEmail }}</p>

      <h3>Contact</h3>
      <p>{{ firstName }} {{ lastName }}</p>

    </span>
    <span v-else>
          <div class="form-row">
            <div class="col">
              <input type="text" class="form-control form-control-sm" id="firstName1"
                     v-model="firstName" onclick="setBorder('firstName1')" >
            </div>
            <div class="col">
              <input type="text" class="form-control form-control-sm" id="lastName1"
                     v-model="lastName" onclick="setBorder('lastName1')" >
            </div>
          </div>

           <h3>Applicant Info</h3>

          <input id="firstName1A" class="form-control form-control-sm" v-model="firstName"
                 onclick="setBorder('firstName1')" >
          <input id="lastName1A" class="form-control form-control-sm" v-model="lastName"
                 onclick="setBorder('lastName1')" >
          <input id="address1" class="form-control form-control-sm" v-model="address"
                 onclick="setBorder('address1')" >

          <h3>email:</h3>
          <input id="email1" class="form-control form-control-sm" v-model="conEmail"
                 onclick="setBorder('email1')">

          <h3>Contact</h3>
          <input id="firstName1C" class="form-control form-control-sm" v-model="firstName"
                 onclick="setBorder('firstName1')" >
          <input id="lastName1C" class="form-control form-control-sm" v-model="lastName"
                 onclick="setBorder('lastName1')" >


    </span>
  </span>

</template>

<script>
/* eslint-disable */
  export default {
    name: 'ClientInfo',
    computed: {
      is_editing() {
        return this.$store.getters.is_editing;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      firstName() {
        return  this.$store.getters.firstName;
      },
      lastName() {
        return  this.$store.getters.lastName;
      },
      address() {
        return  this.$store.getters.address;
      },
      contactName() {
        return  this.$store.getters.contactName;
      },
      phone() {
        return  this.$store.getters.phone;
      },
      fax() {
        return  this.$store.getters.fax;
      },
      conEmail() {
        return  this.$store.getters.conEmail;
      }
    },
    methods: {
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
      }
    }
  }
</script>

<style scoped>
</style>


