/* eslint-disable */
<template>
  <v-container id="trademarks-container"
               fluid
               ma-0
               pa-0>
    <spinner className="trademarks-spinner hidden" />
    <v-layout id="trademarks-wrapper">
      <v-flex>
        <v-data-table :headers="headers"
                      :items="tableData"
                      disable-initial-sort
                      hide-actions
                      id="Trademarks"
                      v-model="tableSelected">
          <template v-slot:items="{item, index}">
            <tr :active="currentSelection.application_number == item.application_number"
                :id="`tm-${index}`"
                :style="getTRStyle(item.application_number)"
                @click="currentSelection = item">
              <td class="text-xs-left" >{{ item.name }}</td>
              <td class="text-xs-left">{{ item.description }}</td>
              <td class="text-xs-left">{{ item.status }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */

  import { mapGetters } from 'vuex'
  import spinner from '@/components/application/spinner.vue';

  export default {
    name: 'TrademarksInfo',
    components: { spinner, },
    data() {
      return {
        tableSelected: [],
        headers: [
          { text: 'Name', value: 'name', sortable: false, },
          { text: 'Description', value: 'description', label: 'Description', sortable: false, },
          { text: 'Status', value: 'status', sortable: false, },
          //{title: 'Text', field: 'text', label: 'text', sortable: false, visible: true},
        ],
        listenerAdded: false,
        offset: 0,
        rows: 100,
      }
    },
    activated() {
      this.addListener()
      this.$nextTick(function () {
        if ( this.tableData && this.tableData.length > 0 ) {
          if (!this.currentSelection) {
            this.currentSelection = this.tableData[0]
          }
        }
      })
    },
    deactivated() {
      this.removeListener()
    },
    beforeDestroy() {
      this.removeListener()
    },
    computed: {
      ...mapGetters([
        'currentTrademark',
        'selectedTrademarks',
        'trademarksJSON',
        'is_making_decision',
      ]),
      appNumber() {
        if (this.currentSelection && this.currentSelection.application_number) {
          return this.currentSelection.application_number
        }
        return null
      },
      currentSelection: {
        get() {
          if (this.currentTrademark) return this.currentTrademark
          return []
        },
        set(value) {
          this.$store.commit('currentTrademark', value)
        }
      },
      trademarks: {
        get() {
          return this.selectedTrademarks
        }, set(items) {
          this.$store.commit('setSelectedTrademarks', items)
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
    },
    methods: {
      addListener() {
        this.removeListener()
        document.addEventListener('keydown', this.manageTMListener)
      },
      removeListener() {
        document.removeEventListener('keydown', this.manageTMListener)
      },
      getTRStyle(application_number) {
        //style for item if item is currentTrademark
        if (application_number == this.currentSelection.application_number) return null
        //style for item if item is not currentTrademark && is selected for display in Decision (in trademarks array)
        if (this.trademarks.some(tm => tm.application_number == application_number)) {
          return { backgroundColor: 'rgba(97, 231, 140, 0.2)' }
        }
      },
      setSelection(item) {
        if (this.tableSelection) {
          let oldNumber = this.tableSelection.application_number
          let newNumber = item.application_number
          if (oldNumber === newNumber) {
            this.tableSelection = null
            return
          }
        }
        this.currentSelection = item
      },
      handleKeyboardEvent(event) {
        if (event.code === 'ArrowDown') {
          if (!this.tableData || this.tableData.length === 0) return
          if (!this.currentSelection) this.currentSelection = this.tableData[0]
          let i = this.tableData.findIndex(data=>data.application_number == this.currentSelection.application_number)
          let el
          if (this.tableData[i+1]) {
            this.currentSelection = this.tableData[i+1]
            el = document.getElementById(`tm-${ i + 1 }`)
          } else {
            this.currentSelection = this.tableData[0]
            el = document.getElementById(`tm-${ 0 }`)
          }
          el.scrollIntoViewIfNeeded()
          return
        }
        if ( event.code === 'ArrowUp' ) {
          if ( !this.tableData || this.tableData.length === 0 ) return
          if ( !this.currentSelection ) this.currentSelection = this.tableData[0]
          let l = this.tableData.length
          let i = this.tableData.findIndex(data=>data.application_number == this.currentSelection.application_number)
          let el
          if ( this.tableData[i - 1] ) {
            this.currentSelection = this.tableData[i - 1]
            el = document.getElementById(`tm-${ i - 1 }`)
          } else {
            this.currentSelection = this.tableData[l - 1]
            el = document.getElementById(`tm-${ l - 1 }`)
          }
          el.scrollIntoViewIfNeeded()
          return
        }
        if (event.code === 'Space') {
          if ( this.currentSelection ) {
            let newTMList = [...this.trademarks]
            let i = this.trademarks.findIndex(tm => tm.application_number == this.currentSelection.application_number)
            if ( i === -1 ) {
              newTMList.push(this.currentSelection)
            } else {
              newTMList.splice(i, 1)
            }
            this.trademarks = newTMList
          }
        }
      },
      manageTMListener(event) {
        let types = ['ArrowUp', 'ArrowDown', 'Space']
        //return the event without taking action / modifying it in any way when...
        // 1) key pressed is not on the list of keys we are listening for (so we never care about it)
        // 2) when the focus is inside a text area (so that all events go to the text area unmodified)
        // 3) when the editing panel is expanded by clicking Edit Request Button (and ConflictList is not visible)
        if ( !types.includes(event.code) || event.target.type === 'textarea' || this.is_editing ) {
          return event
        }
        //suppress space keypress event when !is_making_decision to prevent items from being added
        //to the Decision / Compare Panel when panels not visible
        if ( event.code === 'Space' && !this.is_making_decision ) {
          return event
        }
        //having triggered none of the exclusions above, we want to capture the event if the focus is not in
        //an INPUT tag or generally if it is a Tab keypress, and outside of those conditions, return the event
        if ( event.target.tagName !== 'INPUT') {
          event.preventDefault()
          this.handleKeyboardEvent(event)
        }
        else {
          return event
        }
      },
    },
  }
</script>

<style scoped>
  /* hide the content when spinner is showing, ie: results are loading */
  .trademarks-spinner:not(.hidden) ~ #trademarks-wrapper {
    display: none;
  }

  #trademarks-container {
    height: 445px;
    max-height: 445px;
    overflow-y: auto;
  }

  border-highlight {
    border: 1px solid blue !important;
  }

  .light-green {
    background-color: rgba(97, 231, 140, 0.1);
  }

  .light-blue {
    backgroundColor: rgba(91, 194, 231, 0.2); /* FUTURE: fix typo and test */
  }

  tr:hover {
    background-color: unset !important;
  }

  td:hover {
    cursor: pointer !important;
  }

  .first-td-cell, td, tr {
    vertical-align: top !important;
  }
</style>
