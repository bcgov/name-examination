/* eslint-disable */
<template>
  <span v-if="show_extended_header">
    <h3>Client</h3>
    <span v-if="!is_editing">
      <p>{{ firstName}} {{ lastName }}</p>

      <h3>Applicant Info</h3>
      <p>{{ firstName }} {{ middleName }} {{ lastName }}</p>
      <p>{{ address }}</p>

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
    <span v-else>
          <div class="form-row">
            <div class="col">
              <input type="text" class="form-control " id="firstName1"
                     v-model="firstName" onclick="setBorder('firstName1')" >
            </div>
            <div class="col">
              <input type="text" class="form-control " id="lastName1"
                     v-model="lastName" onclick="setBorder('lastName1')" >
            </div>
          </div>

           <h3>Applicant Info</h3>

          <input id="firstName1A" class="form-control " v-model="firstName"
                 onclick="setBorder('firstName1')" >
          <input id="lastName1A" class="form-control " v-model="lastName" />
          <input id="address1" class="form-control " v-model="address" />

          <div class="form-row">
            <div class="col add-top-padding">
              <h3>Phone</h3>
              <input type="text" class="form-control " v-model="phone" />
            </div>
            <div class="form-group col add-top-padding">
              <h3>Fax</h3>
              <input type="text" class="form-control " v-model="fax" />
            </div>
          </div>

          <h3>email</h3>
          <input id="email1" class="form-control " v-model="conEmail" />

          <h3>Contact</h3>
          <input id="firstName1C" class="form-control " v-model="contactName" />


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
      show_extended_header() {
        return this.is_editing || this.$store.getters.is_header_shown;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      firstName: {
        get: function() {
          return this.$store.getters.firstName;
        },
        set: function(value) {
          this.$store.commit('firstName', value);
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
      address: {
        get: function() {
          return this.$store.getters.address;
        },
        set: function(value) {
          this.$store.commit('address', value);
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
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
      }
    }
  }
</script>

<style scoped>
</style>


