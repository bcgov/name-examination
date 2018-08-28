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
  import findfilter from '@/components/application/Find/findFilter.vue';

  export default {
    name: "find",
    data:{
      visble: true
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      },
      details() {
        return this.$store.getters.details;
      }
    },
    components: {
      findfilter
    },
    watch: {
      auth: {
        handler(selection) {
          if (auth != true) { this.$router.push("/Signin") }
        }
      }
    }
  }
</script>

<style scoped>
</style>
