/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <p>
          <label class="labelTxt">Conflicting Names</label>

        </p>

      </div>

    </div>

  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ConflictList',
    computed: {
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      name() {
        return  this.$store.getters.firstName;
      }
    },
    methods: {
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
      }
    }
  }
</script>

<style scoped>
  .ConflictList {
    align-content: left;
    border: 2px solid #eee;
    padding: 0px;
    box-shadow: 0 2px 3px #ccc;
    height: 300px;
  }
</style>
