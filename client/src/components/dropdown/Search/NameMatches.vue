/* eslint-disable */
<template>
  <div>
    <div class="container">
      <div class="match-sect match-font">

      <div id="M1" class="row match-part match-y">
        <div class="col">
         1
        </div>
      </div>

      <div id="M2" class="row match-part match-g">
        <div class="col">
         2
        </div>
    </div>

    <div id="M3" class="row match-part match-g">
        <div class="col" >
         3
        </div>
     </div>

    <div id="M4" class="row match-part match-g">
      <div class="col" >
        4
      </div>
    </div>

   <div id="M5" class="row match-part match-r">
    <div class="col" >
      5
    </div>
    </div>

   <div id="M6" class="row match-part match-g" onclick="getIssueInfo('M6')" >
      <div id="M6C" class="col" >
        6
      </div>
    </div>

        </div>
      </div>
  </div>
</template>

<script>
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
