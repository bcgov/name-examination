<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Additional Info">
      <template #minimized>
        <p>{{ examine.additionalInfo }}</p>
      </template>

      <template #popup>
        <EditableTextBox
          v-if="examine.inProgress"
          v-model="info"
          class="h-72"
          placeholder="Additional Info..."
          @submit="saveEdits"
          @cancel="cancelEdits"
        />
        <p v-else>{{ examine.additionalInfo }}</p>
      </template>

      <template #maximized>
        <p>{{ examine.additionalInfo }}</p>
      </template>

      <template #editable>
        <EditableTextBox
          class="h-72"
          v-model="info"
          placeholder="Additional Info..."
          hide-submit
          hide-cancel
        />
      </template>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const info = ref(examine.additionalInfo)

function saveEdits() {
  examine.additionalInfo = info.value
}

function cancelEdits() {
  info.value = examine.additionalInfo
}
</script>
