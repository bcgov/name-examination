<template>
  <div class="grid grid-cols-2">
    
  </div>
</template>

<script setup lang="ts">
import type { NameChoice } from '~/types';

defineProps<{
  names: Array<NameChoice>
}>()
</script>