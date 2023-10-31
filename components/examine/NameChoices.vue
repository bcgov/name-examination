<template>
  <ol v-if="examine.headerState !== 'editable'" class="ml-4 list-decimal">
    <li>
      <div class="flex items-center gap-x-1">
        <span>FIRST NAME CHOICE</span>
        <IconButton
          white
          v-if="examine.inProgress"
          text="Undo Decision"
          class="border-none text-sm"
        >
          <XMarkIcon class="h-5 w-5 text-red-600" />
        </IconButton>
        <XMarkIcon v-else class="h-5 w-5 text-red-600" />
      </div>
    </li>
    <li class="font-bold">SECOND NAME CHOICE</li>
    <li>THIRD NAME CHOICE</li>
  </ol>

  <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
    <li><TextInput value="FIRST NAME CHOICE" /></li>
    <li><TextInput value="SECOND NAME CHOICE" /></li>
    <li><TextInput value="THIRD NAME CHOICE" /></li>
  </ol>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()
</script>
