<template>
  <div class="mx-3 flex flex-col font-bold">
    <p>
      {{ examine.requestTypeObject.text }}
    </p>
    <p v-if="jurisdiction" class="text-sm">
      {{ jurisdictionDisplay }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const props = defineProps<{
  jurisdiction?: string
  jurisdictionNumber?: string
}>()

const examine = useExamineStore()

const jurisdictionDisplay = computed(() => {
  let text = props.jurisdiction
  if (props.jurisdiction?.length === 2) {
    // if the jurisdiction name is two letters, it's likely a code for a province, so get the full name
    const province = examine.listJurisdictions.find(
      (j) => j.value === props.jurisdiction
    )
    if (province) {
      text = province.text
    }
  }
  if (props.jurisdictionNumber) {
    text = `${text} (${props.jurisdictionNumber})`
  }
  return text
})
</script>
