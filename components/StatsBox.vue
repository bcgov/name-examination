<template id="stats-box">
  <div class="stats-box mr-20 shadow-lg">
    <div class="mb-6 ml-2 mt-2">
      Current status on
      <span
        id="date"
      >{{ status.todayStr }}</span>
    </div>
    <div class="my-6 ml-2">
      Not Examined:
      <span
        id="notExamined"
        class="font-bold"
      >{{ status.notExaminedNum }}</span>
    </div>
    <div class="mb-2 ml-2 mt-6">
      Hold: <span
        id="hold"
        class="font-bold"
      >{{ status.holdNum }}</span>
    </div>
  </div>
</template>

<script setup>
import { Fetchstatus } from '../store/fetchstatus'
const status = Fetchstatus()

status.getHoldedNum()
status.getExaminedNum()
</script>
