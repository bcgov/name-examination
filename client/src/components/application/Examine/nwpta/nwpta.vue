<!-- eslint-disable -->
<template>
  <fragment name="jurisdiction+'-nwpta-fragment'">
    <template v-if="is_editing && has_nwpta && (!is_numbered_assumed || nwpta_requested)">
      <v-flex fs-14><b>{{ jurisdiction }}: </b>{{ is_named_assumed ? '(Assumed)' : '' }}
                                               {{ nwpta_requested ?  'Requested' : ''}}</v-flex>
      <!-- for do-it-for-me requests, give radio buttons to choose nuans, assumaed nauns, or numbered assumed -->
      <template v-show="nwpta_requested">
        <v-flex>
          <input type="radio"
                 value="requested_nuans"
                 id="radio1"
                 v-model="requested_radio_selection" />
          <label for="radio1">
            NUANS
          </label>
        </v-flex>
        <v-flex>
          <input type="radio"
                 value="requested_assumed"
                 id="radio2"
                 v-model="requested_radio_selection" />
          <label for="radio2">
            Assumed NUANS
          </label>
        </v-flex>
        <v-flex>
          <input type="radio"
                 value="requested_numbered"
                 id="radio3"
                 v-model="requested_radio_selection" />
          <label for="radio3">
            Numbered Assumed
          </label>
        </v-flex>
      </template>
      <!-- number -->
      <v-flex v-if="!nwpta_requested || requested_radio_selection_nuans || requested_radio_selection_assumed"
              align-self-center>
        <v-text-field v-model="nwpta.partnerNameNumber"
                      class="nwpta-field"
                      autocomplete="off"
                      placeholder="Number"
                      maxlength="20" />
      </v-flex>
      <!-- name - only for "Named Assumed" type OR "do it for me" -->
      <v-flex v-if="(!nwpta_requested && is_named_assumed) || (nwpta_requested && requested_radio_selection_assumed)"
              align-self-center>
        <v-text-field v-model="nwpta.partnerName"
                      class="nwpta-field"
                      autocomplete="off"
                      placeholder="Name"
                      maxlength="255" />
      </v-flex>
      <!-- date -->
      <template v-if="!nwpta_requested || requested_radio_selection_nuans || requested_radio_selection_assumed"
        <v-flex :class="{'form-group-error': $v.nwpta.partnerNameDate.$error}"
                align-self-center>
          <v-text-field v-model="partnerNameDateAB"
                        v-if="jurisdiction === 'AB' "
                        class="nwpta-field"
                        autocomplete="off"
                        placeholder="Expiry Date"
                        @input="$v.nwpta.partnerNameDate.$touch()" />
          <v-text-field v-model="partnerNameDateSK"
                        v-if="jurisdiction === 'SK' "
                        class="nwpta-field"
                        autocomplete="off"
                        placeholder="Expiry Date"
                        @input="$v.nwpta.partnerNameDate.$touch()" />
        </v-flex>
      <v-flex ft-ital>YYYY-MM-DD</v-flex>
      <v-flex class="field-error"
              v-if="!$v.nwpta.partnerNameDate.isValidFormat">
        Date must be in format YYYY-MM-DD
      </v-flex>
      <v-flex class="field-error"
              v-else-if="!$v.nwpta.partnerNameDate.isActualDate">
        This is not an actual date. Date must be in format YYYY-MM-DD
      </v-flex>
    </template>

    <template v-else-if="(!is_editing || is_numbered_assumed) && has_nwpta">
      <v-flex fs-14><b>{{ jurisdiction }}: </b>
        {{ is_named_assumed ? '(Assumed)' : '' }}
        {{ nwpta_requested ?  'Requested' : ''}}
      </v-flex>
      <v-flex v-if="is_numbered_assumed" fw-600>Assumed #: </v-flex>
      <!-- number -->
      <v-flex>{{ nwpta.partnerNameNumber }}</v-flex>
      <!-- name - only for "Named Assumed" type -->
      <v-flex v-if="is_named_assumed">{{ nwpta.partnerName }}</v-flex>
      <!-- date -->
      <v-flex>{{ nwpta.partnerNameDate }}</v-flex>
    </template>

    <v-flex fs-14 v-else>
      <b>{{ jurisdiction }}:</b>
      <p class="text-center no-nwpta">n/a</p>
    </v-flex>
  </fragment>
</template>

