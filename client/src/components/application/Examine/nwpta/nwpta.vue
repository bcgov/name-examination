/* eslint-disable */
<template>
  <span v-if="is_editing && is_complete">

    <span class="nwpta" v-if="nwpta.partnerJurisdictionTypeCd !== null">
      <h3 class="add-top-padding">{{ nwpta.partnerJurisdictionTypeCd }}</h3>
      <input type="text" v-model="nwpta.partnerNameNumber" class="form-control" />
      <input type="text" v-model="nwpta.partnerName" class="form-control" />
    </span>

  </span>
  <span v-else>

    <span class="nwpta" v-if="nwpta.partnerJurisdictionTypeCd !== null">
      <h3 class="add-top-padding">{{ nwpta.partnerJurisdictionTypeCd }}</h3>
      {{ nwpta.partnerNameNumber }}
      <br/>
      {{ nwpta.partnerName }}
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
    computed: {
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      is_complete() {
        return this.$store.getters.is_complete;
      },
      nwpta() {
        if (this.jurisdiction == 'AB') return this.$store.getters.nwpta_ab;
        else if (this.jurisdiction == 'SK') return this.$store.getters.nwpta_sk;
        else return null;
      },
    },
    mounted(){
    },
    watch: {
    },
    methods: {
      toggleDetails() {
      },
      edit() {
        this.$store.state.is_editing = true;
      },
      save() {
        this.$store.state.is_editing = false;
      }
    }
  }
</script>

<style scoped>
</style>
