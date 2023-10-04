<template>
  <nuxt-link :to="route">
    <span
      class="font-medium transition hover:border-b-2 hover:border-bcgov-blue5"
      :class="{
        'border-b-2 border-bcgov-blue5':
          $route.name?.toString().toLowerCase() === route.toLowerCase(),
      }"
    >
      {{ text }}
    </span>
  </nuxt-link>
</template>

<script setup lang="ts">
import { NavbarLink } from '~/enums/dropdownEnums'

defineProps<{
  text: string
  route: NavbarLink
}>()
</script>
