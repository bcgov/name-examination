/* eslint-disable */
<template>
  <div v-if="!auth">
    <h2 >Your authorization is missing or has expired. Please login</h2>
  </div>
  <div v-else>
    <h2>Names Examination</h2>
    <p>Current status on {{todayStr}}</p>
  </div>
</template>

<script>
/* eslint-disable */

export default {
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
        var states = ['hold', 'draft', 'expired', 'cancelled', 'approved', 'conditional', 'rejected']
        var vm = this
        states.forEach( function(stateCd) {
          console.log("Statistics for " + stateCd)
          vm.$store.dispatch('getStatsDataJSON',stateCd);
        });
      }
    },
    watch: {
      statsData: {
        handler(newData) {
          this.cTotal = 0
          newData.forEach( function(stateCd) {
            var cStateCd = newData[stateCd].response.numFound
            this.CTotal += cStateCd



          });
        }
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
