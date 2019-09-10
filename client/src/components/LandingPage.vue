<!--eslint-disable -->
<template>
  <v-container>
    <v-layout v-if="!auth">
      <v-flex no-auth-message>
        Your authorization is missing or has expired. Please login.
      </v-flex>
    </v-layout>
    <v-layout v-else column fs-16>
      <v-flex fs-26 fw-700>WELCOME TO NAME X!</v-flex>
      <v-flex mt-2 fs-17>
        Canada’s most modern, semi-automated way to examine business name requests. Automated indicators show you:
      </v-flex>

      <v-flex ml-4 mt-2>
        <v-flex fw-600>Conflicts</v-flex>
        <v-flex ml-3>
          Searches the name against related industry categories, synonyms, word substitutions (eg. 9 and nine), and
          more. The conflict search is only as good as the information in it, so if you don’t see something come back in
          the search you should check the SOLR admin tool to see if it is in the correct industry category or other
          search options.
        </v-flex>
        <v-flex fw-600>Condition</v-flex>
        <v-flex ml-3>
          This gives you the messages to clients and internal information based on condition of words or phrases, eg.
          'Doctor', 'BC', and such.
        </v-flex>
        <v-flex fw-600>Trademarks</v-flex>
        <v-flex ml-3>
          Searches the Canadian Trademarks database and shows you active trademarks related to the name request.
        </v-flex>
        <v-flex fw-600>History</v-flex>
        <v-flex ml-3>
          If a similar name has been approved or rejected previously (use this to tell you if they are holding a name
          too long).
        </v-flex>
      </v-flex>
      <v-flex mt-4 pa-3 stats-box>
        <v-flex>Current status on {{todayStr}}</v-flex>
        <v-flex my-3>Not Examined: <b>{{statsData.draft.response.numFound}}</b></v-flex>
        <v-flex>Hold: <b>{{statsData.hold.response.numFound}}</b></v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */

import StdHeader from "./application/sections/StdHeader"
import moment from 'moment'

export default {
  components: {StdHeader},
  name: 'LandingPage',
    watch: {
      auth: function (val) {
          if(val){ this.getCurrentStats() }
      }
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      },
      todayStr() {
        return moment().format('YYYY-MM-DD, h:mm a')
      },
      statsData() {
        return this.$store.getters.statsDataJSON;
      }
    },
    methods: {
      //states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
      getCurrentStats() {
        this.$store.statsDataJSON=null
        //var nStates = ['hold', 'draft', 'expired', 'cancelled', 'approved', 'conditional', 'rejected']
        var nStates = ['hold', 'draft']
        var vm = this
        nStates.forEach( function(stateCd) {
          vm.$store.dispatch('getStatsDataJSON',stateCd);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .no-auth-message {
    font-size: 18px;
    color: var(--text);
    margin: 20px 0 0 20px;
  }

  .stats-box {
    background-color: white;
    border: 1px solid silver;
  }

  .fs-26 {
    font-size: 26px;
  }
</style>
