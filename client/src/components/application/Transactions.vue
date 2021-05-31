<template>
  <div id="transaction-background">
    <v-container id="transaction-main-container" fluid>
      <!--Top/Header Portion-->
      <v-container id="transaction-header" class="transaction-container copy-normal" fluid>
        <v-layout v-if="pendingNameRequest" style="height: 50vh">
          <spinner />
        </v-layout>
        <v-layout v-else>
          <v-flex>
            <v-layout class="transaction-header-title" row>
              <v-flex class="border-right title-font pr-3" :class="priority ? 'priority' : ''" shrink>
                {{ nr }}
              </v-flex>
              <v-flex v-if="priority" class="border-right title-font px-3" shrink>
                <span class="priority title-font-sm">
                  <v-icon class="priority" shrink>star</v-icon>
                  Priority
                </span>
              </v-flex>
              <v-flex class="title-font pl-3" grow>
                <span class="title-font-sm">{{ requestType_desc(requestType) }}</span>
              </v-flex>
            </v-layout>
            <v-layout v-for="name in names" :key="name.choice" class="transaction-header-names">
              <v-flex>
                <v-layout :class="getNameClasses(name)">
                  <v-flex shrink>{{ name.choice }}.</v-flex>
                  <v-flex class="pl-2" shrink>
                    {{ name.name }}
                    <CompNameIcon :state="name.state" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12 class="decision-text ml-4">{{ name.decision_text }}</v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout class="transaction-header-info">
              <v-flex class="font-weight-bold" shrink style="width: 200px;">
                <v-layout no-wrap row>Submitted Date:</v-layout>
                <v-layout class="pt-2" no-wrap row>Request Status:</v-layout>
                <v-layout class="pt-2" no-wrap row>Additional Information:</v-layout>
              </v-flex>
              <v-flex class="pl-4" shrink style="width: 400px;">
                <v-layout no-wrap row>{{ submitted }}</v-layout>
                <v-layout class="pt-2" no-wrap row>{{ displayState(nrInfo) }}</v-layout>
                <v-layout class="pt-2">
                  <v-flex style="overflow: auto">
                    <p v-if="nrInfo" class="ma-0">{{ nrInfo.additionalInfo }}</p>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex class="font-weight-bold" shrink style="padding-left: 32px;">
                <v-layout no-wrap row>Expiry Date:</v-layout>
                <v-layout class="pt-2">Consent:</v-layout>
              </v-flex>
              <v-flex class="pl-4">
                <v-layout no-wrap row>{{ expiry }}</v-layout>
                <v-layout class="pt-2" no-wrap row>{{ displayConsent(nrInfo) }}</v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container id="transaction-title-bar" fluid text-xs-center class="pa-0">
        <v-layout class="grey-bar" row align-center>
          <v-flex class="py-1 title-font">TRANSACTION HISTORY</v-flex>
        </v-layout>
      </v-container>
      <!-- Transaction History List -->
      <v-container id="transaction-list-wrapper" class="transaction-container copy-normal pa-0" fluid>
        <v-container id="transaction-list" fluid> 
          <v-layout v-if="pendingTransactionsRequest" class="pt-5" style="height: 100vh">
            <spinner />
          </v-layout>
          <v-layout v-else v-for="(transaction, index) in transactionsData" :key="index" :class="getTransactionItemClasses(index)" row>
            <v-flex>
              <v-layout style="padding-bottom: 20px;">
                <v-flex class="font-weight-bold" shrink style="width: 200px;">
                  <v-layout no-wrap row>Date/Time:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Transaction Type:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Request Status:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Request Type:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Additional Information:</v-layout>
                </v-flex>
                <v-flex class="pl-4" shrink style="width: 400px;">
                  <v-layout no-wrap row>{{ formatDate(transaction.eventDate) }}</v-layout>
                  <v-layout class="pt-2" no-wrap row>{{ transaction.user_action }}</v-layout>
                  <v-layout class="pt-2" no-wrap row style="overflow: auto">{{ displayState(transaction) }}</v-layout>
                  <v-layout class="pt-2" no-wrap row>{{ requestType_desc(transaction.requestTypeCd) }}</v-layout>
                  <v-layout class="pt-2">
                    <v-flex style="overflow: auto;">
                      <p class="ma-0">{{ transaction.additionalInfo }}</p>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="font-weight-bold" shrink style="padding-left: 32px;">
                  <v-layout no-wrap row>Expiry Date:</v-layout>
                  <v-layout class="pt-2" no-wrap row>User Id:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Consent:</v-layout>
                  <v-layout class="pt-2" no-wrap row>Queue:</v-layout>
                </v-flex>
                <v-flex class="pl-4" grow>
                  <v-layout no-wrap row>{{ formatDate(transaction.expirationDate) }}</v-layout>
                  <v-layout class="pt-2" no-wrap row>{{ transaction.user_name }}</v-layout>
                  <v-layout class="pt-2" no-wrap row>{{ displayConsent(transaction) }}</v-layout>
                  <v-layout class="pt-2" no-wrap row>
                    <v-flex v-if="transaction.priorityCd === 'Y'" class="priority bold" shrink style="font-size: 15px;">
                        <v-icon class="priority" shrink style="font-size: 20px;">star</v-icon> Priority
                    </v-flex>
                    <v-flex v-else shrink>Regular</v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout v-for="name in transaction.names" :key="name.choice" class="border-top" style="padding: 20px 0px;">
                <v-flex class="bold" shrink style="font-size: 15px; width: 200px;">Name {{ name.choice }}:</v-flex>
                <v-flex class="pl-4" shrink style="font-size: 17px;">
                  {{ name.name }}
                  <CompNameIcon v-if="name.state && name.state !== 'NE'" :state="name.state" />
                  <span v-else> (Draft)</span>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
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
      // needs to be set again after ^ dispatch?? I don't know why
      sessionStorage.setItem('KEYCLOAK_TOKEN', this.$route.query.token)
      this.$store.commit('setPendingNameRequest', false)

      await this.$store.dispatch('getTransactionsHistory', this.nr)
      this.$store.commit('setPendingTransactionsRequest', false)
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
      names() {
        if (this.nrInfo && this.nrInfo.names) {
          return this.nrInfo.names.sort(
            function(a, b) { 
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
        let classes = ['name-option']
        if ( this.activeNameChoice == name.choice) { classes.push('bold') }
        if (name.state === 'APPROVED' || name.state === 'CONDITION') {
          classes.push('accepted')
        }
        return classes
      },
      getTransactionItemClasses(index) {
        let classes = ['transaction-item']
        if (index%2 === 0) classes.push('bg-shaded')
        return classes
      },
      requestType_desc(requestType) {
        try {
          return getDescFromList(this.listRequestTypes, requestType)
        } catch (err) {
          return 'N/A'
        }
      },
    }
  }
</script>

<style>
  #trans-main-panel > div > div > div > div.v-datatable.v-table.theme--light > div > div.v-datatable__actions__select {
    display: none !important;
  }
