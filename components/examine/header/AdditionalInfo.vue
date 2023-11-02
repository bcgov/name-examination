<template>
  <div class="text-sm">
    <ExamineHeaderItem title="Additional Info">
      <template #minimized>
        <p>{{ INFO }}</p>
      </template>

      <template #popup>
        <EditableTextBox
          class="h-72"
          placeholder="Additional Info..."
          v-model="INFO"
        />
      </template>

      <template #maximized>
        <p>{{ INFO }}</p>
      </template>

      <template #editable>
        <EditableTextBox
          class="h-72"
          v-model="INFO"
          placeholder="Additional Info..."
          disable-buttons
        />
      </template>
    </ExamineHeaderItem>
  </div>
</template>

<script setup lang="ts">
const INFO = ref(`Here's some additional info.
This one is made long so we can see what it looks like when additional info is long.
So here's some more text. And some more.`)
</script>
