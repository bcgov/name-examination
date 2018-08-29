<!--eslint-disable-->
<template>
  <span>
    <p class="state-text">{{currentState}}</p>
  </span>
</template>

<script>
/* eslint-disable */
  export default {
    name: "stateHeader",
    computed: {
      currentState() {
        return this.$store.getters.currentState
      }
    }
  }
</script>

<style scoped>
  .state-text {
    text-align: center;
    font-size: 1.5em;
  }
</style>
