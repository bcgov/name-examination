/* eslint-disable */
<template>
  <findfilter />
</template>

<script>
/* eslint-disable */
  import findfilter from '@/components/application/Find/findFilter.vue'

  export default {
    name: "find",
    components: { findfilter, },
    data() {
      return {
        visble: true,
      }
    },
    computed: {
      auth() {
        return this.$store.getters.isAuthenticated
      },
      details() {
        return this.$store.getters.details
      },
    },
    watch: {
      auth: {
        handler() {
          if (auth != true) this.$router.push("/Signin")
        }
      },
    }
  }
</script>
