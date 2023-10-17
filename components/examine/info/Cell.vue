<template>
  <div
    v-if="state === 'summarized'"
    class="ml-10 h-36 w-48 overflow-clip bg-gray-100 p-2"
  >
    <button @click="state = 'expanded'">expand</button>
    <p>Here's some content</p>
    <p>State: {{ state }}</p>
    <ul>
      <li v-for="option in options">Option {{ option }}</li>
    </ul>
  </div>
  <div v-else>
    <div class="h-36"></div>
    <div
      class="absolute z-10 ml-10 h-fit w-48 rounded-md border border-gray-400 bg-gray-100 p-2 shadow-xl"
    >
      <button @click="state = 'summarized'">hide</button>
      <p>Here's some content</p>
      <p>State: {{ state }}</p>
      <ul>
        <li v-for="option in options">Option {{ option }}</li>
      </ul>
    </div>
  </div>
  <p>Here's something outside</p>
</template>

<script setup lang="ts">
type InfoCellState = 'summarized' | 'expanded' | 'editable'
const state = ref<InfoCellState>('summarized')
const options = Array.from({ length: 20 }, (_, key) => key + 1)
</script>
