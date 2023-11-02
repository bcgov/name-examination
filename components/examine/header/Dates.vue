<template>
  <div class="flex flex-col text-sm">
    <ExamineHeaderItem title="" hide-popover-button>
      <div class="flex">
        <h2 class="font-bold">Submit:&nbsp;</h2>
        <span>{{ submittedDate }}</span>
      </div>

      <div class="flex" :class="{ 'text-gray-400': !expiry }">
        <h2 class="font-bold">Expiry:&nbsp;</h2>
        <span>{{ expiry ? expiry : 'n/a' }}</span>
      </div>

      <div class="flex" :class="{ 'text-gray-400': !consumed }">
        <h2 class="font-bold">Consumed:&nbsp;</h2>
        <span>{{ consumed ? consumed : 'n/a' }}</span>
      </div>

      <div class="flex" :class="{ 'text-gray-400': !consumedBy }">
        <h2 class="font-bold">Consumed By:&nbsp;</h2>
        <span>{{ consumedBy ? consumedBy : 'n/a' }}</span>
      </div>
    </ExamineHeaderItem>
  </div>
</template>

<script setup lang="ts">
const submittedDate = ref('2008-09-16, 4:44pm')
const expiry = ref(null)
const consumed = ref(null)
const consumedBy = ref(null)
</script>
