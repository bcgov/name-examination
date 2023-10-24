<template>
  <div class="text-sm">
    <ExamineHeaderItem title="Additional Info">
      <template #minimized>
        <p>{{ INFO }}</p>
      </template>

      <template #popup>
        <EditableTextBox
          placeholder="Additional Info..."
          class="h-72"
          :initial-value="INFO"
        />
      </template>

      <template #maximized>
        <p>{{ INFO }}</p>
      </template>

      <template #editable>
        <EditableTextBox
          placeholder="Additional Info..."
          class="h-72"
          :initial-value="INFO"
          disable-buttons
        />
      </template>
    </ExamineHeaderItem>
  </div>
</template>

<script setup lang="ts">
const INFO = `Here's some additional info.
This one is made long so we can see what it looks like when additional info is long.
So here's some more text. And some more.`
</script>
