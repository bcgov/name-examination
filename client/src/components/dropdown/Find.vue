/* eslint-disable */
<template>
  <div>

    <div class="upper-section container-fluid">
      <div class="findPage">
        <findfilter />
      </div>
    </div>

  </div>

</template>

<script>
/* eslint-disable */
  import findfilter from '@/components/dropdown/Find/findFilter.vue';

  export default {
    name: "find",
    data:{
      visble: true
    },
    computed: {
      details() {
        return this.$store.getters.details;
      }
    },
    components: {
      findfilter
    },
  }
</script>

<style scoped>
</style>
