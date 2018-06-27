/* eslint-disable */
<template>
  <div class="col-2">

    <!-- NOTE - these are hardcoded styles right now - will need to control red/yellow/green
    programmatically -->
    <div class="nav flex-column nav-pills recipe-steps" id="v-pills-tab" role="tablist"
         aria-orientation="vertical">

      <div id="Conflict1" class="icon icon-fail">
        <i id="Conflict2" class="fa fa-times"></i></div>
      <a class="nav-link active" data-toggle="pill" href="#"
         @click="clickRecipeCard('Conflicts')">
        Conflicts
      </a>
      <div class="arrow-right"></div>

      <div id="Condition1" class="icon icon-concern">
        <i id="Condition2" class="fa fa-exclamation"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Condition')">Condition</a>
      <div class="arrow-right"></div>

      <div id="Trademarks1" class="icon icon-pass">
        <i id="Trademarks2" class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('Trademarks')">Trademarks &reg;</a>
      <div class="arrow-right"></div>

      <div id="History1" class="icon icon-pass">
        <i id="History2" class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#"
         @click="clickRecipeCard('History')">History</a>
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
    this.currentRecipeCard = "Conflicts"
  },
  computed: {
    exists_Conflicts() {
      if(this.$store.getters.conflictsJSON != null){ return true }
      return false
    },
    exists_Conditions() {
      console.log('exists_conditions1');
      var conditionInfo = this.$store.getters.conditionsJSON.restricted_words_conditions;
      if(conditionInfo.length != 0){

        var fail = false;
        var wIter;
        var cIter;

        for (wIter=0;wIter<conditionInfo.length;wIter++) {
          var tmpF = true;
          for (cIter=0;cIter<conditionInfo[wIter].cnd_info.length;cIter++) {
            if (conditionInfo[wIter].cnd_info[cIter].allow_use == 'Y') {
              tmpF = false;
            }
          }
          if (tmpF) {
            fail = true;
            break;
          }
        }

        if (fail) {
          this.setFail('condition');
        } else {
          this.setConcern('condition');
        }

      } else {
        this.setPass('condition');
      }
    },
    exists_Trademarks() {
      if(this.$store.getters.trademarksJSON != null){ return true }
      return false
    },
    exists_Histories() {
      if(this.$store.getters.historiesJSON != null){ return true }
      return false
    },
    currentRecipeCard: {
      get: function () {
        return this.$store.getters.currentRecipeCard;
      },
      set: function (value) {
        this.$store.commit('currentRecipeCard', value);
      }
    }
  },
  methods: {
    clickRecipeCard(recipeCard) {
      this.currentRecipeCard = recipeCard
    },
    setFail(val){
      console.log('fail');
    },
    setConcern(val){
      console.log('concern');
    },
    setPass(val){
      console.log('pass');
    }

  }
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
