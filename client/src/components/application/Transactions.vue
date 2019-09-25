<template>
  <v-container id="transactions-modal"
               fluid
               class="transactions-modal"
               :class="maximized ? 'transactions-modal-lg' : 'transactions-modal-sm'"
               pa-0>
    <!--Top/Header Portion-->
    <v-layout v-dragged="onDrag">
        <v-flex title-font grow>Transaction History</v-flex>
        <v-flex title-font shrink>
          <v-icon class="min-max-icon" @click="clickResize">
            {{ maximized ? 'remove_circle' : 'add_circle' }}
          </v-icon>
          <v-icon class="close-icon" @click="closeModal()">
            add_circle
          </v-icon>
        </v-flex>
      </v-layout>
    <v-layout grey-bar>
      <v-flex fs-16-fw-700 grow>History for {{ nrNumber }}</v-flex>
      <v-flex shrink>as at {{ timeStamp }}</v-flex>
    </v-layout>

    <!--Body/Table/Spinner portion-->
    <v-layout :class="maximized ? 'main-panel-lg' : 'main-panel-sm'" id="trans-main-panel">
      <v-layout v-if="transactionsRequestStatus === 'success'">
        <v-flex v-if="sortedTransactionData">
          <v-data-table :headers="headers"
                        :pagination.sync="pagination"
                        :items="sortedTransactionData"
                        rows-per-page-text=""
                        class="ma-2">
            <template v-slot:headers="{ headers }">
              <tr style="text-align: left" id="header-cells">
                <th v-for="(header, i) in headers"
                    style="text-align: left"
                    :style="header.style">
                  <template v-if="header.text === 'Date & Time'">
                    <div class="date-sort" @click="sortDescending = !sortDescending">
                      <div>{{ header.text }}</div>
                      <div>

                        <v-icon style="color: var(--link); position: relative; top: -3px;">
                          {{ sortDescending ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
                        </v-icon>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    {{ header.text }}
                  </template>
                </th>
              </tr>
            </template>

            <template v-slot:items="{item, index}">
              <tr :key="'trans-row'+index" :class="expand === index ? 'bg-xl-blue' : ''">
                <td>{{ item.user_action ? item.user_action : item.action }}</td>
                <td>{{ item.stateCd }}</td>
                <td>{{ item.user_name }}</td>
                <td :colspan="item.showJSONData ? 1 : 2">{{ parseDate(item.eventDate) }}</td>
                <td v-if="item.showJSONData">
                  <v-icon class="plus-icon"
                          v-if="expand !== index"
                          @click="expand = index">keyboard_arrow_down
                  </v-icon>
                  <v-icon class="plus-icon"
                          v-else
                          @click="expand = null">keyboard_arrow_up
                  </v-icon>
                </td>
              </tr>
              <tr v-if="expand === index"
                  class="bg-xl-blue ma-0 pa-0">
                <td colspan="5" class="pr-5 mr-5">
                  <TransactionsExpansionRow :jsonData="item.jsonData" id="trans-expansion-row" />
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex v-else pa-5>No history to display.</v-flex>
      </v-layout>
      <v-layout pa-5 v-if="transactionsRequestStatus === 'failed'">
        <v-flex pa-5>Network Error. Something went wrong.</v-flex>
      </v-layout>
      <v-layout mb-5 pb-3 v-if="transactionsRequestStatus === 'pending'">
        <spinner />
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import moment from 'moment'
  import Spinner from './spinner'
  import TransactionsExpansionRow from './TransactionsExpansionRow'

  const debounce = require('lodash/debounce')

  export default {
    name: 'Transactions',
    components: { TransactionsExpansionRow, Spinner },
    data() {
      return {
        dragged: false,
        headers: [
          { text: 'Transaction', style: { width: '45%' } },
          { text: 'State', style: { width: '15%' } },
          { text: 'Username', style: { width: '15%' } },
          { text: 'Date & Time', style: { width: '20%' } },
          { text: 'Expand', style: { width:'5%' } },
        ],
        timeStamp: '',
      }
    },
    mounted() {
      this.timeStamp = moment().format('YYYY-MM-DD, h:mm a')
      document.getElementById('trans-main-panel').addEventListener(
        'scroll', debounce(this.saveScrollPosition, 350)
      )
    },
    computed: {
      ...mapGetters(['nrNumber']),
      ...mapState([
        'transactionsData',
        'transactionsNR',
        'transactionsModalVisible',
        'transactionsRequestStatus',
        'transactionsModalState'
      ]),
      sortDescending: {
        get() {
          if ( this.transactionsModalState ) {
            return this.transactionsModalState.sortDescending
          }
        },
        set(value) {
          this.$store.commit('setTransactionsModalState', { key: 'sortDescending', value })
        }
      },
      expand: {
        get() {
          if ( this.transactionsModalState ) {
            return this.transactionsModalState.expand
          }
        },
        set(value) {
          this.$store.commit('setTransactionsModalState', { key: 'expand', value })
        }
      },
      savedScrollPosition: {
        get() {
          if ( this.transactionsModalState ) {
            return this.transactionsModalState.scrollOffset
          }
        },
        set(value) {
          this.$store.commit('setTransactionsModalState', { key: 'scrollOffset', value })
        }
      },
      maximized() {
        if (this.transactionsModalState) {
          return this.transactionsModalState.maximized
        }
      },
      pagination: {
        get() {
          let output = {}
          if (this.maximized) {
            output.rowsPerPage = 10
          } else {
            output.rowsPerPage = 5
          }
          output.page = this.transactionsModalState.page
          return output
        },
        set({ page }) {
          this.$store.commit('setTransactionsModalState', { key:'page', value: page })
        }
      },
      sortedTransactionData() {
        if (typeof this.transactionsData === 'string') {
          return null
        }
        if (Array.isArray(this.transactionsData)) {
          let output = this.transactionsData.sort((a,b) => {
            let A = a.id
            let B = b.id
            if (this.sortDescending) {
              if ( A > B ) return -1
              if ( A < B ) return 1
              return 0
            }
            if ( !this.sortDescending ) {
              if ( A > B ) return 1
              if ( A < B ) return -1
              return 0
            }
          })
          return output.filter(item => item.user_action || item.action)
        }
        return []
      }
    },
    watch: {
      pagination(newVal, oldVal) {
        if (newVal !== null && oldVal !== null) {
          this.$store.commit('setTransactionsModalState', {
            key: 'expand',
            value: null
          })
        }
      },
      sortedTransactionData(newData) {
        if (Array.isArray(newData)) {
          //restores the scroll offset when switching between tabs
          if (newData.length > 0 && this.savedScrollPosition !== 0) {
            this.$nextTick(function () {
              this.$el.querySelector('#trans-main-panel').scrollTo({ top: this.savedScrollPosition })
            })
          }
        }
      }
    },
    methods: {
      clickResize() {
        this.$store.commit('setTransactionsModalState', {key: 'maximized', value: !this.maximized})
      },
      handleDismissClick(event) {
        if (!this.transactionsModalVisible) return event
        if ( event.path.some(el => el === this.$el) ) {
          return event
        }
        this.closeModal()
      },
      saveScrollPosition(e) {
        this.savedScrollPosition = e.target.scrollTop
        return e
      },
      closeModal() {
        this.$store.commit('toggleTransactionsModal', false)
        this.$store.commit('setTransactionsRequestStatus', 'pending')
      },
      parseDate(date) {
        return moment(date).local().format('YYYY-MM-DD, h:mm a')
      },
      getTransactions() {
        this.$store.dispatch('getTransactionsHistory', this.nrNumber).then( () => {
          this.showSpinner = false
        })
      },
      customSort(items, index, isDescending) {
        return items.sort((a,b) => {
          let A = moment(a.eventDate).format('x')
          let B = moment(b.eventDate).format('x')
          if (A > B) return -1
          if (A < B) return 1
          return 0
        })
      },
      onDrag({ deltaX, deltaY, offsetX, offsetY, clientX, clientY, first, last }) {
        let el = document.getElementById('transactions-modal')
        if ( first ) {
          this.dragged = true
          return
        }
        if (last) {
          this.dragged = false
          return
        }
        let l = +window.getComputedStyle(el)['left'].slice(0, -2) || 0
        let t = +window.getComputedStyle(el)['top'].slice(0, -2) || 0
        el.style.left = l + deltaX + 'px'
        el.style.top = t + deltaY + 'px'
      }
    }
  }
</script>

<style>
  #trans-main-panel > div > div > div > div.v-datatable.v-table.theme--light > div > div.v-datatable__actions__select {
    display: none !important;
  }
</style>

<style scoped>
  .arrow-icon {
    color: var(--link);
    font-size: 22px;
    cursor: pointer;
  }

  .close-icon {
    color: var(--priority);
    transform: rotate(45deg);
    font-size: 26px;
  }
  .grey-bar {
    color: var(--text);
    padding: 10px;
    background-color: var(--xl-grey);
  }

  .min-max-icon {
    color: var(--link);
    font-size: 26px;
  }

  .title-font {
    font-size: 24px;
    font-weight: 600;
    margin: 8px;
  }

  .transactions-modal {
    position: absolute;
    top: 200px;
    background-color: white;
    box-shadow: 0px 0px 20px 4px grey;
    z-index: 9999;
    overflow: hidden;
  }


  .transactions-modal-lg {
    width: 90%;
    margin-left: 5%;
    margin-right: 5%;
  }

  tr:hover:not(.bg-xl-blue) {
    background-color: whitesmoke !important;
  }

  #header-cells:hover {
    background-color: white !important;
  }

  .bg-xl-blue {
    background-color: var(--xl-blue) !important;
  }

  #trans-main-panel {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .main-panel-lg {
    max-height: 800px;
  }

  .main-panel-sm {
    max-height: 450px;
  }

  .date-sort {
    color: var(--link);
    display: flex;
    cursor: pointer;
  }

  .transactions-modal-sm {
    width: 55%;
    margin-left: 22.5%;
    margin-right: 22.5%;
  }

</style>
