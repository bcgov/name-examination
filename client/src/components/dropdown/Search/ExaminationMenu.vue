/* eslint-disable */
<template>
  <div>
    <div>
      <div class="menu-sect">

        <div class="row">
        <div class="col"><button @click="nameApproved()" >Approved</button></div>
          <div class="col"><button @click="nameRejected()" >Reject</button></div>
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
        //this.$store.dispatch('selectNextCompany');
        this.$store.dispatch('getpostgrescompNo');
      },
      nameApproved() {
        this.$store.dispatch('nameApproved');
      },
      nameRejected() {
        this.$store.dispatch('nameRejected');
      }
    }
  }
</script>

<style scoped>
  .menu-sect {
  }
</style>
