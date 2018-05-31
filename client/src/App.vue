/* eslint-disable */
<template>
  <div>
    <div id="app">
        <std-header> </std-header>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import StdHeader from '@/components/application/sections/StdHeader.vue'
  export default {
    name: 'App',
    components:{
      StdHeader
    },
    created () {
      //this.$store.dispatch('tryAutoLogin')
      this.$store.dispatch('loadDropdowns');
    }
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
