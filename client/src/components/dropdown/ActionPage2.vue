/* eslint-disable */
<template>
  <div id="action">
    <div class="action-form">
     Action Page 1
      <form @submit.prevent="onSubmit">
        <div class="input">
          <label for="input1">Input 1</label>
          <input
            type="text"
            id="id1"
            v-model="t1">
        </div>
        <div class="input">
          <label for="input2">Input 2</label>
          <input
            type="text"
            id="id2"
            v-model="t2">
        </div>
        <div class="submit">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

  import StdHeader from '@/components/application/sections/StdHeader.vue'

  export default {
    name: "action-page",
    data(){
      return (
      t1,
      t2
      )
    },
    components: {
      StdHeader
    },
    methods: {
      onSubmit: function () {
        const form1Data = {
          t1: this.t1,
          t2: this.t2
        }
        this.$store.dispatch('storeActionPage', {t1: form1Data.t1, t2: form1Data.t2})
      }
    }
  }
</script>

<style scoped>

</style>
