<template>
  <ol class="ml-4 basis-1/3 list-decimal space-y-2">
    <li v-for="choice in nameChoices"><TextInput :value="choice.name" /></li>
  </ol>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { NameChoice } from '~/types'

defineProps<{
  nameChoices: Array<NameChoice>
}>()

const examine = useExamineStore()

examine.addEditAction({
  validate() {
    return true
  },
  update() {},
})
</script>
