/* eslint-disable */
<template>
  <div>
  <std-header></std-header>
  <router-view ></router-view>
    <p>main page</p>
  </div>
</template>

<script>
/* eslint-disable */

  import StdHeader from '@/components/application/sections/StdHeader.vue'

  export default {
    name: "main-page",
    components: {
      StdHeader
    }
  }
</script>

<style scoped>

</style>
