<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Nature of Business">
      <template #minimized>
        <p>{{ NOB }}</p>
      </template>

      <template #popup>
        <p>{{ NOB }}</p>
      </template>

      <template #maximized>
        <p>{{ NOB }}</p>
      </template>

      <template #editable>
        <p>{{ NOB }}</p>
      </template>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
const NOB = `
Here's our nature of business. This one is made long so we can see
what it looks like when nature of business is long. So here's some
more text. And some more.`
</script>
