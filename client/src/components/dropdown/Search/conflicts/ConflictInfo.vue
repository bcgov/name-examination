/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictInfo">

        <p>
          <label class="labelTxt">Conflicting Info</label>
        </p>


      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ConflictInfo',
    computed: {
      nrNumber() {
        return  this.$store.getters.nrNumber;
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
  .ConflictInfo {
    align-content: left;
    border: 2px solid #eee;
    padding: 0px;
    box-shadow: 0 2px 3px #ccc;
    height: 300px;
  }
</style>
