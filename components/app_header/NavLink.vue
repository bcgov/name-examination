<template>
  <nuxt-link :to="route">
    <span
      class="font-medium transition hover:border-b-2 hover:border-bcgov-blue5 whitespace-nowrap"
      :class="{
        'border-b-2 border-bcgov-blue5': highlight,
      }"
    >
      {{ text }}
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
import { Route } from '~/enums/routes'

const { route } = defineProps<{
  text: string
  route: Route
}>()

const highlight = computed(() =>
  useRoute().path.toString().toLowerCase().startsWith(route.toLowerCase())
)
</script>
