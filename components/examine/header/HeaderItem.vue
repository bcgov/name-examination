<template>
  <div class="rounded-md text-sm">
    <ExamineHeaderPopover
      :title="title"
      v-if="examine.headerState === 'minimized'"
    >
      <template #minimized><slot name="minimized"></slot></template>
      <template #expanded><slot name="popup"></slot></template>
    </ExamineHeaderPopover>

    <div v-else-if="examine.headerState === 'maximized'">
      <span class="font-bold">{{ title }}</span>
      <slot name="maximized"></slot>
    </div>

    <!-- Editable state -->
    <div v-else>
      <span class="font-bold">{{ title }}</span>
      <slot name="editable"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

defineProps<{
  title: string
}>()
</script>
