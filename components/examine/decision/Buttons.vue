<template>
  <div class="flex justify-between justify-self-end">
    <IconButton
      light
      class="bg-lime-600"
      mnemonic="a"
      @click="examine.isComplete = true"
    >
      <CheckIcon class="h-5 w-5 stroke-2" />
      <template #text><u>A</u>pprove Name</template>
    </IconButton>

    <IconButton light mnemonic="r" @click="examine.isComplete = true">
      <XMarkIcon class="h-5 w-5 stroke-2" />
      <template #text><u>R</u>eject Name</template>
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
const examine = useExamineStore()
</script>
