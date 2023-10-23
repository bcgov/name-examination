<template>
  <div class="flex flex-col text-sm">
    <span><b>Submit: </b> {{ submittedDate }}</span>
    <span :class="{ 'text-gray-400': !expiry }"
      ><b>Expiry: </b> {{ expiry ? expiry : 'n/a' }}</span
    >
    <span :class="{ 'text-gray-400': !consumed }"
      ><b>Consumed: </b> {{ consumed ? consumed : 'n/a' }}</span
    >
    <span :class="{ 'text-gray-400': !consumedBy }"
      ><b>Consumed by: </b> {{ consumedBy ? consumedBy : 'n/a' }}</span
    >
  </div>
</template>

<script setup lang="ts">
const submittedDate = ref('2008-09-16, 4:44pm')
const expiry = ref(null)
const consumed = ref(null)
const consumedBy = ref(null)
</script>
