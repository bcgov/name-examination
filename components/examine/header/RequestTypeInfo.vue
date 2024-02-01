<template>
  <div class="mx-3 flex flex-col font-bold">
    <p>
      {{ examine.requestTypeObject.text }}
    </p>
    <p class="text-sm">
      {{ jurisdictionDisplay }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const { jurisdiction, jurisdictionNumber } = defineProps<{
  jurisdiction?: string
  jurisdictionNumber?: string
}>()

const examine = useExamineStore()

const jurisdictionDisplay = computed(() => {
  if (!jurisdiction) return ''

  let text = jurisdiction
  if (jurisdiction?.length === 2) {
    // if the jurisdiction name is two letters, it's likely a code for a province, so get the full name
    const province = examine.listJurisdictions.find(
      (j) => j.value === jurisdiction
    )
    if (province) {
      text = province.text
    }
  }
  if (jurisdictionNumber) {
    text = `${text} (${jurisdictionNumber})`
  }
  return text
})
</script>
