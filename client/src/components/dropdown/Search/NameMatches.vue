/* eslint-disable */
<template>
  <div class="col-2">

    <!-- NOTE - these are hardcoded styles right now - will need to control red/yellow/green
    programmatically -->
    <div class="nav flex-column nav-pills recipe-steps" id="v-pills-tab" role="tablist"
         aria-orientation="vertical">

      <div class="icon icon-fail"><i class="fa fa-times"></i></div>
      <a class="nav-link active" data-toggle="pill" href="#" @click="clickIssueBox('M1')">
        Conflicts
      </a>
      <div class="arrow-right"></div>

      <div class="icon icon-concern"><i class="fa fa-exclamation"></i></div>
      <a class="nav-link" data-toggle="pill" href="#" @click="clickIssueBox('M2')">Consent</a>
      <div class="arrow-right"></div>

      <div class="icon icon-pass"><i class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#" @click="clickIssueBox('M3')">Trademarks</a>
      <div class="arrow-right"></div>

      <div class="icon icon-pass"><i class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#" @click="clickIssueBox('M4')">History</a>
      <div class="arrow-right"></div>

      <div class="icon icon-pass"><i class="fa fa-check"></i></div>
      <a class="nav-link" data-toggle="pill" href="#" @click="clickIssueBox('M5')">Format</a>
      <div class="arrow-right"></div>
    </div>
  </div>

</template>

<script defer>
/* eslint-disable */
export default {
  name: 'matches',
  data: function () {
    return {
      mess: "Here"
    }
  },
  mounted() {
    //alert("here");
    this.setOriginalBackgrnd();
  },
  updated() {
    //alert("here2");
  },
  methods: {
    clickIssueBox(divID) {
      //const mDiv = document.getElementById(divID);
      //mDiv.innerText = "Div is: " + divID;
      //this.setOriginalBackgrnd();
      //alert("Here");
      this.$store.dispatch('selectNameIssue',divID);
    },
    setOriginalBackgrnd() {
      // alert("here2");
      const mDiv1 = document.getElementById("M1");
      //mDiv1.className = "row match-part match-d";
      const mDiv2 = document.getElementById("M2");
      //mDiv2.className = "row match-part match-d";
      const mDiv3 = document.getElementById("M3");
      //mDiv3.className = "row match-part match-d";
      const mDiv4 = document.getElementById("M4");
      //mDiv4.className = "row match-part match-d";
      const mDiv5 = document.getElementById("M5");
      //mDiv5.className = "row match-part match-d";
    }
  }
};
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
