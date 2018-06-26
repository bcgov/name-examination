/* eslint-disable */
<template>
  <div class="container-fluid">

    <div id="condition" class="row" >
      <div class="col"><conditionInfo /></div>

    </div>

  </div>
</template>

<script>
/* eslint-disable */
  import conditionInfo from '@/components/application/Examine/Recipe/conditions/conditionInfo.vue';

  export default {
    name: 'conditionRecipe',
    components: {
      conditionInfo
    }
  }
</script>

<style scoped>
  #condition {
    margin: 20px;
  }
</style>
