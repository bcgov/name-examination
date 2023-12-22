<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Additional Info">
      <template #minimized>
        <p>{{ INFO }}</p>
      </template>

      <template #popup>
        <EditableTextBox
          v-if="examine.inProgress"
          class="h-72"
          placeholder="Additional Info..."
          v-model="INFO"
        />
        <p v-else>{{ INFO }}</p>
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
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const INFO = ref(`Here's some additional info.
This one is made long so we can see what it looks like when additional info is long.
So here's some more text. And some more.`)
</script>
