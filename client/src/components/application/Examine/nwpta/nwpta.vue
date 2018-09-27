/* eslint-disable */
<template>
  <span v-if="is_editing && has_nwpta && !is_numbered_assumed">

    <span class="nwpta" :id="id">
      <h3 class="add-top-padding">
        {{ jurisdiction }} <span v-if="is_named_assumed">(Assumed)</span>
      </h3>

      <!-- number -->
      <span>
        <input type="text" v-model="nwpta.partnerNameNumber" class="form-control"
               placeholder="Number" maxlength="20" />
      </span>

      <!-- name - only for "Named Assumed" type -->
      <span v-if="is_named_assumed">
        <input type="text" v-model="nwpta.partnerName" class="form-control" placeholder="Name"
               maxlength="255" />
      </span>

      <!-- date -->
      <span :class="{'form-group-error': $v.nwpta.partnerNameDate.$error}">
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
  <span v-else-if="(!is_editing || is_numbered_assumed) && has_nwpta">

    <span class="nwpta" :id="id">
      <h3 class="add-top-padding">
        {{ jurisdiction }}
        <span v-if="is_named_assumed">(Assumed)</span>
        <span v-if="nwpta_requested">REQUESTED</span>
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
      }
    },
    props: {
      jurisdiction: null,
    },
    validations: {

      nwpta: {
        partnerNameDate: {
          isValidFormat(value) {
            return isValidFormat(value);
          },
          isActualDate(value) {
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
        return true;
      },
      nwpta_requested() {
        // Is this a "do it for me" request? Indicated by a nwpta record but no name or number data.
        // EXCEPT NAS (numbered assumed) - these also have no data but are not requested
        if (this.nwpta.partnerNameTypeCd != null && this.nwpta.partnerNameTypeCd != 'NAS' &&
            (this.nwpta.partnerName == null || this.nwpta.partnerName == '') &&
            (this.nwpta.partnerNameNumber == null || this.nwpta.partnerNameNumber == '')
        ) {
          return true;
        }
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
    },
  }
</script>

<style scoped>
  .date-helper-text {
    font-style: italic;
    color: grey;
    text-align: center;
  }
</style>
