<template>
  <div class="flex flex-col">
    <ExamineRecipeConflictsAccordion
      v-for="(item, i) in data"
      :ref="(el) => (accordions[i] = el)"
      class="rounded-md p-1"
      :class="{ 'bg-sky-100': selected === i }"
      @click="accordions[0].click()"
    >
      <template #header>
        <div class="flex w-full items-center gap-x-2">
          <input
            type="checkbox"
            class="h-4 w-4"
            @click="(e) => e.stopPropagation()"
          />
          <ExamineHighlightedSubText
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
      <ExamineRecipeBusinessInfo />
    </ExamineRecipeConflictsAccordion>
  </div>
</template>

<script setup lang="ts">
const accordions = ref<any[]>([])
const hideOther = (id: number) => {
  accordions.value.filter((_, i) => i !== id).forEach((c) => c())
}

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
const selected = ref(0)
</script>