<script>
/* eslint-disable */
  import { isActualDate,isValidFormat } from "../../../../../static/js/validators";
  import moment from 'moment'

  export default {
    name: 'NwptaInfo',
    data: function() {
      return {
        requested_radio_selection: null,
      }
    },
    props: {
      jurisdiction: String,
      is_lp_nwpta_type: Boolean,
      is_cp_nwpta_type: Boolean,
    },
    validations: {

      nwpta: {
        partnerNameDate: {
          isActualDate(value) {
            // if empty, it's valid - not required
            if (!value) return true;
            return isActualDate(value);
          },
          isValidFormat(value) {
            // if empty, it's valid - not required
            if (!value) return true;
            return isValidFormat(value);
          },
        }
      },
    },
    computed: {
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      nwpta() {
        if (this.jurisdiction == 'AB') return this.$store.getters.nwpta_ab;
        else if (this.jurisdiction == 'SK') return this.$store.getters.nwpta_sk;
        else return null;
      },
      displayPartnerNameDate() {
        if (this.jurisdiction) {
          let type = this.jurisdiction.toLowerCase()
          if (this.$store.getters[`nwpta_${type}`] && this.$store.getters[`nwpta_${type}`].partnerNameDate) {
            let d = this.$store.getters[`nwpta_${type}`].partnerNameDate
            return moment(d).format('YYYY-MM-DD')
          }
        }
        return ''
      },
      partnerNameDateAB: {
        get() {
          if (this.$store.getters.nwpta_ab && this.$store.getters.nwpta_ab.partnerNameDate) {
            return this.$store.getters.nwpta_ab.partnerNameDate
          }
          return ''
        }, set(date) {
          this.$store.commit('setPartnerDate', {type: 'ab', payload: date})
        }
      },
      partnerNameDateSK: {
        get() {
          if (this.$store.getters.nwpta_sk && this.$store.getters.nwpta_sk.partnerNameDate) {
            return this.$store.getters.nwpta_sk.partnerNameDate
          }
          return ''
        }, set(date) {
          this.$store.commit('setPartnerDate', {type: 'sk', payload: date})
        }
      },
      has_nwpta() {
        if (this.nwpta == null) return false;
        if (this.nwpta.partnerJurisdictionTypeCd == null) return false;

        // is an Alberta record valid for this request type? Not valid for LP and LLPs
        if (this.nwpta.partnerJurisdictionTypeCd == 'AB' && this.is_lp_nwpta_type) return false;

        // is a Saskatchewan record valid for this request type? Not valid for Co-ops
        if (this.nwpta.partnerJurisdictionTypeCd == 'SK' && this.is_cp_nwpta_type) return false;

        return true;
      },
      nwpta_requested() {
        // Is this a "do it for me" request?
        if (this.nwpta.requested) return true;
        else return false;
      },
      is_named_assumed() {
        // if the type is AS, this is an assumed name type
        if (this.nwpta.partnerNameTypeCd == 'AS') return true;
        else return false;
      },
      is_numbered_assumed() {
        // if the type is NAS, this is a NUMBERED assumed type
        if (this.nwpta.partnerNameTypeCd == 'NAS') return true;
        else return false;
      },
      id () {
        // id for identifying nwpta segments in Selenium tests
        return "nwpta-" + this.jurisdiction;
      },
      requested_radio_selection_nuans() {
        if (this.requested_radio_selection == 'requested_nuans') return true;
        else return false;
      },
      requested_radio_selection_assumed() {
        if (this.requested_radio_selection == 'requested_assumed') return true;
        else return false;
      },
      requested_radio_selection_numbered() {
        if (this.requested_radio_selection == 'requested_numbered') return true;
        else return false;
      },
      is_header_shown() {
        return this.$store.state.is_header_shown;
      },
    },
    mounted: function () {
      // initial value of radio buttons for do-it-for-me
      if (this.is_named_assumed) this.requested_radio_selection = 'requested_assumed';
      else if (this.is_numbered_assumed) this.requested_radio_selection = 'requested_numbered';
      else this.requested_radio_selection = 'requested_nuans';
    },
    methods: {
      adjustUponSave() {

        // only adjust data if this is a do-it-for-me request
        if (!this.nwpta_requested) return;

        // do not make data changes if this is not valid for the request type:
        // - AB not relevant for LPs
        // - SK not relevant for Co-ops
        if (this.nwpta.partnerJurisdictionTypeCd == 'AB' && this.is_lp_nwpta_type) return;
        if (this.nwpta.partnerJurisdictionTypeCd == 'SK' && this.is_cp_nwpta_type) return;

        // if the request is for an assumed numbered, set the type to NAS and clear all data fields
        if (this.requested_radio_selection_numbered) {
          this.nwpta.partnerNameTypeCd = 'NAS';
          this.nwpta.partnerNameDate = null;
          this.nwpta.partnerNameNumber = null;
          this.nwpta.partnerName = null;
        }

        // if the request is for an assumed named, set the type to AS and leave all fields as is
        else if (this.requested_radio_selection_assumed) {
          this.nwpta.partnerNameTypeCd = 'AS';
        }

        // if the request is for a regular nauns, set the type to LP (LPs and LLPs), CP (Co-ops),
        // or CO (all others) and clear the nuans name field (leave number and date)
        else {
          if (this.is_lp_nwpta_type) this.nwpta.partnerNameTypeCd = 'LP';
          else if (this.is_cp_nwpta_type) this.nwpta.partnerNameTypeCd = 'CP';
          else this.nwpta.partnerNameTypeCd = 'CO';

          this.nwpta.partnerName = null;
        }
      }
    },
  }
</script>

<style scoped>
  div {
    font-size: 13px;
    color: var(--text) !important;
  }
  .field-error {
    color: var(--rejected) !important;
  }

  .nwpta-field {
    background-color: white;
    height: 38px;
    width: 145px;
    margin-top: 0px !important;
    margin-bottom: 5px !important;
    border: 1px solid var(--l-grey);
    padding: 4px !important;
    font-size: 13px;
    color: var(--text);
  }
  .no-nwpta {
    font-size: 24px !important;
    font-weight: 600;
    margin-top: 5px;
    color: var(--l-grey)
  }
</style>
