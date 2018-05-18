/* eslint-disable */
<template>
<div class="container-fluid">
  <div class="row info">
          <span>
            <label class="labelTxt">Client</label>
          </span>
          <span>
            <input id="firstName1" v-model="firstName"
                   onclick="setBorder('firstName1')" >
            <input id="lastName1" v-model="lastName"
                   onclick="setBorder('lastName1')" >
          </span>

          <span>
            <label class="labelTxt">Applicant Info</label>
          </span>
          <span>
            <input id="firstName1A" v-model="firstName"
                   onclick="setBorder('firstName1')" >
            <input id="lastName1A" v-model="lastName"
                   onclick="setBorder('lastName1')" >
          </span>
          <span>
              <input id="address1" v-model="address"
                   onclick="setBorder('address1')" >
          </span>
          <span>
               <label class="labelTxt">email:</label>
                <input id="email1" v-model="conEmail"
                  onclick="setBorder('email1')">
          </span>

          <div class="divSpce">
            <label class="labelTxt">Contact</label>
            <input id="firstName1C" v-model="firstName"
                   onclick="setBorder('firstName1')" >
            <input id="lastName1C" v-model="lastName"
                   onclick="setBorder('lastName1')" >
          </div>

  </div>
</div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ClientInfo',
    computed: {
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
   .info {
      background-color: #f1f1f1;
      text-align: right;
      border: 1px solid #eee;
      padding: 0px;
      box-shadow: 0 2px 3px #ccc;
     height: 300px;
  }
  .labelTxt {
  }
  .divSpce {
    padding: 3px;
    align-items: right;
  }
</style>

