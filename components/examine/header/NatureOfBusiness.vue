<template>
  <div class="text-sm">
    <ExamineHeaderItem title="Nature of Business">
      <template #minimized>{{ NOB }} </template>
      <template #popup>{{ NOB }} </template>
      <template #maximized>{{ NOB }} </template>
      <template #editable>{{ NOB }} </template>
    </ExamineHeaderItem>
  </div>
</template>

<script setup lang="ts">
const NOB = `
Here's our nature of business. This one is made long so we can see
what it looks like when nature of business is long. So here's some
more text. And some more.`
</script>
