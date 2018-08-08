<!--eslint-disable-->
<template>

  <span v-if="show_extended_header">
    <h3>Client</h3>

    <!-- VIEW -->
    <span v-if="!is_editing">
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


    <!-- EDIT -->
    <span v-else>
      <div class="form-row">
        <div class="col">
          <input type="text" class="form-control " id="firstName1"
                 v-model="clientFirstName" placeholder="First Name" />
        </div>
        <div class="col">
          <input type="text" class="form-control " id="lastName1"
                 v-model="clientLastName" placeholder="Last Name"/>
        </div>
      </div>

      <h3>Applicant Info</h3>

      <div class="form-row">
        <div class="col add-top-padding" :class="{'form-group-error': $v.firstName.$error}">
          <input class="form-control " v-model="firstName"
                 placeholder="First Name" :change="$v.firstName.$touch()" />
        </div>
        <div class="col add-top-padding">
          <input class="form-control " v-model="middleName"
                 placeholder="Middle Name"/>
        </div>
        <div class="col add-top-padding" :class="{'form-group-error': $v.lastName.$error}">
          <input class="form-control " v-model="lastName"
                 placeholder="Last Name" :change="$v.lastName.$touch()" />
        </div>
      </div>

      <h3>Address</h3>
      <span :class="{'form-group-error': $v.addressLine1.$error}">
        <input class="form-control " v-model="addressLine1"
               placeholder="Address" :change="$v.addressLine1.$touch()" />
      </span>
      <input class="form-control " v-model="addressLine2"
             placeholder="Address" />
      <input class="form-control " v-model="addressLine3"
             placeholder="Address" />

      <div class="form-row">
        <div class="col" :class="{'form-group-error': $v.city.$error}">
          <input class="form-control " v-model="city"
                 placeholder="City" :change="$v.city.$touch()" />
        </div>
        <div class="col" :class="{'form-group-error': $v.province.$error}">
          <input class="form-control " v-model="province"
                 placeholder="State/Province" :change="$v.province.$touch()" />
        </div>
      </div>

      <div class="form-row">
        <div class="col" :class="{'form-group-error': $v.postalCode.$error}">
          <input class="form-control " v-model="postalCode"
                 placeholder="Postal Code" :change="$v.postalCode.$touch()" />
        </div>
        <div class="col" :class="{'form-group-error': $v.country.$error}">
          <!-- TODO - dropdown for country? from jurisdiction list 2? -->
          <input class="form-control " v-model="country"
                 placeholder="Country (2-CHAR CODE)" :change="$v.country.$touch()" />
        </div>
      </div>

      <div class="form-row">
        <div class="col add-top-padding" :class="{'form-group-error': $v.phone.$error}">
          <h3>Phone</h3>
          <input type="text" class="form-control " v-model="phone" :change="$v.phone.$touch()" />
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
  import { required } from 'vuelidate/lib/validators'

  export default {
    name: 'ClientInfoHeader',
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
    validations: {
      firstName: { required },
      lastName: { required },
      addressLine1: { required },
      city: { required },
      province: { required },
      country: { required },
      postalCode: { required },
      phone: { required },
    },
    methods: {
    }
  }
</script>

<style scoped>
</style>


