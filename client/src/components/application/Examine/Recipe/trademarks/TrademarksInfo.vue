/* eslint-disable */
<template>
  <v-container conditions-container fluid ma-0 pa-0 style="">
    <spinner className="trademarks-spinner hidden" />
    <v-layout id="trademarks-wrapper">
      <v-flex>
        <v-data-table :headers="headers"
                      class="conditions-table-style"
                      :items="tableData"
                      id="Trademarks"
                      hide-actions>
          <template v-slot:items="props">
            <tr :active="props.item.application_number == appNumber"
                @click="setSelection(props.item)">
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td class="text-xs-left">{{ props.item.status }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */

  import spinner from '@/components/application/spinner.vue';

  export default {
    name: 'TrademarksInfo',
    components: {
      spinner,
    },
    data() {
      return {
        headers: [
          { text: 'Name', value: 'name', sortable: false, },
          { text: 'Description', value: 'description', label: 'Description', sortable: false, },
          { text: 'Status', value: 'status', sortable: false, },
          //{title: 'Text', field: 'text', label: 'text', sortable: false, visible: true},
        ],
        offset: 0,
        rows: 100,
      }
    },
    computed:{
      appNumber() {
        if (this.currentTrademark && this.currentTrademark.application_number) {
          return this.currentTrademark.application_number
        }
        return null
      },
      currentTrademark: {
        get() {
          return this.$store.getters.currentTrademark
        },
        set(value) {
          this.$store.commit('currentTrademark', value)
        }
      },
      tableData() {
        let { offset, rows, trademarksJSON } = this

        if (!trademarksJSON || !trademarksJSON.names) return []

        let tableData = []
        for (let name of trademarksJSON.names) {
          tableData.push({
            name: name.name,
            description: name.description,
            status: name.status,
            score: name.score,
            application_number: name.application_number,
          })
        }
        return tableData.splice(offset, rows)
      },
      trademarksJSON() {
        return this.$store.getters.trademarksJSON
      },
    },
    methods: {
      setSelection(item) {
        if (this.currentTrademark) {
          let oldNumber = this.currentTrademark.application_number
          let newNumber = item.application_number
          if (oldNumber === newNumber) {
            this.currentTrademark = null
            return
          }
        }
        this.currentTrademark = item
      }
    },
  }
</script>

<style scoped>
  /* hide the content when spinner is showing, ie: results are loading */
  .trademarks-spinner:not(.hidden) ~ #trademarks-wrapper {
    display: none;
  }

  td:hover {
    cursor: pointer !important;
  }

  .first-td-cell, td, tr {
    vertical-align: top !important;
  }
</style>
