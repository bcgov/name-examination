<template>
  <div class="relative inline-block">
    <button
      class="text-blue-500 pl-4"
      @mouseover="showVersionNumbers = true"
      @mouseleave="showVersionNumbers = false"
    >
      Version
    </button>
    <div
      v-if="showVersionNumbers"
      class="absolute z-10 w-56 left-0 transform -translate-x-full top-[-3.5rem]
              px-5 py-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg"
    >
      <div>Name Examination: {{ nameExaminationVersion }}</div>
      <div>NameX: {{ nameXVersion }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const showVersionNumbers = ref(false)
const nameExaminationVersion = 'TO_DO'
const nameXVersion = ref('TO_DO')
</script>
