<template>
  <div class="rounded-md px-4 py-1 text-sm">
    <ExamineHeaderPopover
      :title="title"
      v-if="examine.headerState === 'minimized'"
    >
      <template #minimized><slot name="minimized"></slot></template>
      <template #expanded><slot name="popup"></slot></template>
    </ExamineHeaderPopover>

    <div class="space-y-1" v-else-if="examine.headerState === 'maximized'">
      <span class="font-bold">{{ title }}</span>
      <slot name="maximized"></slot>
    </div>

    <!-- Editable state -->
    <div class="space-y-1" v-else>
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
