<template>
  <div class="rounded-md border border-gray-300">
    <div class="mb-6 ml-2 mt-2">
      Current status on
      <span id="date">{{ status.todayStr }}</span>
    </div>
    <div class="my-6 ml-2">
      Not Examined:
      <span
        id="notExamined"
        class="font-bold"
      >{{ notExaminedNum }}</span>
    </div>
    <div class="mb-2 ml-2 mt-6">
      Hold: <span
        id="hold"
        class="font-bold"
      >{{ holdNum }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatusStore } from '~/store/status'

const status = useStatusStore()
status.update()

const notExaminedNum = computed(() => status.notExaminedNum)
const holdNum = computed(() => status.holdNum)

// onMounted(async () => await status.update())
</script>
