/* eslint-disable */
<template>
  <div>
    <h2>Your authorization is missing or has expired. Please login</h2>
  </div>
</template>

<script>
/* eslint-disable */
var authorized = localStorage.getItem("AUTHORIZED");

export default {
    name: 'LandingPage',
    data() {
      return {}
    },
    components: {
    //  StdHeader
    },
    mounted() {
      if(!authorized){
      };
    },
    methods: {
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
