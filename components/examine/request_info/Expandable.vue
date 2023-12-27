<template>
  <div class="rounded-md text-sm">
    <!-- Editable state -->
    <div class="space-y-1" v-if="examine.is_editing">
      <header class="font-bold">{{ title }}</header>
      <slot name="editable"></slot>
    </div>

    <div class="space-y-1" v-else-if="examine.is_header_shown">
      <header class="font-bold">{{ title }}</header>
      <slot name="maximized"></slot>
    </div>

    <ExamineRequestInfoPopover :title="title" v-else>
      <template #minimized>
        <slot name="minimized"></slot>
      </template>
      <template #expanded>
        <slot name="popup"></slot>
      </template>
    </ExamineRequestInfoPopover>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

defineProps<{
  title: string
}>()
</script>
