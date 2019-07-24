<!--eslint-disable-->
<template>
  <v-flex>
    <v-container v-if="!is_editing" ma-0 pa-0>
      <v-layout wrap v-if="client_info_expanded || is_viewing" dk-grey fs-15>
        <v-flex lg12 fw-600>Client:</v-flex>
        <v-flex lg12>{{ clientFirstName }} {{ clientLastName }}</v-flex>
        <v-flex lg12 fw-600 mt-2>Applicant:</v-flex>
        <v-flex lg12>{{ firstName }} {{ lastName }}</v-flex>
        <v-flex lg12 mt-2 fw-600>Address:</v-flex>
        <v-flex v-if="addressLine1" lg12>{{ addressLine1 }}</v-flex>
        <v-flex v-if="addressLine2" lg12>{{ addressLine2 }}</v-flex>
        <v-flex v-if="addressLine3" lg12>{{ addressLine3 }}</v-flex>
        <v-flex lg12>{{ city }} {{ province }}</v-flex>
        <v-flex lg12>{{ postalCode }}</v-flex>
        <v-flex lg12>{{ country }}</v-flex>
        <v-flex mt-3 v-if="phone" lg12><span class="fw-600">Phone:</span> {{ phone }}</v-flex>
        <v-flex v-if="fax" lg12><span class="fw-600">Fax:</span> {{ fax }}</v-flex>
        <v-flex v-if="conEmail" lg12><span class="fw-600">Email:</span> {{ conEmail }}</v-flex>
        <v-flex mt-3 v-if="contactName" lg12 fw-600>Contact:</v-flex>
        <v-flex v-if="contactName" lg12>{{ contactName }}</v-flex>
      </v-layout>
      <v-layout wrap dk-grey v-else position-up>
        <v-flex lg12>{{ firstName }} {{ lastName }}</v-flex>
        <v-flex lg12>{{ addressLine1 }}</v-flex>
        <v-flex v-if="addressLine2" lg12>{{ addressLine2 }}</v-flex>
        <!--format to show only 4 lines of Applicant name + address.-->
        <v-flex v-if="!addressLine2 && !addressLine3" lg12>
          {{ city }} {{ province }} {{ postalCode }} {{ country }}
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-else id="applicant-form-container" field dk-grey>
      <v-form autocomplete="off" ma-0 pa-0>
        <v-layout wrap field dk-grey>
          <!--APPLICANT INFORMATION HEADING-->
          <v-flex lg12 field>
            <v-text-field class="applicant-info-field"
                          v-model="firstName"
                          placeholder="First name"
                          maxlength="200" />
          </v-flex>
          <v-flex lg12 field>
            <v-text-field class="applicant-info-field"
                          placeholder="Middle name"
                          v-model="middleName"
                          maxlength="200" />
          </v-flex>
          <v-flex lg12 section>
            <v-text-field class="applicant-info-field"
                          id="applicant-last-name"
                          @input="validateLastName"
                          v-model="lastName"
                          placeholder="Last name"
                          maxlength="200" />
            <v-flex lg12 c-priority v-if="errorText">{{ errorText }}</v-flex>
          </v-flex>
          <!--CLIENT HEADING-->
          <v-flex lg12 label>Client:</v-flex>
          <v-flex lg12 field>
            <v-text-field class="input-box-editing"
                          id="firstName1"
                          v-model="clientFirstName"
                          placeholder="First name"
                          maxlength="200" />
          </v-flex>
          <v-flex lg12 section>
            <v-text-field class="input-box-editing"
                          v-model="clientLastName"
                          id="lastName1"
                          placeholder="Last name"
                          maxlength="200" />
          </v-flex>
          <!--ADDRESS: LINES-->
          <v-flex lg12 label>Address:</v-flex>
          <v-flex lg12 field>
            <v-text-field class="applicant-info-field" v-model="addressLine1" maxlength="200" />
          </v-flex>
          <v-flex lg12 field>
            <v-text-field class="applicant-info-field" v-model="addressLine2" maxlength="200" />
          </v-flex>
          <v-flex lg12 field>
            <v-text-field class="applicant-info-field" v-model="addressLine3" maxlength="200" />
          </v-flex>
          <!--ADDRESS: CITY / PROVINCE-->
          <v-flex lg9 field-inline>
            <v-text-field class="applicant-info-field" v-model="city" maxlength="200" />
          </v-flex>
          <v-flex lg3 field>
            <v-text-field class="applicant-info-field" v-model="province" maxlength="2" />
          </v-flex>
          <!--ADDRESS: POSTAL CODE / COUNTRY-->
          <v-flex lg9 field-inline>
            <v-text-field class="applicant-info-field" v-model="postalCode" maxlength="20" />
          </v-flex>
          <v-flex lg3 section>
            <v-text-field class="applicant-info-field" v-model="country" maxlength="2" />
          </v-flex>
          <!--INLINE CONTACT HEADINGS-->
          <v-flex lg2 align-self-center inline-label>Phone:</v-flex>
          <v-flex lg10 pa-0 pl-1 ma-0>
            <v-text-field class="applicant-info-field" v-model="phone" maxlength="30" />
          </v-flex>
          <v-flex lg2 align-self-center inline-label>Fax:</v-flex>
          <v-flex lg10 pa-0 pl-1 ma-0>
            <v-text-field class="applicant-info-field" v-model="fax" maxlength="30" />
          </v-flex>
          <v-flex lg2 align-self-center inline-label>Email:</v-flex>
          <v-flex lg10 pa-0 pl-1 ma-0>
            <v-text-field id="email1" class="applicant-info-field" v-model="conEmail" maxlength="75" />
          </v-flex>
          <!--CONTACT HEADING-->
          <v-flex lg12 label field mt-1>Contact:</v-flex>
          <v-flex lg12 pa-0 ma-0>
            <v-text-field id="firstName1C" class="applicant-info-field" v-model="contactName" maxlength="200" />
          </v-flex>
          <v-layout justify-start row mt-4 pl-3>
            <v-flex>
              <v-btn id="nr-details-cancel-button"
                     class="ma-0 pa-0"
                     @click="clickCancel"
                     flat>
                <img src="static/images/buttons/cancel.png"
                     alt="Cancel Button" />
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn id="nr-details-save-button"
                     @click="clickSave"
                     :disabled="errorText.length !== 0"
                     class="ma-0 pa-0"
                     flat>
                <img src="static/images/buttons/save-edits.png"
                     :style="errorText ? {opacity: .50} : null"
                     alt="Save Button" />
              </v-btn>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-form>
    </v-container>
  </v-flex>
