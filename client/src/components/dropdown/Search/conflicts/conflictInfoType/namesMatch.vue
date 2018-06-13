/* eslint-disable */
<template>
  <span>
      <h3>Client</h3>
      <p>{{ CONFLICTclientFirstName }} {{ CONFLICTclientLastName}}</p>

      <h3>Applicant Info</h3>
      <p>{{ CONFLICTfirstName }} {{ CONFLICTmiddleName }} {{ CONFLICTlastName }}</p>
      <p>{{ CONFLICTaddressLine1 }}</p>
      <p>{{ CONFLICTaddressLine2 }}</p>
      <p>{{ CONFLICTaddressLine3 }}</p>
      <p>{{ CONFLICTcity }}, {{ CONFLICTprovince }}</p>
      <p>{{ CONFLICTpostalCode }}</p>
      <p>{{ CONFLICTcountry }}</p>

      <div class="row">
        <div v-if="CONFLICTphone" class="col add-top-padding">
          <h3>Phone</h3>
          <p>{{ CONFLICTphone }}</p>
        </div>
        <div v-if="CONFLICTfax" class="col add-top-padding">
          <h3>Fax</h3>
          <p>{{ CONFLICTfax }}</p>
        </div>
      </div>

      <h3>Email</h3>
      <p>{{ CONFLICTconEmail }}</p>

      <h3>Contact</h3>
      <p>{{ CONFLICTcontactName }}</p>
      <input type="hidden" v-model="currentMatch" />
  </span>

</template>

<script>
/* eslint-disable */
  export default {
    name: 'ClientInfo',
    computed: {
      CONFLICTclientFirstName: {
        get: function() {
          return this.$store.getters.clientFirstName;
        },
        set: function(value) {
          this.$store.commit('clientFirstName', value);
        }
      },
      CONFLICTclientLastName: {
        get: function() {
          return this.$store.getters.clientLastName;
        },
        set: function(value) {
          this.$store.commit('clientLastName', value);
        }
      },
      CONFLICTfirstName: {
        get: function() {
          return this.$store.getters.firstName;
        },
        set: function(value) {
          this.$store.commit('firstName', value);
        }
      },
      CONFLICTmiddleName: {
        get: function() {
          return this.$store.getters.middleName;
        },
        set: function(value) {
          this.$store.commit('middleName', value);
        }
      },
      CONFLICTlastName: {
        get: function() {
          return this.$store.getters.lastName;
        },
        set: function(value) {
          this.$store.commit('lastName', value);
        }
      },
      CONFLICTaddressLine1: {
        get: function() {
          return this.$store.getters.addressLine1;
        },
        set: function(value) {
          this.$store.commit('addressLine1', value);
        }
      },
      CONFLICTaddressLine2: {
        get: function() {
          return this.$store.getters.addressLine2;
        },
        set: function(value) {
          this.$store.commit('addressLine2', value);
        }
      },
      CONFLICTaddressLine3: {
        get: function() {
          return this.$store.getters.addressLine3;
        },
        set: function(value) {
          this.$store.commit('addressLine3', value);
        }
      },
      CONFLICTcity: {
        get: function() {
          return this.$store.getters.city;
        },
        set: function(value) {
          this.$store.commit('city', value);
        }
      },
      CONFLICTprovince: {
        get: function() {
          return this.$store.getters.province;
        },
        set: function(value) {
          this.$store.commit('province', value);
        }
      },
      CONFLICTcountry: {
        get: function() {
          return this.$store.getters.country;
        },
        set: function(value) {
          this.$store.commit('country', value);
        }
      },
      CONFLICTpostalCode: {
        get: function() {
          return this.$store.getters.postalCode;
        },
        set: function(value) {
          this.$store.commit('postalCode', value);
        }
      },
      CONFLICTcontactName: {
        get: function() {
          return this.$store.getters.contactName;
        },
        set: function(value) {
          this.$store.commit('contactName', value);
        }
      },
      CONFLICTphone: {
        get: function() {
          return this.$store.getters.phone;
        },
        set: function(value) {
          this.$store.commit('phone', value);
        }
      },
      CONFLICTconEmail: {
        get: function() {
          return this.$store.getters.conEmail;
        },
        set: function(value) {
          this.$store.commit('conEmail', value);
        }
      },
      CONFLICTfax: {
        get: function() {
          return this.$store.getters.fax;
        },
        set: function(value) {
          this.$store.commit('fax', value);
        }
      },
      currentMatch() {
        return this.$store.getters.currentMatch;
      }
    },
    methods: {
    },
  }
</script>

<style scoped>
</style>


