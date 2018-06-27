/* eslint-disable */
<template>
  <div class="container-fluid">

      <div class="row" >
        <div v-if="is_Conflict" class="col"><conflictRecipe /></div>
        <div v-if="is_Condition" class="col"><conditionRecipe /></div>
        <div v-if="is_Trademarks" class="col"><trademarksRecipe /></div>
        <div v-if="is_History" class="col"><historyRecipe /></div>
      </div>

  </div>
</template>

<script>
/* eslint-disable */
import conflictRecipe from '@/components/application/Examine/Recipe/conflictRecipe.vue';
import conditionRecipe from '@/components/application/Examine/Recipe/conditionRecipe.vue';
import trademarksRecipe from '@/components/application/Examine/Recipe/trademarksRecipe.vue';
import historyRecipe from '@/components/application/Examine/Recipe/historyRecipe.vue';

export default {
  name: 'IssueInfo',
  computed: {
    is_Conflict() {
      if(this.currentRecipeCard == 'Conflicts') { return true }
      return false
    },
    is_Condition() {
      if(this.currentRecipeCard == 'Condition') { return true }
      return false
    },
    is_Trademarks() {
      if(this.currentRecipeCard == 'Trademarks') { return true }
      return false
    },
    is_History() {
      if(this.currentRecipeCard == 'History') { return true }
      return false
    },
    currentRecipeCard() {
      return this.$store.getters.currentRecipeCard
    }
  },
  components: {
    conflictRecipe,
    conditionRecipe,
    historyRecipe,
    trademarksRecipe
  }
}
</script>

<style scoped>
</style>
