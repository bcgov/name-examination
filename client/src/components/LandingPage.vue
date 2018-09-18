<!--eslint-disable -->
<template>
  <div v-if="!auth">
    <h2 >Your authorization is missing or has expired. Please login</h2>
  </div>
  <div v-else>
    <h3>Welcome to Name X!</h3>

    <p>Canada’s most modern semi - automated way to examine business name requests. Automated indicators showing you:</p>
    <p>
      <ul>
        <li><b>Conflicts</b> –Searches the name against related industry categories, synonyms, word substitutions ie: 9, nine) and more.
            The conflict search is only as good as the information in it, so if you don’t see something come back
            in the search you should check the SOLR admin tool to see if it is in the correct industry category or other search options
        <li><b>Condition</b> – This gives you the messages to clients and internal information based on condition of words or phrases ie: Doctor, BC etc…</li>
        <li><b>Trademarks</b> – Searches the Canadian Trademarks database and shows you active trademarks related to the name request</li>
        <li><b>History</b> – If a similar name has been approved or rejected previously (use this to tell you if they are holding a name to long)</li>
      </ul>
    </p>
    <p><i>Enjoy the ride!</i></p>
    <br/>

    <h2>Current status on {{todayStr}}</h2>
    <br/>
    <p>Not Examined: <b>{{statsData.draft.response.numFound}}</b><br/></p>
    <p>Hold: <b>{{statsData.hold.response.numFound}}</b><br/></p>
    <br/><br/>

    <span>
    <h2><i>Manual Search Tips:</i></h2>
    <p>Looks for all matching names including synonyms by default.</p><br/>
      <p>+&lt;<i>word</i>&gt; means must contain this word or its synonyms</p>
      <p>+”&lt<i>word1</i>&gt;&lt;<i>word2</i>&gt;” means must include both words or its synonyms</p>
      <p>-&lt<i>word</i>&gt; means remove this word for matching and all its synonyms</p>
      <p>-“&lt<i>word 1</i>&gt;&lt;<i>word 2</i>&gt;” means remove this word phrase and all its synonyms for matching.</p>
      <p>@&lt<i>word</i>&gt; means only use this word do not apply synonyms in matching.</p>
      <p>@”&lt<i>word 1</i>&gt;&lt;<i>word 2</i>&gt;” means only use this word phrase for these words in the name and do not substitute synonyms.</p>
    <p>? substitute one or more letters in a word. Eg. TRE??? – substitute three letters with any letters.</p>
    <p>*Substitute a portion of a word.</p>
    </span>

  </div>

</template>

<script>
/* eslint-disable */

import StdHeader from "./application/sections/StdHeader";

export default {
  components: {StdHeader},
  name: 'LandingPage',
    watch: {
      auth: function (val) {
        console.log("Auth=" + val)
          if(val){ this.getCurrentStats() }
      }
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
      }
    },
    methods: {
      //states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
      getCurrentStats() {
        this.$store.statsDataJSON=null
        console.log("Get Statistics")
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
  h1 {
    font-weight: bold;
    font-size: medium;
    padding-left: 6ch;
    padding-top: 1ch;
  }
  h2 {
    font-weight: bold;
    font-size: large;
    padding-left: 54px;
  }
  h3 {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-weight: bold;
    font-size: 2.25em;
    color: black;
    padding-left: 54px;
    padding-bottom: 1ch;
  }

  p {
    font-size: medium;
    padding-left: 6ch;
  }

  ul {
    padding-top: 1ch;
    padding-left: 6ch;
  }

  li{
    padding-bottom: 1ch;
  }

  a {
    color: #42b983;
  }

  span {
    margin-left: 254px;
  }
</style>
