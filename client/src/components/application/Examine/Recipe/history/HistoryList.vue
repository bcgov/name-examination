<!--eslint-disable-->
<template>
  <v-container fluid ma-0 pa-0 id="history-list-container">
    <spinner className="history-spinner hidden" />
    <v-layout id="history-list-view">
      <v-flex>
        <v-data-table :headers="headers"
                      :items="historiesJSON"
                      id="history-list-table"
                      hide-actions>
          <template v-slot:items="{item, index}">
            <tr :active="ind === index"
                :id="item.id"
                @click="setHistoryInfo(item, index)">
              <td class="text-xs-left history-item">{{ item.name }}</td>
              <td class="text-xs-left history-item">{{ item.jurisdiction }}</td>
              <td class="text-xs-left history-item">{{ item.nr_num }}</td>
              <td class="text-xs-left history-item">{{ formatDate(item.start_date) }}</td>
              <td class="text-xs-left history-item">
                <span class="fw-700" :style="setActiveStyle(item)" v-if="item.name_state_type_cd">
                  {{ item.name_state_type_cd }}
                </span>
              </td>
            </tr>
            <tr v-if="expandedInd === index">
              <td class="ma-0 pa-0" colspan="5">
                <HistoryInfo />
              </td>
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
import HistoryInfo from './HistoryInfo'
import moment from 'moment'

  export default {
    name: 'HistoryList',
    components: { HistoryInfo, spinner, },
    data() {
      return {
        headers: [
          { text: 'Name', value: 'name', align: 'left', sortable: false, },
          { text: 'Jurisdiction', value: 'jurisdiction', align: 'left', sortable: false, },
          { text: 'NR', value: 'nr_num', align: 'left', sortable: false, },
          { text: 'Submitted', value: 'startDate', align: 'left', sortable: false, },
          { text: 'Status', value: 'none', align: 'left', sortable: false, },
        ],
        expandedInd: null,
        ind: 0,
      }
    },
    activated() {
      this.addListener()
    },
    deactivated() {
      this.removeListener()
    },
    beforeDestroy() {
      this.removeListener()
    },
    computed: {
      historiesJSON() {
        if (this.$store.getters.historiesJSON && this.$store.getters.historiesJSON.names) {
          let output = []
          this.$store.getters.historiesJSON.names.forEach((name, i) => {
            name.id = `history-${i}`
            output.push(name)
          })
          return output
        } else {
          return []
        }
      },
      activeNR() {
        if (this.ind !== null && this.historiesJSON && this.historiesJSON.length > 0) {
          return this.historiesJSON[this.ind].nr_num
        }
        return ''
      },
      currentNrNum() {
        if (this.currentHistory && this.currentHistory.nr_num) return this.currentHistory.nr_num
        return null
      },
      currentHistory: {
        get() {
          if (this.$store.getters.currentHistory) return this.$store.getters.currentHistory
          return null
        },
        set(item) {
          this.$store.commit('currentHistory', item)
        }
      },
    },
    watch: {
      historiesJSON() {
        this.autoSetCurrentHistory()
      },
    },
    methods: {
      addListener() {
        this.removeListener()
        document.addEventListener('keydown', this.manageHistoryListener)
      },
      removeListener() {
        document.removeEventListener('keydown', this.manageHistoryListener)
      },
      manageHistoryListener(event) {
        let types = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',]
        if ( !types.includes(event.code) || event.target.type === 'textarea' || this.is_editing ) {
          return event
        }
        if ( event.target.tagName !== 'INPUT') {
          event.preventDefault()
          this.handleKeyboardEvent(event)
        }
        else {
          return event
        }
      },
      autoSetCurrentHistory() {
        if (this.historiesJSON && this.historiesJSON.length > 0) {
          this.ind = 0
          this.expandedInd = null
          if (this.historiesJSON.length === 1) {
            this.currentHistory = this.historiesJSON[0]
          }
        }
      },
      formatDate(timestamp) {
        return moment(timestamp).format('YYYY-MM-DD')
      },
      setActiveStyle(item) {
        if (item.name_state_type_cd === 'A')   return { color: 'var(--accepted)' }
        if ( item.name_state_type_cd === 'C' ) return { color: 'var(--gold)'  }
        if ( item.name_state_type_cd === 'R' ) return { color: 'var(--rejected)'   }
      },
      setHistoryInfo(item, index) {
        if (this.expandedInd === index) {
          this.expandedInd = null
          this.currentHistory = ''
          this.ind = index
          this.$store.dispatch('resetHistoriesInfo')
          return
        }
        this.currentHistory = item
        this.expandedInd = index
        this.ind = index
        this.$store.dispatch('resetHistoriesInfo')
        this.$store.dispatch('getHistoryInfo', item)
      },
      handleKeyboardEvent(event) {
        const scrollToView = (index) => {
          let { id } = this.historiesJSON[index]
          let el = document.getElementById(id)
          if (el) {
            el.scrollIntoViewIfNeeded()
          }
        }

        if (this.historiesJSON && this.historiesJSON.length > 0) {
          let length = this.historiesJSON.length
          switch (event.code) {
            case 'ArrowDown':
              if (this.currentHistory) { this.currentHistory = null }
              if (this.expandedInd) { this.expandedInd = null }
              if (this.ind === null) {
                this.ind = 0
                scrollToView(this.ind)
                return
              }
              if (this.ind === (length - 1)) return
              this.ind++
              scrollToView(this.ind)
              return

            case 'ArrowUp':
              if (this.currentHistory) { this.currentHistory = null }
              if (this.expandedInd) { this.expandedInd = null }
              if (this.ind === null || this.ind <= 0) {
                this.ind = 0
                scrollToView(this.ind)
                return
              }
              this.ind--
              scrollToView(this.ind)
              return

            case 'ArrowRight':
              if (this.ind === null) {
                this.ind = 0
              }
              this.expandedInd = this.ind
              this.currentHistory = this.historiesJSON[this.ind]
              this.$store.dispatch('resetHistoriesInfo')
              this.$store.dispatch('getHistoryInfo', this.currentHistory)
              return

            case 'ArrowLeft':
              this.expandedInd = null
              this.currentHistory = null
              return
          }
        }
      }
    },
  }
</script>

<style scoped>
  #history-list-container {
    height: 445px;
    max-height: 445px;
    overflow-y: auto;
  }

  .history-spinner:not(.hidden) ~ #history-list-view {
    display: none;
  }

  .history-list-view option {
    padding: 5px;
  }

  tr:hover {
    background-color: unset !important;
  }

  tr {
    cursor: pointer !important;
  }

</style>
