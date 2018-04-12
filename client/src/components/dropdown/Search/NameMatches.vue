/* eslint-disable */
<template>
  <div id="matches">
    <div class="container-fluid">
      <div class="match-sect match-font">

        <div id="M1" class="row match-part match-y" @click="clickIssueBox('M1')">
        <div class="col">
         Name Matches
        </div>
      </div>

      <div id="M2" class="row match-part match-g" @click="clickIssueBox('M2')">
        <div class="col">
         Consent
        </div>
    </div>

    <div id="M3" class="row match-part match-g" @click="clickIssueBox('M3')">
        <div class="col" >
         Trademarks
        </div>
     </div>

    <div id="M4" class="row match-part match-g" @click="clickIssueBox('M4')">
      <div class="col" >
        History
      </div>
    </div>

   <div id="M5" class="row match-part match-r" @click="clickIssueBox('M5')">
    <div class="col" >
      Format
    </div>
    </div>

        </div>
      </div>
  </div>
</template>

<script defer>
/* eslint-disable */
export default {
  name: 'matches',
  data: {
    mess: "Here"
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
      mDiv1.className = "row match-part match-d";
      const mDiv2 = document.getElementById("M2");
      mDiv2.className = "row match-part match-d";
      const mDiv3 = document.getElementById("M3");
      mDiv3.className = "row match-part match-d";
      const mDiv4 = document.getElementById("M4");
      mDiv4.className = "row match-part match-d";
      const mDiv5 = document.getElementById("M5");
      mDiv5.className = "row match-part match-d";
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
</style>
