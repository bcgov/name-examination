<template>
  <ol v-if="!examine.is_editing" class="list-decimal">
    <li>
      <ExamineNameChoice
        :choice="examine.compName1"
        :undoable="examine.isUndoable(examine.compName1)"
        :current="isCurrent(1)"
      />
    </li>
    <li>
      <ExamineNameChoice
        :choice="examine.compName2"
        :undoable="examine.isUndoable(examine.compName2)"
        :current="isCurrent(2)"
      />
    </li>
    <li>
      <ExamineNameChoice
        :choice="examine.compName3"
        :undoable="examine.isUndoable(examine.compName3)"
        :current="isCurrent(3)"
      />
    </li>
  </ol>

  <ol v-else class="ml-4 basis-1/3 list-decimal space-y-2">
    <li><TextInput :value="examine.compName1.name" /></li>
    <li><TextInput :value="examine.compName2.name" /></li>
    <li><TextInput :value="examine.compName3.name" /></li>
  </ol>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()

const isCurrent = (index: number) => examine.currentChoice === index
</script>
