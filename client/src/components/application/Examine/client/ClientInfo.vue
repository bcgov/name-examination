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
    name: 'ClientInfo',
    computed: {
      clientFirstName: {
        get: function() {
          return this.$store.getters.clientFirstName;
        },
        set: function(value) {
          this.$store.commit('clientFirstName', value);
        }
      },
      clientLastName: {
        get: function() {
          return this.$store.getters.clientLastName;
        },
        set: function(value) {
          this.$store.commit('clientLastName', value);
        }
      },
      firstName: {
        get: function() {
          return this.$store.getters.firstName;
        },
        set: function(value) {
          this.$store.commit('firstName', value);
        }
      },
      middleName: {
        get: function() {
          return this.$store.getters.middleName;
        },
        set: function(value) {
          this.$store.commit('middleName', value);
        }
      },
      lastName: {
        get: function() {
          return this.$store.getters.lastName;
        },
        set: function(value) {
          this.$store.commit('lastName', value);
        }
      },
      addressLine1: {
        get: function() {
          return this.$store.getters.addressLine1;
        },
        set: function(value) {
          this.$store.commit('addressLine1', value);
        }
      },
      addressLine2: {
        get: function() {
          return this.$store.getters.addressLine2;
        },
        set: function(value) {
          this.$store.commit('addressLine2', value);
        }
      },
      addressLine3: {
        get: function() {
          return this.$store.getters.addressLine3;
        },
        set: function(value) {
          this.$store.commit('addressLine3', value);
        }
      },
      city: {
        get: function() {
          return this.$store.getters.city;
        },
        set: function(value) {
          this.$store.commit('city', value);
        }
      },
      province: {
        get: function() {
          return this.$store.getters.province;
        },
        set: function(value) {
          this.$store.commit('province', value);
        }
      },
      country: {
        get: function() {
          return this.$store.getters.country;
        },
        set: function(value) {
          this.$store.commit('country', value);
        }
      },
      postalCode: {
        get: function() {
          return this.$store.getters.postalCode;
        },
        set: function(value) {
          this.$store.commit('postalCode', value);
        }
      },
      contactName: {
        get: function() {
          return this.$store.getters.contactName;
        },
        set: function(value) {
          this.$store.commit('contactName', value);
        }
      },
      phone: {
        get: function() {
          return this.$store.getters.phone;
        },
        set: function(value) {
          this.$store.commit('phone', value);
        }
      },
      conEmail: {
        get: function() {
          return this.$store.getters.conEmail;
        },
        set: function(value) {
          this.$store.commit('conEmail', value);
        }
      },
      fax: {
        get: function() {
          return this.$store.getters.fax;
        },
        set: function(value) {
          this.$store.commit('fax', value);
        }
      },
    },
    methods: {
    }
  }
</script>

<style scoped>
  h2, h3 {
    font-size: 15px;
  }
  p {
    font-size: 14px;
  }
</style>


