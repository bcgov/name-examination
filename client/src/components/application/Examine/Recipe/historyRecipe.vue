/* eslint-disable */
<template>
  <div class="container-fluid">

    <div class="row" >
      <div class="col"><historyListview /></div>
      <div class="col"><historyInfoview /></div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
  import historyInfoview from '@/components/application/Examine/Recipe/history/historyInfo.vue';
  import historyListview from '@/components/application/Examine/Recipe/history/historyList.vue';

  export default {
    name: 'historyRecipe',
    computed: {
    },
    components: {
      historyInfoview,
      historyListview
    }
  }
</script>

<style scoped>
</style>
