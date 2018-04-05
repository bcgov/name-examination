/* eslint-disable */
<template>
  <div>
    <div class="container">
      <div class="issue-sect" >
      <div class="row" >
        Issue <br/>
        <div id="ISSUEINFO" class="col issue-font" >
          <p>{{issueText}}</p>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'IssueInfo',
    computed: {
      issueText() {
        return  this.$store.getters.issueText;
      }
    }
  }
</script>

<style scoped>
  .issue-sect {
    align-content: center;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
    background-color: rgba(154, 205, 142, 0.65);
    height:300px;
  }
  .issue-font{
    font-size: large;
    text-align: left;
  }
</style>
