<template>
  <div class="text-sm">
    <ExamineRequestInfoExpandable title="Additional Info">
      <template #minimized>
        <p>{{ additionalInfoDisplay }}</p>
      </template>

      <template #popup>
        <div v-if="examine.is_my_current_nr">
          <EditableTextBox
            v-model="info"
            class="h-72"
            placeholder="Additional Info..."
            :character-limit="characterLimit"
            @submit="saveEdits"
            @cancel="cancelEdits"
          />
          <p v-if="info.length > characterLimit" class="font-bold text-red-600">
            {{ characterLimitDisplay }}
          </p>
        </div>
        <p v-else>{{ additionalInfoDisplay }}</p>
      </template>

      <template #maximized>
        <p>{{ additionalInfoDisplay }}</p>
      </template>

      <template #editable>
        <EditableTextBox
          class="h-72"
          v-model="info"
          placeholder="Additional Info..."
          :character-limit="characterLimit"
          hide-submit
          hide-cancel
        />
        <p v-if="info.length > characterLimit" class="font-bold text-red-600">
          {{ characterLimitDisplay }}
        </p>
      </template>
    </ExamineRequestInfoExpandable>
  </div>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
const examine = useExamination()

const characterLimit = 150
const characterLimitDisplay = `Message cut off at ${characterLimit} characters`

const info = ref(examine.additionalInfo)

const additionalInfoDisplay = computed(() =>
  [examine.additionalInfoTransformedTemplate, examine.additionalInfo]
    .filter((s) => s != null)
    .join('\n')
)

function saveEdits() {
  examine.additionalInfo = info.value.substring(0, characterLimit)
  info.value = examine.additionalInfo
}

function cancelEdits() {
  syncAdditionalInfo()
}

function syncAdditionalInfo() {
  info.value = examine.additionalInfo ?? ''
}

examine.addEditAction({
  validate: () => true,
  update: saveEdits,
  cancel: cancelEdits,
})

watch(
  () => [examine.additionalInfo],
  (_state) => {
    syncAdditionalInfo()
  },
  { deep: true }
)
</script>
