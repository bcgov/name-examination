/* eslint-disable */
<template>
  <div v-if="!auth">
    <h2 >Your authorization is missing or has expired. Please login</h2>
  </div>
  <div v-else>
    <h2>Names Examination</h2>
    <p>Current status on {{todayStr}}</p>
    <table>
      <tr>
        <td colspan="2"><b>Queue Status</b></td>
      </tr>
      <tr>
        <td>Not Examined:</td>
        <td>{{statsData.draft.response.numFound}}</td>
      </tr>
      <tr>
        <td>Hold:</td>
        <td>{{statsData.hold.response.numFound}}</td>
      </tr>
      <tr>
        <td>Approved:</td>
        <td>{{statsData.approved.response.numFound}}</td>
      </tr>
      <tr>
        <td>Conditional:</td>
        <td>{{statsData.conditional.response.numFound}}</td>
      </tr>
      <tr>
        <td>Rejected:</td>
        <td>{{statsData.rejected.response.numFound}}</td>
      </tr>
      <tr>
        <td>Cancelled:</td>
        <td>{{statsData.cancelled.response.numFound}}</td>
      </tr>
      <tr>
        <td>Expired:</td>
        <td>{{statsData.expired.response.numFound}}</td>
      </tr>
    </table>

  </div>

</template>

<script>
/* eslint-disable */

import StdHeader from "./application/sections/StdHeader";

export default {
  components: {StdHeader},
  name: 'LandingPage',
    data() {
      return {
        cHold:0,
        cDraft:0,
        cExpired:0,
        cCancelled:0,
        cApproved:0,
        cConditional:0,
        cRejected:0,
        cTotal: 0
      }
    },
    mounted() {
      this.getCurrentStats()
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      },
      todayStr() {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var d = new Date();
        return days[d.getDay()] + "," + months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear()
      },
      statsData() {
        return this.$store.getters.statsDataJSON;
      },
    },
    methods: {
      //states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
      getCurrentStats() {
        this.$store.statsDataJSON=null
        console.log("Get Statistics")
        var nStates = ['hold', 'draft', 'expired', 'cancelled', 'approved', 'conditional', 'rejected']
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
  h1, h2 {
    font-weight: bold;
    font-size: large;
    padding: 4ch;
  }

  h3 {
    font-weight: bold;
    font-size: x-large;
    padding: 4ch;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  p {
    font-size: large;
    padding: 4ch;
  }

  a {
    color: #42b983;
  }
</style>
