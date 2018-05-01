/* eslint-disable */
<template>
  <div class="container-fluid">
    <div id="app">
        <std-header> </std-header >
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
      this.$store.dispatch('tryAutoLogin')
    }
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
