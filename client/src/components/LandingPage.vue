/* eslint-disable */
<template>
  <div>
    <h2>Your authorization is missing or has expired. Please login</h2>
  </div>
</template>

<script>
/* eslint-disable */

export default {
    name: 'LandingPage',
    data() {
      return {}
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: bold;
    font-size: large;
    padding: 4ch;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
