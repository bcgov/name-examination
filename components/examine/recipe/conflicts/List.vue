<template>
  <div class="flex flex-col space-y-1">
    <Accordion
      v-for="item in data"
      :key="item.number"
      class="conflict-details rounded-md p-1 open:!bg-sky-100 hover:bg-gray-100"
    >
      <template #title>
        <div class="flex w-full items-center gap-x-2">
          <input
            type="checkbox"
            :disabled="!examine.inProgress"
            class="h-4 w-4"
            @click="(e) => e.stopPropagation()"
          />
          <HighlightedSubText
            class="grow"
            :text="item.name"
            :start="0"
            :end="1"
          />
          <div class="space-x-8">
            <span>{{ item.number }}</span>
            <span>{{ item.jurisdiction }}</span>
            <span>{{ item.date }}</span>
          </div>
        </div>
      </template>
      <template #content>
        <ExamineRecipeMatchCorp />
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

const data = [
  {
    name: 'ADA SO LTD.',
    number: '0685772',
    jurisdiction: 'BC',
    date: '2004-01-22',
  },
  {
    name: 'S&O TECHNOLOGIES INC.',
    number: '0769877',
    jurisdiction: 'BC',
    date: '2006-09-25',
  },
]
</script>
