<template>
  <div class="flex flex-col space-y-1">
    <Accordion
      v-for="item in examine.conflicts"
      :key="item.number"
      class="conflict-details rounded-md p-1 open:!bg-sky-100 hover:bg-gray-100"
    >
      <template #title>
        <div class="flex w-full items-center gap-x-2">
          <input
            type="checkbox"
            :disabled="!examine.inProgress"
            :checked="examine.selectedConflicts.includes(item.name)"
            class="h-4 w-4"
            @change="(e) => onItemCheckboxChange(e, item)"
          />
          <HighlightedSubText
            class="grow"
            :text="item.name"
            :start="item.start"
            :end="item.end"
          />
          <div class="space-x-8">
            <span>{{ item.number }}</span>
            <span>{{ item.jurisdiction }}</span>
            <span>{{ item.date }}</span>
          </div>
        </div>
      </template>
      <template #content>
        <ExamineRecipeMatchNames v-if="item.type === 'nr'" />
        <ExamineRecipeMatchCorp v-else-if="item.type === 'corp'" />
        <ExamineRecipeMatchXproCorp v-else-if="item.type === 'xprocorp'" />
      </template>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

onMounted(() => {
  // close all other accordions (which are <details> elements) when one is clicked
  const details = document.getElementsByClassName('conflict-details')
  for (const targetDetail of details) {
    targetDetail.addEventListener('click', () => {
      for (const detail of details) {
        if (detail !== targetDetail) {
          detail.removeAttribute('open')
        }
      }
    })
  }
})

function onItemCheckboxChange(event: Event, item: any) {
  event.stopPropagation()
  const checked = (event.target as HTMLInputElement).checked
  if (checked && !examine.selectedConflicts.includes(item.name)) {
    examine.selectedConflicts.push(item.name)
  } else if (!checked) {
    examine.selectedConflicts = examine.selectedConflicts.filter(
      (conflict) => conflict !== item.name
    )
  }
}
</script>
