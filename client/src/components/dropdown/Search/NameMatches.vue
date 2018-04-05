/* eslint-disable */
<template>
  <div id="matches" >
    <div class="container">
      <div class="match-sect match-font">

      <div id="M1" class="row match-part match-y" @click="clickIssueBox('M1')">
        <div class="col">
         1
        </div>
      </div>

      <div id="M2" class="row match-part match-g" @click="clickIssueBox('M2')">
        <div class="col">
         2
        </div>
    </div>

    <div id="M3" class="row match-part match-g" @click="clickIssueBox('M3')">
        <div class="col" >
         3
        </div>
     </div>

    <div id="M4" class="row match-part match-g" @click="clickIssueBox('M4')">
      <div class="col" >
        4
      </div>
    </div>

   <div id="M5" class="row match-part match-r" @click="clickIssueBox('M5')">
    <div class="col" >
      5
    </div>
    </div>

   <div id="M6" class="row match-part match-g" @click="clickIssueBox('M6')" >
      <div class="col" >
       6
      </div>
    </div>

        </div>
      </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'matches',
  data: {
    mess: "Here"
  },
  methods: {
    clickIssueBox(divID) {
      const mDiv = document.getElementById(divID);
      mDiv.innerText = "Div is: " + divID;
      this.$store.dispatch('selectNameIssue',divID);
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
    height: 300px;
  }
  .match-font{
    font-size: large;
    text-align: left;
  }
  .match-part {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
    text-align: left;
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
</style>