</template>

<script>
/* eslint-disable */

export default {
  name: 'ClientInfoHeader',
  props: ['cancelSave', 'is_editing', 'is_viewing', 'is_expanded', 'save'],
  data() {
    return {
      errorText: '',
    }
  },
  computed: {
    addressLine1: {
      get: function() {
        return this.$store.getters.addressLine1
      }, set: function(value) {
        this.$store.commit('addressLine1', value)
      },
    },
    addressLine2: {
      get: function() {
        return this.$store.getters.addressLine2
      }, set: function(value) {
        this.$store.commit('addressLine2', value)
      },
    },
    addressLine3: {
      get: function() {
        return this.$store.getters.addressLine3
      }, set: function(value) {
        this.$store.commit('addressLine3', value)
      },
    },
    city: {
      get: function() {
        return this.$store.getters.city
      }, set: function(value) {
        this.$store.commit('city', value)
      },
    },
    client_info_expanded() {
      if (this.$store.state.activeRequestBannerPopUp) {
        return this.$store.state.activeRequestBannerPopUp === 'applicant'
      }
      return false
    },
    clientFirstName: {
      get: function() {
        return this.$store.getters.clientFirstName
      }, set: function(value) {
        this.$store.commit('clientFirstName', value)
      },
    },
    clientLastName: {
      get: function() {
        return this.$store.getters.clientLastName
      }, set: function(value) {
        this.$store.commit('clientLastName', value)
      },
    },
    conEmail: {
      get: function() {
        return this.$store.getters.conEmail
      }, set: function(value) {
        this.$store.commit('conEmail', value)
      },
    },
    contactName: {
      get: function() {
        return this.$store.getters.contactName
      }, set: function(value) {
        this.$store.commit('contactName', value)
      },
    },
    country: {
      get: function() {
        return this.$store.getters.country
      }, set: function(value) {
        this.$store.commit('country', value)
      },
    },
    fax: {
      get: function() {
        return this.$store.getters.fax
      }, set: function(value) {
        this.$store.commit('fax', value)
      },
    },
    firstName: {
      get: function() {
        return this.$store.getters.firstName
      }, set: function(value) {
        this.$store.commit('firstName', value)
      },
    },
    lastName: {
      get: function() {
        return this.$store.getters.lastName
      }, set: function(value) {
        this.$store.commit('lastName', value)
      },
    },
    middleName: {
      get: function() {
        return this.$store.getters.middleName
      }, set: function(value) {
        this.$store.commit('middleName', value)
      },
    },
    nrNumber() {
      return this.$store.getters.nrNumber
    },
    phone: {
      get: function() {
        return this.$store.getters.phone
      }, set: function(value) {
        this.$store.commit('phone', value)
      },
    },
    postalCode: {
      get: function() {
        return this.$store.getters.postalCode
      }, set: function(value) {
        this.$store.commit('postalCode', value)
      },
    },
    province: {
      get: function() {
        return this.$store.getters.province
      }, set: function(value) {
        this.$store.commit('province', value)
      },
    },
  },
  methods: {
    validateLastName(input) {
      if ( !input || input.length === 0 || input.trim().length === 0 ) {
        this.errorText = 'The last name field cannot be empty'
      } else {
        this.errorText = ''
      }
    },
    clickCancel() {
      this.errorText = ''
      this.cancelSave()
    },
    clickSave() {
      this.errorText = ''
      this.save()
    },
  },
}
</script>

<style scoped>
  .field {
    margin: 0 0 3px 0 !important;
    padding: 0 !important;
  }

  .field-inline {
    margin: 0 0 3px 0 !important;
    padding: 0 3px 0 0 !important;
  }

  .inline-label {
    color: var(--text);
    font-weight: 600;
  }

  .label {
    color: var(--text);
    font-weight: 600;
    padding: 0 !important;
    margin: 2px 0 2px 0 !important;
  }
  .position-up {
    position: relative;
    top: -10px !important;
  }
  .section {
    padding: 0 !important;
    margin: 0 0 8px 0 !important;
  }
</style>

