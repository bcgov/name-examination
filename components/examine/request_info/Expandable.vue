<template>
  <div class="rounded-md text-sm">
    <!-- Editable state -->
    <div class="space-y-1" v-if="examine.is_editing">
      <h2 class="font-bold">{{ title }}</h2>
      <slot name="editable"><slot></slot></slot>
    </div>

    <div class="space-y-1" v-else-if="examine.is_header_shown">
      <h2 class="font-bold">{{ title }}</h2>
      <slot name="maximized"><slot></slot></slot>
    </div>

    <ExamineRequestInfoPopover :title="title" v-else>
      <template #minimized>
        <slot name="minimized"><slot></slot></slot>
      </template>
      <template #expanded>
        <slot name="popup"><slot></slot></slot>
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
