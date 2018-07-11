/* eslint-disable */
<template>
   <span v-on:click="setSelection($event);">
     <p v-if='has_trademarks'><datatable v-bind="$data" /></p>
  </span>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'trademarkInfo',
    data: () => ({
      columns: [
        {title: 'Trademark', field: 'name', label: 'Name', sortable: false, visible: true},
        {title: 'Description', field: 'description', label: 'Description', sortable: false, visible: true},
        {title: 'Status', field: 'status', label: 'Status', sortable: false, visible: true},
        //{title: 'Text', field: 'text', label: 'text', sortable: false, visible: true},
      ],
      pageSizeOptions: [5, 10, 15, 20],
      data: [],
      total: 0,
      query: {}
    }),
    mounted() {
      this.data = this.createDataList(this.trademarksJSON);
    },
    computed:{
      trademarksJSON() {
        return this.$store.getters.trademarksJSON;
      },
      has_trademarks() {
        if(this.trademarksJSON != null) return true;
        return false;
      },
      currentTrademark: {
        get: function () {
          return this.$store.getters.currentTrademark;
        },
        set: function (value) {
          this.$store.commit('currentTrademark', value);
        }
      },
    },
    methods: {
      createDataList(trademarksInfo){
        if(trademarksInfo == null) {
          console.log("trademarksJSON is null")
          return null;
        }

        var data = [];
        var wordIter;
        for (var cndIter=0;cndIter<trademarksInfo["names"].length; cndIter++) {
            var name = trademarksInfo["names"][cndIter].name;
            var description = trademarksInfo["names"][cndIter].description;
            var status = trademarksInfo["names"][cndIter].status;
            var application_number = trademarksInfo["names"][cndIter].application_number;

            data.push({
              name: name,
              description: description,
              status: status,
              application_number: application_number
            });
        }
        return data;
      },
      setSelection(event) {
        // check if this is a body row (ie: in tbody)
        var row = $(event.target).closest('tr')[0];
        if (row !== undefined) {
          if (row.parentNode.tagName == 'TBODY') {

            // remove any other row's "selected" status, then add "selected" to this row
            $(row).closest('tbody').find('tr').removeClass('selected');
            $(row).addClass('selected');

            // save trademark that matches row index
            this.currentTrademark = this.trademarksJSON.names[row.sectionRowIndex];

          } else {
            // do nothing
          }
        } else {
          // do nothing
        }
      }
    }
  }
</script>

<style scoped>
  .conflict-info-view {
    background-color: #00000;
    padding: 10px;
  }
</style>

<!-- unscoped style -->
<style>

  .table-striped tbody tr.selected {
    background-color: #ffa;
  }
</style>
