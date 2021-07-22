<template>
  <div id="transaction-component">
    <v-container id="transaction-main-container" class="fs-15 pa-0" fluid>
      <!-- Header + Title Bar -->
      <v-container id="transaction-header" fluid>
        <spinner v-if="pendingNameRequest" style="height: 15vh" />

        <template v-else>
          <v-layout id="transaction-header-title">
            <v-flex class="fs-24 fw-700 pr-3" :class="{ 'priority' : priority }" shrink>
              {{ nr }}
            </v-flex>
            <v-flex v-if="priority" class="border-x pt-1 px-3" shrink>
              <v-icon class="priority">star</v-icon>
              <span class="priority fs-18 fw-700">Priority</span>
            </v-flex>
            <v-flex class="pt-1 pl-3" grow>
              <span class="fs-18 fw-700">{{ requestType_desc(requestType) }}</span>
            </v-flex>
          </v-layout>

          <div id="transaction-header-names">
            <v-layout v-for="name in names" :key="name.choice">
              <v-flex>
                <v-layout class="name-option fs-16" :class="getNameClasses(name)">
                  <v-flex shrink>{{ name.choice }}.</v-flex>
                  <v-flex class="pl-2" shrink>
                    {{ name.name }}
                    <CompNameIcon :state="name.state" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12 class="decision-text pa-0 ma-0 fs-12">{{ name.decision_text }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>

          <div id="transaction-header-info">
            <!-- Line 1 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Submitted Date:</v-flex>
              <v-flex xs4>{{ submitted }}</v-flex>
              <v-flex xs2 class="fw-700">Expiry Date:</v-flex>
              <v-flex xs3>{{ expiry }}</v-flex>
            </v-layout>

            <!-- Line 2 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Request Status:</v-flex>
              <v-flex xs4>{{ displayState(nrInfo) }}</v-flex>
              <v-flex xs2 class="fw-700">Consent:</v-flex>
              <v-flex xs3>{{ displayConsent(nrInfo) }}</v-flex>
            </v-layout>

            <!-- Line 3 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Additional Information:</v-flex>
              <v-flex xs9 v-if="nrInfo">{{ nrInfo.additionalInfo }}</v-flex>
            </v-layout>
          </div>
        </template>
        <v-layout id="transaction-title-bar">
          <v-flex class="ml-4 pl-3 pt-1 fs-16 fw-700">TRANSACTION HISTORY</v-flex>
          <v-flex class="mr-4 pr-3 justify-end">
            <v-checkbox
              off-icon="mdi-checkbox-blank"
              v-model="showSystemTransactions"
              class="justify-end"
              color="white"
            >
              <template v-slot:label>
                <span class="checkbox-label fs-16">Show system transactions</span>
              </template>
            </v-checkbox>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Transaction History List -->
      <v-container id="transaction-list-wrapper" class="pa-0" fluid>
        <v-container id="transaction-list" class="pa-0" fluid>
          <v-layout v-if="pendingTransactionsRequest" class="pt-5" style="height: 100vh">
            <spinner />
          </v-layout>
          <v-layout v-else-if="transactionsData && transactionsData.length === 0" class="pa-5" justify-center>
            No transaction history data available.
          </v-layout>

          <v-layout v-else-if="!transactionsData" class="pt-5" justify-center>
            There was an error loading the transaction history for this NR. Please try again by reloading the page.
          </v-layout>

          <!-- Items -->
          <div v-else
            v-for="(transaction, index) in filteredTransactions"
            :key="index"
            class="transaction-item"
          >
            <!-- Line 1 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Date/Time:</v-flex>
              <v-flex xs4>{{ formatDate(transaction.eventDate) }}</v-flex>
              <v-flex xs2 class="fw-700">Expiry Date:</v-flex>
              <v-flex xs3>{{ formatDate(transaction.expirationDate) }}</v-flex>
            </v-layout>

            <!-- Line 2 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Transaction Type:</v-flex>
              <v-flex xs4>{{ transaction.user_action }}</v-flex>
              <v-flex xs2 class="fw-700">User Id:</v-flex>
              <v-flex xs3>{{ transaction.user_name }}</v-flex>
            </v-layout>

            <!-- Line 3 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Request Status:</v-flex>
              <v-flex xs4>{{ displayState(transaction) }}</v-flex>
              <v-flex xs2 class="fw-700">Queue:</v-flex>
              <v-flex xs3 v-if="transaction.priorityCd === 'Y'">
                <v-icon size="21" class="priority">star</v-icon>
                <span class="priority fw-700">Priority</span>
              </v-flex>
              <v-flex xs3 v-else >Regular</v-flex>
            </v-layout>

            <!-- Line 4 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Request Type:</v-flex>
              <v-flex xs4>{{ requestType_desc(transaction.requestTypeCd) }}</v-flex>
              <v-flex xs2 class="fw-700">Consent:</v-flex>
              <v-flex xs3>{{ displayConsent(transaction) }}</v-flex>
            </v-layout>

            <!-- Line 5 -->
            <v-layout>
              <v-flex xs3 class="fw-700">Additional Information:</v-flex>
              <v-flex xs9>{{ transaction.additionalInfo }}</v-flex>
            </v-layout>

            <!-- Names -->
            <div>
              <v-layout v-for="name in transaction.names" :key="name.choice" class="transaction-name py-2">
                <v-flex xs3>NAME {{ name.choice }}:</v-flex>
                <v-flex xs9>
                  {{ name.name }}
                  <CompNameIcon v-if="name.state && name.state !== 'NE'" :state="name.state" />
                  <span v-else> (Draft)</span>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-container>
      </v-container>
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import CompNameIcon from './Examine/CompNameIcon'
  import Spinner from './spinner'

  export default {
    name: 'Transactions',
    components: { CompNameIcon, Spinner },
    data() {
      return {
        nr: '',
        showSystemTransactions: false,
        defaultTransactions: ['Cancelled in Name Request', 'Created NR (Payment Completed)', 'Created NR (Unknown)',
          'Decision', 'Edit NR Details (Name Request)', 'Edit NR Details (NameX)', 'Edit NR Details after Completion',
          'Marked on Hold', 'Reapplied NR (Unknown)'],
      };
    },
    created() {
      // watch resize events
      window.addEventListener('resize', this.onResize)

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
      // needs to be set again after ^ dispatch?? I don't know why
      sessionStorage.setItem('KEYCLOAK_TOKEN', this.$route.query.token)
      this.$store.commit('setPendingNameRequest', false)

      await this.$store.dispatch('getTransactionsHistory', this.nr)
      this.$store.commit('setPendingTransactionsRequest', false)

      // set initial size
      this.onResize(null)
    },
    destroyed() {
      window.removeEventListener('resize', this.onResize)
    },
    computed: {
      ...mapState([
        'nrInfo',
        'listRequestTypes',
        'pendingNameRequest',
        'pendingTransactionsRequest',
        'transactionsData'
      ]),
      activeNameChoice() {
        let activeChoice = 1
        for (let i = 0; i < this.names.length; i++) {
          const name = this.names[i]
          if (['APPROVED', 'CONDITION', 'NE'].includes(name.state)) {
            // set first encounter of one of the above states as the active choice then break loop
            activeChoice = name.choice
            break
          } else if (i + 1 === this.names.length) {
            // will only get here if all names are rejected. Set last one as the active choice
            activeChoice = name.choice
          }
        }
        return activeChoice
      },
      expiry() {
        // moment().format('DD-MM-YYYY, h:mm a')
        if (this.nrInfo && this.nrInfo.expirationDate) {
          return this.formatDate(this.nrInfo.expirationDate)
        }
        return 'N/A'
      },
      filteredTransactions() {
        return this.showSystemTransactions
          ? this.transactionsData
          : this.transactionsData.filter(item => this.defaultTransactions.includes(item.user_action));
      },
      names() {
        if (this.nrInfo && this.nrInfo.names) {
          return this.nrInfo.names.sort(
            function (a, b) {
              if (a.choice > b.choice) return 1
              return -1
            }
          )
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
      submitted() {
        if (this.nrInfo && this.nrInfo.submittedDate) {
          return this.formatDate(this.nrInfo.submittedDate)
        }
        return 'N/A'
      },
    },
    methods: {
      displayConsent(nrInfo) {
        if (nrInfo) {
          if (nrInfo.consent_dt) return 'Required. Received.'
          if (nrInfo.consentFlag === 'Y') return 'Required. Not Yet Received.'
          return 'Not Required'
        }
        return 'N/A'
      },
      displayState(nrInfo) {
        let displayState = 'N/A'
        if (nrInfo && nrInfo.stateCd) {
          displayState = nrInfo.stateCd
          if (displayState == 'CONDITIONAL') displayState += ' APPROVED'
          if (nrInfo.corpNum) displayState += ` / Used for ${nrInfo.corpNum}`
        }
        return displayState
      },
      formatDate(date) {
        if (!date) return 'N/A'
        return moment(date).format('YYYY-MM-DD, h:mm a') + ' Pacific time'
      },
      getNameClasses(name) {
        let classes = []
        if (this.activeNameChoice == name.choice) classes.push('fw-700')
        if (name.state === 'APPROVED' || name.state === 'CONDITION') classes.push('accepted')
        return classes
      },
      requestType_desc(requestType) {
        try {
          return getDescFromList(this.listRequestTypes, requestType)
        } catch (err) {
          return 'N/A'
        }
      },
      onResize(e) {
        const pageHeight = e ? e.currentTarget.innerHeight : this.$el.clientHeight
        const headerHeight = this.$el.querySelector('#transaction-header').clientHeight
        // set list height for proper scrolling
        this.$el.querySelector('#transaction-list-wrapper').style.height = (pageHeight - headerHeight) + 'px'
      }
    }
  }
</script>

<style>
  html {
    overflow-y: hidden;
  }
</style>

<style scoped>
  #transaction-component {
    color: var(--text) !important;
    background-color: var(--l-grey);
    height: 100%;
  }
  #transaction-main-container {
    max-width: 1200px;
    min-width: 840px;
    height: inherit;
  }
  #transaction-header {
    padding: 24px 40px 0 40px;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    background-color: white;
  }
  #transaction-header-names {
    margin-top: 10px;
  }
  .name-option {
    margin-top: 4px;
  }
  .name-option.accepted {
    color: var(--cyan);
  }
  .decision-text {
    margin-left: 24px;
    position: relative;
    display: block;
  }
  #transaction-header-info {
    margin-top: 10px;
    overflow: auto;
  }
  #transaction-title-bar {
    margin: 20px -40px 0 -40px;
    color: white !important;
    background-color: var(--d-grey);
  }
  #transaction-list-wrapper {
    overflow: auto;
    position: relative;
    background-color: white;
  }
  #transaction-list {
    position: absolute;
  }
  #transaction-filter-checkbox:hover {
    cursor: pointer;
  }
  .checkbox-label {
    color: white;
  }
  .transaction-item {
    padding: 20px 40px;
  }
  .transaction-item:nth-child(odd) {
    background-color: var(--xl-grey);
  }
  .transaction-name {
    border-top: thin solid var(--grey);
  }
  .transaction-name:first-of-type {
    margin-top: 16px;
  }
  .transaction-name:last-of-type {
    border-bottom: thin solid var(--grey);
  }
  .border-x {
    border-left: thin solid var(--l-grey);
    border-right: thin solid var(--l-grey);
  }

  /* Helper classes missing from Vuetify: */
  .pa-0 {
    padding: 0 !important;
  }
  .ma-0 {
    margin: 0 !important;
  }

  /* Vuetify overrides: */
  >>> .v-input__control {
    height: 28px !important;
  }
  >>> .theme--light.v-icon {
    color: white;
  }
</style>
