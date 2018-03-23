/* eslint-disable */
<template>
  <div>

     <!-- router-view ></router-view -->
    <h2>You should only see this page if you got here un-authenticated. Please login</h2>
  </div>
</template>

<script>
/* eslint-disable */
  import StdHeader from '@/components/application/sections/StdHeader.vue'

  export default {
    name: 'LandingPage',
    data() {
      return {}
    },
    components: {
      StdHeader
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
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
