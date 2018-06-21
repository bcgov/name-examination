/* eslint-disable */
<template>
    <span>
        <datatable v-bind="searchData" />
    </span>
</template>

<script defer>
/* eslint-disable */

export default {
  name: 'findfilter',
  computed: {
    searchData() {
      return this.$store.getters.searchData
    }
  }
}
</script>

<style scoped>
  .findfilter {
  }
 </style>
