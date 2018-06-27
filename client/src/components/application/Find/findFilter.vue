/* eslint-disable */
<template>
    <span>
        <datatable v-bind="$data" />
    </span>
</template>

<script defer>
/* eslint-disable */
var tmpJSON = [
  {
    "value": "AB",
    "SHORT_DESC": "AB",
    "text": "ALBERTA"
  },
  {
    "value": "MB",
    "SHORT_DESC": "MB",
    "text": "MANITOBA"
  },
  {
    "value": "NB",
    "SHORT_DESC": "NB",
    "text": "NEW BRUNSWICK"
  }
];

export default {
  name: 'findfilter',
  data: () => ({
    columns: [
      {title: 'Abreviation', field: 'value', label: 'Abrev', sortable: true, visible: true},
      {title: 'Short Desc', field: 'SHORT_DESC', label: 'Desc', sortable: true, visible: true},
      {title: 'Prov', field: 'text', label: 'Prov', sortable: true, visible: true},
    ],
    pageSizeOptions: [5, 10, 15, 20],
    data: [],
    total: 0,
    query: {}
  }),
  mounted() {
    this.data = tmpJSON;
  },
}
</script>

<style scoped>
  .findfilter {
  }
 </style>
