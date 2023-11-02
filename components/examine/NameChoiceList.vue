<template>
  <ol v-if="examine.headerState !== 'editable'" class="ml-4 list-decimal">
    <li><ExamineNameChoice :name="firstName" state="REJECTED" undoable /></li>
    <li><ExamineNameChoice :name="secondName" current /></li>
    <li><ExamineNameChoice :name="thirdName" /></li>
  </ol>

  <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
    <li><TextInput value="FIRST NAME CHOICE" /></li>
    <li><TextInput value="SECOND NAME CHOICE" /></li>
    <li><TextInput value="THIRD NAME CHOICE" /></li>
  </ol>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const firstName = 'STEEPHILL COOP'
const secondName = 'NOT SO STEEP COOPERATIVE'
const thirdName = 'BLACK HILL PERSONAL COOP COOPERATIVE'

const examine = useExamineStore()
</script>
