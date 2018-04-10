/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="menu-sect">

        <div class="row">
        <div class="col"><button @click="getNextCompany()" >Get Next</button></div>
      </div>
      <div class="row">
        <div class="col"></div>
      </div>

      <div class="row">
        <div class="col"></div>
      </div>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ExaminationMenu',
    methods: {
      getNextCompany() {
        this.$store.dispatch('selectNextCompany');
      }
    }
  }
</script>

<style scoped>
  .menu-sect {
    align-content: center;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
  }
</style>