</style>

<style scoped>
#transaction-background {
  background-color: var(--l-grey);
}
#transaction-list {
  overflow: auto;
  padding: 0;
  position: absolute;
}
#transaction-list-wrapper {
  flex: 1;
  height: 90vh;
  overflow: auto;
  padding: 0;
  position: relative;
}
#transaction-main-container {
  max-width: 1200px;
  padding: 0;
}
.bg-shaded {
  background-color: var(--xl-grey);
}
.bold {
  font-weight: 600;
}
.border-right {
  border-right: thin solid var(--l-grey);
}
.border-top {
  border-top: thin solid var(--grey);
}
.copy-normal {
  color: var(--text);
  font-size: 16px;
}
.copy-lg {
  color: var(--text);
  font-size: 19px;
}
.decision-text {
  padding: 0;
  margin: 0;
  font-size: 11px;
  position: relative;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.grey-bar {
  background-color: var(--d-grey);
  color: white;
}
.name-option {
  font-size: 17px;
}
.name-option.accepted {
  color: var(--cyan);
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
  background-color: white;
  padding: 30px;
}
.transaction-header-info {
  overflow: auto;
  padding-top: 25px;
}
.transaction-header-names {
  padding-top: 5px;
}
.transaction-header-title {
  padding-bottom: 20px;
}
.transaction-item {
  padding: 40px 30px 20px 30px;
}
</style>
