<!--eslint-disable-->
<template>
  <div class="col-2">

    <div class="nav flex-column nav-pills recipe-steps" id="v-pills-tab" role="tablist"
         aria-orientation="vertical">

      <div id="History1">
        <i id="History2"></i></div>
      <a class="nav-link active" data-toggle="pill" href="#"
         @click="clickRecipeCard('History')">History</a>
      <div class="arrow-right"></div>

      <div id="Conflict1">
        <i id="Conflict2"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Conflicts')">
        Conflicts
      </a>
      <div class="arrow-right"></div>

      <div id="Condition1">
        <i id="Condition2"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Condition')">Condition</a>
      <div class="arrow-right"></div>

      <div id="Trademarks1">
        <i id="Trademarks2"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Trademarks')">Trademarks &reg;</a>
      <div class="arrow-right"></div>

      <!--<div class="icon icon-pass"><i class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Format')">Format</a>
      <div class="arrow-right"></div>-->

    </div>
  </div>

</template>

<script defer>
/* eslint-disable */
export default {
  name: 'matches',
  mounted() {
    this.currentRecipeCard = "History"
    this.setConflicts();
    this.setConditions();
    this.setTrademarks();
    this.setHistory();
  },
  computed: {
    currentRecipeCard: {
      get: function () {
        return this.$store.getters.currentRecipeCard;
      },
      set: function (value) {
        this.$store.commit('currentRecipeCard', value);
      }
    },
    conflictsInfo() {
      return this.$store.getters.conflictsJSON;
    },
    conditionInfo() {
      return this.$store.getters.conditionsJSON;
    },
    trademarkInfo() {
      return this.$store.getters.trademarksJSON;
    },
    historyInfo() {
      return this.$store.getters.historiesJSON;
    },
  },
  methods: {
    clickRecipeCard(recipeCard) {
      this.currentRecipeCard = recipeCard
    },
    setConflicts() {
      /*
      If there are any conflicts, set to FAIL; otherwise PASS.
       */
      if (this.conflictsInfo == null || this.conflictsInfo == undefined) {
        this.setPass('Conflict');
      }
      else if (this.conflictsInfo.names.length == 0) {
        this.setPass('Conflict');
      }
      else {
        this.setFail('Conflict');
      }
    },
    setConditions() {
      // if no restricted words -> call setPass
      // else if any word has all possible conditions with allow us as 'N' -> call setFail
      // else -> call setConcern

      var conditionInfo = this.conditionInfo;
      if (conditionInfo != null) {
        conditionInfo = conditionInfo.restricted_words_conditions;
        if (conditionInfo.length != 0) {

          var fail = false;
          var wIter;
          var cIter;
          // loop through restricted words and their list of conditions
          for (wIter = 0; wIter < conditionInfo.length; wIter++) {
            var tmpF = true;

            // loop through list of condition info and grab 'allow_use' info for each one
            for (cIter = 0; cIter < conditionInfo[wIter].cnd_info.length; cIter++) {
              if (conditionInfo[wIter].cnd_info[cIter].allow_use == 'Y') {
                tmpF = false;
              }
            }
            // if true then all conditions for this word had 'allow_use' = 'N'
            if (tmpF) {
              fail = true;
              break;
            }
          }
          // if true then at least 1 word had 'allow_use' = 'N' for every condition
          if (fail) {
            this.setFail('Condition');
          } else {
            this.setConcern('Condition');
          }
        } else {
          this.setPass('Condition');
        }
      } else {
        console.log('error: setConditions() run before conditionsJSON was set.')
        this.setPass('Condition');
      }
    },
    setTrademarks() {
      /*
      If there are any trademarks, set to FAIL; otherwise PASS.
       */
      if (this.trademarkInfo == null || this.trademarkInfo == undefined) {
        this.setPass('Trademarks');
      }
      else if (this.trademarkInfo.names.length == 0) {
        this.setPass('Trademarks');
      }
      else {
        this.setFail('Trademarks');
      }
    },
    setHistory() {
      /*
      If there is any history, set to CONCERN; otherwise PASS.
       */
      if (this.historyInfo == null || this.historyInfo == undefined) {
        this.setPass('History');
      }
      else if (this.historyInfo.names.length == 0) {
        this.setPass('History');
      }
      else {
        this.setConcern('History');
      }
    },
    setFail(val){
      console.log('fail + ' + val);
      var val1 = val+'1';
      var val2 = val+'2';

      document.getElementById(val1).className = "icon icon-fail";
      document.getElementById(val2).className = "fa fa-times";
    },
    setConcern(val){
      console.log('concern + ' + val);
      var val1 = val+'1';
      var val2 = val+'2';

      document.getElementById(val1).className = "icon icon-concern";
      document.getElementById(val2).className = "fa fa-exclamation";
    },
    setPass(val){
      console.log('pass + ' + val);
      var val1 = val+'1';
      var val2 = val+'2';

      document.getElementById(val1).className = "icon icon-pass";
      document.getElementById(val2).className = "fa fa-check";
    }
  },
  watch: {
    conflictsInfo: function (val) {
      // set severity flag on recipe menu
      this.setConflicts();
    },
    conditionInfo: function (val) {
      // set severity flag on recipe menu
      this.setConditions();
    },
    trademarkInfo: function (val) {
      // set severity flag on recipe menu
      this.setTrademarks();
    },
    historyInfo: function (val) {
      // set severity flag on recipe menu
      this.setHistory();
    },
  },
}
</script>

<style scoped>
  .match-sect {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
  }
  .match-font{
    font-size: large;
  }
  .match-part {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
  }
  .match-r{
    background-color: rgba(219, 30, 26, 0.91);
  }
  .match-g{
    background-color: #3cbf15;
  }
  .match-y{
    background-color: rgba(249, 244, 42, 0.99);
  }
  .match-d{
    background-color: rgba(169, 169, 169, 0.99);
  }

  /* RECIPE STEPS */

  .recipe-steps
  {
    display: block;
    width: 200px;
  }

  .recipe-steps .nav-link
  {
    color: black;
    background-color: #efefef;
    border-radius: 0;
    float: left;
    width: 145px;
    margin: 4px 0;
  }
  .recipe-steps .nav-link.active
  {
    color: black;
    font-weight: bold;
    background-color: #ccc;
  }

  .recipe-steps .arrow-right {
    width: 0;
    height: 0;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-left: 17px solid #ccc;
    float:left;
    margin: 4px 0;
    display: none;
  }

  .recipe-steps .nav-link.active + .arrow-right {
    display: block;
  }

  .recipe-steps .icon
  {
    width: 34px;
    height: 34px;
    float: left;
    margin: 4px 0;
    display: block;
    text-align: center;
    font-size: 23px;
    color: white;
  }

  .recipe-steps .icon-fail
  {
    background-color: #c00;
  }

  .recipe-steps .icon-concern
  {
    background-color: #a60;
  }

  .recipe-steps .icon-pass
  {
    background-color: #38761d;
  }
</style>

