<!-- eslint-disable -->
<template>
  <span v-if="is_editing && has_nwpta && (!is_numbered_assumed || nwpta_requested)">

    <span class="nwpta" :id="id">
      <h3 class="add-top-padding">
        {{ jurisdiction }}
        <span v-if="is_named_assumed">(Assumed)</span>
        <span v-if="nwpta_requested">REQUESTED</span>
      </h3>

      <!-- for do-it-for-me requests, give radio buttons to choose nuans, assumaed nauns, or numbered assumed -->
      <div :hidden="!nwpta_requested">
        <div class="form-check">
          <input type="radio" value="requested_nuans" class="form-check-input"
                 id="radio1" v-model="requested_radio_selection" />
          <label class="form-check-label" for="radio1">
            NUANS
          </label>
        </div>
        <div class="form-check">
          <input type="radio" value="requested_assumed" class="form-check-input"
                 id="radio2" v-model="requested_radio_selection" />
          <label class="form-check-label" for="radio2">
            Assumed NUANS
          </label>
        </div>
        <div class="form-check">
          <input type="radio" value="requested_numbered" class="form-check-input"
                 id="radio3" v-model="requested_radio_selection" />
          <label class="form-check-label" for="radio3">
            Numbered Assumed
          </label>
        </div>
      </div>

      <!-- number -->
      <span v-if="!nwpta_requested || requested_radio_selection_nuans || requested_radio_selection_assumed">
        <input type="text" v-model="nwpta.partnerNameNumber" class="form-control"
               placeholder="Number" maxlength="20" />
      </span>

      <!-- name - only for "Named Assumed" type OR "do it for me" -->
      <span v-if="(!nwpta_requested && is_named_assumed) || (nwpta_requested && requested_radio_selection_assumed)">
        <input type="text" v-model="nwpta.partnerName" class="form-control" placeholder="Name"
               maxlength="255" />
      </span>

      <!-- date -->
      <span v-if="!nwpta_requested || requested_radio_selection_nuans || requested_radio_selection_assumed" :class="{'form-group-error': $v.nwpta.partnerNameDate.$error}">
        <input type="text" v-model="nwpta.partnerNameDate" class="form-control"
               placeholder="Expiry Date" :onchange="$v.nwpta.partnerNameDate.$touch()" />
        <div class="date-helper-text">DD-MM-YYYY</div>
        <div class="error" v-if="!$v.nwpta.partnerNameDate.isValidFormat">
          Date must be in format DD-MM-YYYY.</div>
        <div class="error" v-else-if="!$v.nwpta.partnerNameDate.isActualDate">
          This is not an actual date. Date must be in format DD-MM-YYYY.</div>
      </span>
    </span>

  </span>
  <span v-else-if="!is_editing && nwpta_requested && has_nwpta && !is_header_shown">

    <span class="nwpta" :id="id">
      <h3 class="add-top-padding">
        {{ jurisdiction }}
        <span>REQUESTED</span>
      </h3>
    </span>

  </span>
  <span v-else-if="(!is_editing || is_numbered_assumed) && has_nwpta && is_header_shown">
    <span class="nwpta" :id="id">
      <h3 class="add-top-padding">
        {{ jurisdiction }}
        <span v-if="nwpta_requested">REQUESTED</span>
        <span v-else-if="is_named_assumed">(Assumed)</span>
      </h3>
      <div v-if="is_numbered_assumed">Numbered Assumed</div>

      <!-- number -->
      {{ nwpta.partnerNameNumber }}

      <!-- name - only for "Named Assumed" type -->
      <span v-if="is_named_assumed">
        <br/>
        {{ nwpta.partnerName }}
      </span>

      <!-- date -->
      <br />
      {{ nwpta.partnerNameDate }}
    </span>
  </span>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'nwptaInfo',
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
          isValidFormat(value) {
            // if empty, it's valid - not required
            if (value == '' || value == null) return true;
            return isValidFormat(value);
          },
          isActualDate(value) {
            // if empty, it's valid - not required
            if (value == '' || value == null) return true;
            return isActualDate(value);
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
        console.log('got to adjustUponSave() for ' + this.jurisdiction);

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
        console.log('got to END OF adjustUponSave() for ' + this.jurisdiction);
      }
    },
  }
</script>

<style scoped>
  .date-helper-text {
    font-style: italic;
    color: grey;
    text-align: center;
  }
  .nwpta {

  }
</style>
