<template>
  <v-flex>
    <v-container fluid class="transaction-container copy-normal">
      <!--Top/Header Portion-->
      <v-layout class="transaction-header-title" row>
        <v-flex class="border-right priority title-font pr-3" shrink>
          {{ nr }}
        </v-flex>
        <v-flex v-if="priority" class="border-right title-font px-3" shrink>
          <span class="priority title-font-sm">
            <v-icon class="priority" shrink>star</v-icon>
            Priority
          </span>
        </v-flex>
        <v-flex v-else class="border-right title-font px-3" shrink>
          <span class="title-font-sm">Regular</span>
        </v-flex>
        <v-flex class="title-font pl-3" grow>
          <span class="title-font-sm">{{ requestType_desc }}</span>
        </v-flex>
      </v-layout>
      <v-layout v-for="name in names" :key="name.choice" class="transaction-header-names">
        <v-flex class="copy-lg" shrink>{{ name.name }}</v-flex>
      </v-layout>
      <v-layout class="transaction-header-info">
        <v-flex>
          <v-layout>
            <v-flex class="font-weight-bold">Submitted Date:</v-flex>
            <v-flex>{{ submitted }}</v-flex>
            <v-flex class="font-weight-bold">Expiry Date:</v-flex>
            <v-flex>{{ expiry }}</v-flex>
          </v-layout>
          <v-layout class="pt-2">
            <v-flex class="font-weight-bold">Request Status:</v-flex>
            <v-flex>{{ status }}</v-flex>
            <v-flex class="font-weight-bold">Consent:</v-flex>
            <v-flex>{{ expiry }}</v-flex>
          </v-layout>
          <v-layout class="pt-2">
            <v-flex class="font-weight-bold">Additional Information:</v-flex>
            <v-flex>{{ submitted }}</v-flex>
            <v-flex class="font-weight-bold">Conditions/Comments:</v-flex>
            <v-flex>{{ expiry }}</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid text-xs-center class="pa-0">
      <v-layout class="grey-bar" row align-center>
        <v-flex class="py-1 title-font">TRANSACTION HISTORY</v-flex>
      </v-layout>

      <!--Body/Table/Spinner portion-->
      <v-layout :class="maximized ? 'main-panel-lg' : 'main-panel-sm'" id="trans-main-panel">
        <v-layout v-if="!pendingTransactionsRequest">
          <v-flex v-if="sortedTransactionData">
            <v-data-table :pagination.sync="pagination"
                          :items="sortedTransactionData"
                          rows-per-page-text=""
                          class="ma-2">
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
        <v-layout v-else mb-5 pb-3>
          <spinner />
        </v-layout>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
  import { mapState } from 'vuex'
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
        nr: '',
      }
    },
    created() {
      if (this.$route.query && this.$route.query.token) {
        sessionStorage.setItem('KEYCLOAK_TOKEN', this.$route.query.token)
        sessionStorage.setItem('AUTHORIZED', true)
      } else {
        alert('Not authorized')
      }

      if (this.$route.query && this.$route.query.nr) {
        this.nr = this.$route.query.nr
      } else {
        alert('No NR passed to retrieve transaction history for.')
      }
    },
    async mounted() {
      this.$store.commit('setPendingNameRequest', true)
      this.$store.commit('setPendingTransactionsRequest', true)
      await this.$store.dispatch('getNameRequest', this.nr)
      console.log(this.nrInfo)
      // needs to be set again after this call for some reason
      sessionStorage.setItem('KEYCLOAK_TOKEN', this.$route.query.token)
      this.$store.commit('setPendingNameRequest', false)

      await this.$store.dispatch('getTransactionsHistory', this.nr)
      this.$store.commit('setPendingTransactionsRequest', false)

      document.getElementById('trans-main-panel').addEventListener(
        'scroll', debounce(this.saveScrollPosition, 350)
      )
      console.log(this.listRequestTypes)
      console.log(this.requestType)
      console.log(this.nrInfo)
    },
    computed: {
      ...mapState([
        'nrInfo',
        'listRequestTypes',
        'pendingNameRequest',
        'pendingTransactionsRequest',
        'transactionsData',
        'transactionsNR',
        'transactionsModalVisible',
        'transactionsModalState'
      ]),
      expiry() {
        // moment().format('DD-MM-YYYY, h:mm a')
        if (this.nrInfo && this.nrInfo.expirationDate) {
          return this.nrInfo.expirationDate
        }
        return ''
      },
      names() {
        if (this.nrInfo && this.nrInfo.names) {
          return this.nrInfo.names.sort(function(a, b) { return a.choice < b.choice })
        }
        return []
      },
      priority() {
        if (this.nrInfo && this.nrInfo.priorityCd) {
          return this.nrInfo.priorityCd === 'Y'
        }
        return false
      },
      requestType() {
        if (this.nrInfo && this.nrInfo.requestTypeCd) {
          return this.nrInfo.requestTypeCd
        }
        return ''
      },
      requestType_desc() {
        try {
          return getDescFromList(this.listRequestTypes, this.requestType)
        } catch (err) {
          return 'Error getting Request Type'
        }
      },
      submitted() {
        if (this.nrInfo && this.nrInfo.submittedDate) {
          return this.nrInfo.submittedDate
        }
        return ''
      },
      status() {
        let state = 'N/A'
        if (this.nrInfo && this.nrInfo.stateCd) {
          state = this.nrInfo.stateCd
          if (state == 'CONDITIONAL') state += ' APPROVED'
          if (this.nrInfo.corpNum) state += ` / Used for ${this.nrInfo.corpNum}`
        }
        return state
      },
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
      parseDate(date) {
        return moment(date).local().format('YYYY-MM-DD, h:mm a')
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
  .border-right {
    border-right: thin solid var(--l-grey);
  }
  .close-icon {
    color: var(--priority);
    transform: rotate(45deg);
    font-size: 26px;
  }
  .copy-normal {
    color: var(--text);
    font-size: 16px;
  }
  .copy-lg {
    color: var(--text);
    font-size: 19px;
  }
  .grey-bar {
    background-color: var(--d-grey);
    color: white;
  }
  .min-max-icon {
    color: var(--link);
    font-size: 26px;
  }
  .title-font {
    font-size: 24px;
    font-weight: 600;
  }
  .title-font-sm {
    font-size: 19px;
    font-weight: 600;
  }
  .transaction-container {
    padding: 30px;
  }
  .transaction-header-info {
    max-width: 1000px;
    padding-top: 15px;
  }
  .transaction-header-names {
    padding-top: 5px;
  }
  .transaction-header-title {
    padding-bottom: 10px;
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

</style>
